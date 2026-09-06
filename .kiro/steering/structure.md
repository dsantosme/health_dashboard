---
id: ST-03
inclusion: always
---

# Estrutura e convenções (ST-03)

## Onde fica o quê

```
docs/plan/plan.yaml        fonte de verdade: todos os IDs e o backlog
docs/plan/proposed.yaml    IDs propostos, aguardando aprovação humana
docs/adr/                  ADR-0001.. decisões de arquitetura (SK-13)
docs/runbooks/             operação de cada agente entregue (SK-07)
.kiro/steering/            ST-01..ST-10 — contexto carregado por inclusão
.kiro/specs/<feature>/     requirements.md (EARS) → design.md → tasks.md
.claude/skills/<skill>/    SKILL.md + scripts/ + references/
.claude/agents/            subagentes revisores (HR-06)
.claude/hooks/             HK-01..HK-08 + README (registro em .claude/settings.json, HR-05)
.claude/rules/             regras curtas por área, citadas pelas skills
src/gateway/               MOD-01   src/guardrails/     MOD-02
src/knowledge/             MOD-03   src/orchestration/  MOD-04
src/evals/                 MOD-05   src/finops/         MOD-06
src/agents/                AG-00..AG-10 e templates AT-01..AT-05
src/mcp-servers/           MOD-00   src/portal/         MOD-09
clients/<slug>/            steering do cliente (ST-10), conectores, evals
infra/                     IaC (CDK/Terraform)
progress.md                estado de sessões longas (PR-11, HK-06)
```

`client/`, `server/` e `shared/` são a aplicação de produto que já existia neste
repositório. `src/` é a plataforma ORBE. Os dois se encontram só por contrato
(port), nunca por import direto de implementação.

## Nomenclatura de IDs

- **Nunca invente um ID.** Se precisar de um novo, escreva em
  `docs/plan/proposed.yaml` com `rationale` e pare para aprovação humana.
- Todo arquivo de spec, skill, steering, hook e eval declara seu ID no
  front-matter (`id: FT-04.1`).
- Todo teste que prova uma user story cita o ID no nome:
  `it("US-06: bloqueia PII na saída que não estava na entrada")`.

## Commits e PRs

- Commit: `<tipo>(<ID>): <o que mudou>` — ex.: `feat(FT-04.2): mascara CPF na entrada`.
  Tipos: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
- PR: título com o ID do épico ou feature; corpo com **evidência obrigatória**
  (saída de `pnpm test`, pass rate de evals, custo estimado). PR sem evidência
  não passa na revisão do subagente (PR-05).
- Um PR por tarefa de `tasks.md`. Tarefa sem spec não vira PR (P-02).

## Ciclo de uma tarefa

1. Ler a tarefa em `.kiro/specs/<feature>/tasks.md` e o requisito EARS que ela satisfaz.
2. Declarar orçamento de tokens da tarefa (P-06, ST-05).
3. Escrever o teste que falha, depois o código.
4. `pnpm check && pnpm test && pnpm orbe:validate`.
5. Marcar a tarefa como concluída em `tasks.md` com o link do commit.
6. Atualizar `progress.md` ao fim da sessão: feito, evidências, próximos passos, custo.
