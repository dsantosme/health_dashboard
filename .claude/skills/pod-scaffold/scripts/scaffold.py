#!/usr/bin/env python3
"""SK-01 — cria a estrutura padrão de um pod de 45 dias.

Uso:
    python3 .claude/skills/pod-scaffold/scripts/scaffold.py \
        --client acme --usecase FT-06.2 [--dry-run]

Regras que o script aplica (e por isso ele existe, em vez de instruções em prosa):
  * o slug é validado e imutável (entra em caminho, tag de custo e ACL);
  * o FT-* precisa existir em docs/plan/plan.yaml — "nunca invente IDs";
  * nada é sobrescrito: arquivo existente é preservado e reportado;
  * --dry-run mostra a árvore sem tocar no disco.

Sem dependências externas: roda em qualquer máquina com Python 3.9+.
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
PLAN = REPO / "docs" / "plan" / "plan.yaml"
SLUG_RE = re.compile(r"^[a-z][a-z0-9-]{1,30}[a-z0-9]$")


def die(msg: str) -> "NoReturn":  # type: ignore[valid-type]
    print(f"erro: {msg}", file=sys.stderr)
    raise SystemExit(1)


def known_ids() -> set[str]:
    if not PLAN.exists():
        die(f"{PLAN} não encontrado; ele é a fonte de verdade do projeto.")
    return set(re.findall(r"id:\s*([A-Z]+-[\d.]+)", PLAN.read_text(encoding="utf-8")))


def files_for(slug: str, usecase: str, feature_dir: str) -> dict[str, str]:
    today = date.today().isoformat()
    return {
        f"clients/{slug}/README.md": f"""# Pod — {slug}

Caso de uso: **{usecase}** · início: {today} · encerramento previsto: dia 45.

| Arquivo | O que é |
| --- | --- |
| `steering/client-{slug}.md` | contexto do cliente (ST-10) |
| `baseline.md` | medição do dia 1 (US-10) |
| `budget.md` | orçamento de tokens do pod (ST-05) |
| `evals/` | casos específicos deste cliente |
| `connectors/` | conectores MOD-00 deste cliente |

Regra que não se negocia: o índice de RAG deste pod **não** é compartilhado com
nenhum outro cliente (US-08).
""",
        f"clients/{slug}/steering/client-{slug}.md": f"""---
id: ST-10
inclusion: "fileMatch: clients/{slug}/**"
---

# Cliente {slug} (ST-10)

> Preencher a partir do roteiro de descoberta (SK-11). Campo vazio é lacuna
> conhecida, não detalhe: registre "a levantar" com data.

## Sistemas

| Sistema | Papel no processo | Acesso | Escopo concedido |
| --- | --- | --- | --- |
| | | | |

## Glossário do cliente

Termos que significam algo diferente aqui do que significam fora.

## Políticas e restrições

- Janela de mudança:
- Dados que não podem sair do ambiente:
- Aprovadores por tipo de ação (ST-04):

## Contatos

| Papel | Pessoa | Quando acionar |
| --- | --- | --- |
| Comprador | | |
| Dono do processo | | |
| Segurança/TI | | |

## KPIs do pod

| KPI | Baseline (dia 1) | Meta (dia 45) |
| --- | --- | --- |
| | | |
""",
        f"clients/{slug}/baseline.md": f"""# Baseline do dia 1 — {slug}

Medido em: {today} · responsável: · fonte dos números:

| Dimensão | Valor hoje | Como foi medido |
| --- | --- | --- |
| Volume (casos/mês) | | |
| Tempo por caso | | |
| Custo por caso | | |
| Qualidade (retrabalho, erro) | | |

Sem estes quatro números, o relatório do dia 45 não pode ser gerado (US-10) e o
pod não fecha. Se algum for estimativa, marque como estimativa e diga a margem.
""",
        f"clients/{slug}/budget.md": f"""# Orçamento do pod — {slug}

Conforme ST-05 e P-06. Estouro alerta (HK-08) e bloqueia merge até revisão (PR-10).

