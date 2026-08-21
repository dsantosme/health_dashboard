# Imagens dos materiais-fonte

Esta pasta guarda as ilustrações recortadas de:

- **Anatomia do Ciclismo** (Shannon Sovndal, Manole) — fotos das páginas;
- **Primeiros passos para dominar a sua bike** (Ludolf Bike School) — imagens do PDF.

**Os arquivos não são versionados.** São obra protegida por direito autoral e este
repositório é público — commitar os recortes seria redistribuição. Cada pessoa que
tem os originais gera a própria cópia local.

O app funciona sem esta pasta: quando um arquivo não existe, o card do exercício
mostra a figura SVG gerada por código (`src/illustrations/`). O registro em
`src/data/figuras.ts` é versionado — ele só declara nomes de arquivo.

## Como gerar

```bash
python3 -m pip install pillow numpy
python3 scripts/extrair-figuras.py \
  --fotos ~/caminho/das/fotos-do-livro \
  --ebook ~/caminho/do/ebook-lbs.pdf \
  --saida src/assets/livro
```

O script recorta as ilustrações automaticamente: remove a aba escura do capítulo,
separa o desenho do texto ao lado pela calha de papel em branco (ou pela moldura,
nas páginas de "Enfoque no ciclismo"), corrige o amarelado da foto e exporta em WebP.
O mapa de páginas fica em `scripts/figuras.json`.
