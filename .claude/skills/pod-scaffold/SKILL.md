---
name: pod-scaffold
id: SK-01
description: Cria a estrutura padrão de um pod de 45 dias (pasta do cliente, steering ST-10, spec do caso de uso, evals e baseline). Use quando um novo cliente ou caso de uso for iniciado, com proposta assinada e slug definido.
---

# Pod scaffold (SK-01)

## Quando usar

Pod aprovado (proposta assinada) com **slug do cliente** e **caso de uso** definidos.
Se ainda não houver diagnóstico, rode SK-11 antes — pod sem dor medida não tem
baseline, e sem baseline não há KPI no dia 45.

## Passos

1. Rode `python3 scripts/scaffold.py --client <slug> --usecase <FT-id> --dry-run` e
   confira a árvore proposta. Só então rode sem `--dry-run`.
2. Preencha `clients/<slug>/steering/client-<slug>.md` (ST-10) a partir do
   roteiro de descoberta (SK-11): sistemas, glossário, políticas, contatos,
   restrições, KPIs do pod.
3. Escreva `.kiro/specs/<caso-de-uso>/requirements.md` em EARS a partir das metas
   do pod. Use `references/requirements-template.md`.
4. Registre a **baseline do dia 1** (volume, tempo, custo, qualidade) em
   `clients/<slug>/baseline.md`. Sem número aqui, o pod não pode fechar (US-10).
5. Declare o orçamento de tokens do pod (ST-05) em `clients/<slug>/budget.md`.
6. Abra PR com o checklist de pronto de `references/definition-of-done.md`.

## Gotchas

- **Não reutilize índice de RAG entre clientes.** ACL é por cliente e o índice
  também (US-08). Um índice compartilhado é achado crítico do reviewer-security.
- **Sem dados prontos, não comece por MOD-03.** Abra tarefa de MOD-00 (conectores)
  primeiro; RAG sobre dado que ninguém curou produz baseline falsa.
- **Slug é imutável.** Ele entra em caminho de arquivo, tag de custo e ACL;
  renomear depois quebra a atribuição de custo histórica.
- O caso de uso precisa de um FT-* existente em `docs/plan/plan.yaml`. Se não
  existir, proponha em `docs/plan/proposed.yaml` e **pare para aprovação**.

## Scripts

- `scripts/scaffold.py --client <slug> --usecase <FT-id> [--dry-run]`

## Referências

- `references/requirements-template.md` — modelo EARS
- `references/definition-of-done.md` — checklist de PR do pod
