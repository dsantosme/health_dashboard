#!/usr/bin/env python3
"""Recorta as ilustracoes dos materiais-fonte para dentro de src/assets/livro.

As imagens geradas NAO vao para o git (ver src/assets/livro/README.md). Este
script existe para que quem tem os originais reproduza a extracao na propria
maquina.

Uso:
    python3 scripts/extrair-figuras.py --fotos ~/fotos-livro \
        --ebook ~/ebook-lbs.pdf --saida src/assets/livro

Como funciona o recorte das paginas do livro:
  1. corta a caixa generosa declarada em scripts/mapa-paginas.json;
  2. corrige o amarelado da foto esticando cada canal ate o papel virar branco;
  3. remove a aba escura do capitulo, que fica em uma das bordas;
  4. nas paginas de "Enfoque no ciclismo", isola o desenho do texto ao lado —
     primeiro tentando a moldura retangular (com tolerancia a foto torta),
     depois pela maior calha de papel em branco;
  5. apara ate o conteudo e exporta em WebP.
"""
from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
import zlib

try:
    import numpy as np
    from PIL import Image, ImageEnhance, ImageOps
except ImportError:  # pragma: no cover
    sys.exit('Faltam dependencias: python3 -m pip install pillow numpy')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# --------------------------------------------------------------------------
# tratamento de imagem
# --------------------------------------------------------------------------

def limpar(im: Image.Image) -> Image.Image:
    """Tira o amarelado da foto: o branco do papel vira branco de verdade."""
    a = np.asarray(im.convert('RGB'), dtype=np.float32)
    for c in range(3):
        canal = a[..., c]
        baixo, alto = np.percentile(canal, 2), np.percentile(canal, 98)
        a[..., c] = np.clip((canal - baixo) * 255.0 / max(1.0, alto - baixo), 0, 255)
    return ImageEnhance.Contrast(Image.fromarray(a.astype(np.uint8))).enhance(1.12)


def aparar(im: Image.Image, limiar: int = 205, margem: int = 10) -> Image.Image:
    """Reduz a caixa ate o conteudo."""
    g = np.asarray(im.convert('L'))
    tinta = g < limiar
    if not tinta.any():
        return im
    linhas = np.flatnonzero(tinta.sum(axis=1) > max(2, im.width * 0.004))
    colunas = np.flatnonzero(tinta.sum(axis=0) > max(2, im.height * 0.004))
    if not len(linhas) or not len(colunas):
        return im
    return im.crop((
        max(0, colunas[0] - margem), max(0, linhas[0] - margem),
        min(im.width, colunas[-1] + margem), min(im.height, linhas[-1] + margem),
    ))


def tirar_aba(im: Image.Image) -> Image.Image:
    """Corta a aba escura do capitulo, mesmo com margem de papel antes dela."""
    escuro = (np.asarray(im.convert('L')) < 110).mean(axis=0)
    n = im.width
    lim = max(8, int(n * 0.22))
    x0, x1 = 0, n
    faixa = np.flatnonzero(escuro[:lim] > 0.30)
    if len(faixa):
        fim = faixa[-1]
        while fim + 1 < lim and escuro[fim + 1] > 0.08:
            fim += 1
        x0 = fim + 1
    faixa = np.flatnonzero(escuro[n - lim:] > 0.30)
    if len(faixa):
        ini = n - lim + faixa[0]
        while ini - 1 > n - lim and escuro[ini - 1] > 0.08:
            ini -= 1
        x1 = ini
    return im.crop((x0, 0, max(x0 + 10, x1), im.height))


def _dilatar(m, r, eixo):
    out = m.copy()
    for k in range(1, r + 1):
        if eixo == 0:
            out[k:] |= m[:-k]
            out[:-k] |= m[k:]
        else:
            out[:, k:] |= m[:, :-k]
            out[:, :-k] |= m[:, k:]
    return out