| Agente | Teto de tokens/dia | Modelo padrão | Fallback |
| --- | --- | --- | --- |
| | | | |

Custo por resultado alvo: R$ ___ por caso resolvido.
""",
        f"clients/{slug}/evals/README.md": f"""# Evals do pod {slug}

Casos específicos deste cliente, somados às suítes da plataforma (EV-*).
Toda falha em produção neste pod vira caso aqui, no mesmo dia (P-03).
""",
        f"clients/{slug}/connectors/README.md": f"""# Conectores — {slug}

MCP servers e adapters deste cliente (MOD-00). Escopo mínimo por ferramenta
(HR-03): um conector de leitura não recebe credencial de escrita.
""",
        f".kiro/specs/{feature_dir}/requirements.md": f"""# requirements.md — {usecase}

## Contexto

Pod {slug}. Preencher a partir das metas do pod e do diagnóstico (SK-11).

## Requisitos (EARS)

- R1 WHEN <gatilho observável> THE SYSTEM SHALL <comportamento verificável>.

## Métricas

- <número> (<ID do eval que mede>)

## Fora de escopo

- <o que não está aqui> (vive em <ID>)
""",
        f".kiro/specs/{feature_dir}/design.md": f"""# design.md — {usecase}

## Decisão

Uma frase. Se houver alternativa real descartada, isto é um ADR (SK-13), não um
parágrafo aqui.

## Componentes

| Módulo | Papel nesta feature | Contrato (port) |
| --- | --- | --- |
| | | |

## Fluxo

1.

## Riscos e mitigação

| Risco | Como percebemos | Mitigação |
| --- | --- | --- |
| | | |
""",
        f".kiro/specs/{feature_dir}/tasks.md": f"""# tasks.md — {usecase}

Uma tarefa, um PR. Cada tarefa cita o requisito que satisfaz e termina com
evidência (P-02, ST-03).

- [ ] T1 — <o que fazer> · satisfaz R1 · evidência: <teste/eval>
""",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="SK-01 — scaffold de pod de 45 dias")
    parser.add_argument("--client", required=True, help="slug do cliente (minúsculo, com hífens)")
    parser.add_argument("--usecase", required=True, help="ID da feature do plano, ex.: FT-06.2")
    parser.add_argument("--dry-run", action="store_true", help="mostra a árvore sem escrever")
    args = parser.parse_args()

    slug = args.client
    if not SLUG_RE.match(slug):
        die(f"slug inválido: {slug!r}. Use minúsculas, dígitos e hífens (3–32 chars).")

    usecase = args.usecase.upper()
    if usecase not in known_ids():
        die(
            f"{usecase} não existe em docs/plan/plan.yaml.\n"
            f"Proponha o ID em docs/plan/proposed.yaml e pare para aprovação humana."
        )

    feature_dir = usecase.lower().replace(".", "-")
    planned = files_for(slug, usecase, feature_dir)

    created, skipped = [], []
    for rel, body in sorted(planned.items()):
        path = REPO / rel
        if path.exists():
            skipped.append(rel)
            continue
        created.append(rel)
        if not args.dry_run:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(body, encoding="utf-8")

    prefix = "criaria" if args.dry_run else "criou"
    print(f"SK-01 {prefix} {len(created)} arquivo(s) para o pod {slug} ({usecase}):")
    for rel in created:
        print(f"  + {rel}")
    for rel in skipped:
        print(f"  = {rel} (já existe, preservado)")

    print(
        "\nPróximos passos:\n"
        f"  1. Preencher clients/{slug}/steering/client-{slug}.md a partir de SK-11.\n"
        f"  2. Registrar a baseline do dia 1 em clients/{slug}/baseline.md (US-10).\n"
        f"  3. Escrever os requisitos EARS em .kiro/specs/{feature_dir}/requirements.md.\n"
        "  4. Rodar `pnpm orbe:validate` e abrir o PR com o checklist de pronto."
    )


if __name__ == "__main__":
    main()
