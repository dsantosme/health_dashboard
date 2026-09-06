# Checklist de pronto — PR de pod (SK-01)

Cole no corpo do PR e marque item a item. PR sem evidência não passa em PR-05.

## Spec

- [ ] Tarefa vem de `.kiro/specs/<feature>/tasks.md` e cita o requisito EARS.
- [ ] IDs usados existem em `docs/plan/plan.yaml` (`pnpm orbe:validate` verde).
- [ ] Decisão de arquitetura, se houve, tem ADR em `docs/adr/` (SK-13).

## Evidência

- [ ] `pnpm check` verde (saída colada).
- [ ] `pnpm test` verde (saída colada).
- [ ] Suíte de eval da feature rodou; pass rate ≥ limiar do plano (colar número).

## Segurança (ST-04)

- [ ] Nenhum segredo em código, log, teste ou fixture.
- [ ] Ação `write`/`irreversible` tem ponto de aprovação com evidência.
- [ ] PII mascarada na entrada e na saída; ACL do RAG por cliente.
- [ ] Revisão do subagente `reviewer-security` anexada.

## Custo (P-06)

- [ ] Orçamento de tokens declarado na tarefa.
- [ ] Estimativa de custo/dia do caminho quente anexada.
- [ ] Revisão do subagente `reviewer-cost` anexada.

## Cliente

- [ ] Baseline do dia 1 registrada em `clients/<slug>/baseline.md`.
- [ ] Runbook atualizado (SK-07) se o comportamento operacional mudou.