def moldura(im: Image.Image, cobertura: float = 0.45):
    """Acha o quadro retangular das paginas de 'Enfoque no ciclismo'.

    A dilatacao antes de medir cobertura e o que torna isso tolerante a foto
    tirada torta: sem ela, uma linha reta com 1 grau de inclinacao nunca cobre
    a largura inteira em nenhuma linha de pixels.
    """
    tinta = np.asarray(im.convert('L')) < 150
    lin = _dilatar(tinta, max(4, im.height // 160), 0).mean(axis=1)
    col = _dilatar(tinta, max(4, im.width // 160), 1).mean(axis=0)
    ls, cs = np.flatnonzero(lin > cobertura), np.flatnonzero(col > cobertura)
    if len(ls) < 2 or len(cs) < 2:
        return None
    y0, y1, x0, x1 = ls[0], ls[-1], cs[0], cs[-1]
    if (y1 - y0) < im.height * 0.3 or (x1 - x0) < im.width * 0.4:
        return None
    return im.crop((x0 + 3, y0 + 3, x1 - 2, y1 - 2))


def _faixas_vazias(perfil, minimo):
    faixas, ini = [], None
    for i, v in enumerate(perfil):
        if v <= minimo:
            ini = i if ini is None else ini
        elif ini is not None:
            faixas.append((ini, i))
            ini = None
    if ini is not None:
        faixas.append((ini, len(perfil)))
    return faixas


def isolar_desenho(im: Image.Image, vazio: float = 0.012, lados: bool = True) -> Image.Image:
    """Separa o desenho do texto vizinho usando as calhas de papel em branco.

    A foto tem granulacao, entao "linha vazia" nao e ink==0: e ink abaixo de
    ~1% da largura. Repete o corte porque as vezes sobra mais de um bloco.
    """
    for _ in range(2):
        tinta = np.asarray(im.convert('L')) < 150
        if not lados:
            # dentro da moldura o desenho ja ocupa a largura toda: mexer nas
            # laterais so corta braco de ciclista
            faixas = [f for f in _faixas_vazias(tinta.mean(axis=1), vazio) if f[1] - f[0] > im.height * 0.018]
            limite = next((a for a, b in faixas if (a + b) / 2 / im.height > 0.6), None)
            if limite:
                im = im.crop((0, 0, im.width, limite))
            continue
        # coluna: texto a esquerda
        faixas = [f for f in _faixas_vazias(tinta.mean(axis=0), vazio) if f[1] - f[0] > im.width * 0.025]
        limite = next((b for a, b in reversed(faixas) if 0.03 < (a + b) / 2 / im.width < 0.55), None)
        if limite:
            im = im.crop((limite, 0, im.width, im.height))
        # coluna: texto a direita
        tinta = np.asarray(im.convert('L')) < 150
        faixas = [f for f in _faixas_vazias(tinta.mean(axis=0), vazio) if f[1] - f[0] > im.width * 0.025]
        limite = next((a for a, b in faixas if 0.55 < (a + b) / 2 / im.width < 0.97), None)
        if limite:
            im = im.crop((0, 0, limite, im.height))
        # linha: texto embaixo
        tinta = np.asarray(im.convert('L')) < 150
        faixas = [f for f in _faixas_vazias(tinta.mean(axis=1), vazio) if f[1] - f[0] > im.height * 0.018]
        limite = next((a for a, b in faixas if (a + b) / 2 / im.height > 0.55), None)
        if limite:
            im = im.crop((0, 0, im.width, limite))
        # linha: texto em cima
        tinta = np.asarray(im.convert('L')) < 150
        faixas = [f for f in _faixas_vazias(tinta.mean(axis=1), vazio) if f[1] - f[0] > im.height * 0.018]
        limite = next((b for a, b in reversed(faixas) if (a + b) / 2 / im.height < 0.35), None)
        if limite:
            im = im.crop((0, limite, im.width, im.height))
    return im


def recortar_pagina(caminho, caixa, saida, enfoque=False, largura_max=1100):
    im = ImageOps.exif_transpose(Image.open(caminho)).convert('RGB')
    W, H = im.size
    x0, y0, x1, y1 = caixa
    corte = tirar_aba(limpar(im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))))
    if enfoque:
        dentro = moldura(corte)
        corte = (isolar_desenho(dentro, lados=False) if dentro is not None
                 else isolar_desenho(corte))
    corte = aparar(corte)
    if corte.width > largura_max:
        corte = corte.resize((largura_max, int(corte.height * largura_max / corte.width)), Image.LANCZOS)
    corte.save(saida, quality=88, method=6)
    return corte.size


# --------------------------------------------------------------------------
# e-book: as imagens ja vem embutidas como JPEG no PDF
# --------------------------------------------------------------------------

MAPA_EBOOK = {
    'mob_sola_pe--execucao': 49, 'mob_gastrocnemio--execucao': 50, 'mob_soleo--execucao': 51,
    'mob_isquiotibiais--execucao': 52, 'mob_gluteo_deitado--execucao': 54,
    'tec_postura_ataque--execucao': 41, 'tec_pedalada_unilateral--execucao': 44,
    'setup_selim_altura': 28, 'setup_selim_joelho': 29, 'setup_pes_pedal': 47,
    'setup_manetes': 14, 'setup_guidom_giro': 11, 'setup_guidom_largura': 7,
    'setup_nervos_mao': 10, 'setup_suspensao': 25, 'setup_pneus': 26,
    'anat_cadeia_posterior': 48, 'anat_retroversao': 33, 'anat_pedalada_musculos': 45,
    'anat_cervical_celular': 60, 'anat_gluteo_patela': 53, 'anat_psoas': 57,
    'anat_quadrado_lombar': 59, 'anat_quadriceps': 56,
}


def imagens_do_pdf(caminho, minimo=260):
    """Extrai os JPEGs embutidos, na ordem em que aparecem no arquivo."""
    dados = open(caminho, 'rb').read()
    achadas = []
    for m in re.finditer(rb'/Subtype\s*/Image', dados):
        ini = dados.rfind(b'obj', 0, m.start())
        s = dados.find(b'stream', m.start())
        if s < 0 or b'DCTDecode' not in dados[ini:s]:
            continue
        s = dados.find(b'\n', s) + 1
        bruto = dados[s:dados.find(b'endstream', s)].rstrip(b'\r\n')
        try:
            im = Image.open(io.BytesIO(bruto))
            im.load()
        except Exception:
            continue
        if im.width >= minimo and im.height >= minimo:
            achadas.append(im)
    return achadas


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--fotos', help='pasta com as fotos das paginas do livro')
    p.add_argument('--ebook', help='PDF do e-book da Ludolf Bike School')
    p.add_argument('--saida', default=os.path.join(RAIZ, 'src/assets/livro'))
    p.add_argument('--mapa', default=os.path.join(RAIZ, 'scripts/mapa-paginas.json'))
    args = p.parse_args()
    os.makedirs(args.saida, exist_ok=True)
    total = 0

    if args.fotos:
        arquivos = sorted(
            (f for f in os.listdir(args.fotos) if f.lower().endswith(('.jpg', '.jpeg', '.png'))),
            key=lambda f: os.path.getmtime(os.path.join(args.fotos, f)),
        )
        mapa = json.load(open(args.mapa))
        for item in mapa:
            # casa pelo nome original; se nao achar, cai na posicao da lista
            alvo = next((f for f in arquivos if item['arquivo'].split('.')[0] in f), None)
            if alvo is None and item['idx'] < len(arquivos):
                alvo = arquivos[item['idx']]
            if alvo is None:
                print(f"  ! sem foto para {item['id']}--{item['tipo']}")
                continue
            nome = f"{item['id']}--{item['tipo']}.webp"
            tam = recortar_pagina(os.path.join(args.fotos, alvo), item['caixa'],
                                  os.path.join(args.saida, nome), enfoque=item['tipo'] == 'enfoque')
            print(f'  {nome} {tam}')
            total += 1

    if args.ebook:
        imagens = imagens_do_pdf(args.ebook)
        print(f'  {len(imagens)} imagens encontradas no e-book')
        for nome, indice in MAPA_EBOOK.items():
            if indice > len(imagens):
                continue
            im = imagens[indice - 1].convert('RGB')
            if im.width > 900:
                im = im.resize((900, int(im.height * 900 / im.width)), Image.LANCZOS)
            im.save(os.path.join(args.saida, f'{nome}.webp'), quality=86, method=6)
            total += 1

    print(f'{total} arquivos em {args.saida}')


if __name__ == '__main__':
    main()
