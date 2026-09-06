# tasks.md — EP-04 Gateway e guardrails v0.1

Uma tarefa, um PR. Cada tarefa cita o requisito que satisfaz e termina com
evidência (P-02, ST-03). Orçamento do épico: declarar antes de T1.

## FT-04.2 — Guardrails de PII

- [x] **T1** — Detector de PII brasileira (CPF, CNPJ, e-mail, telefone, CEP,
      cartão) com validação de dígito verificador · satisfaz R9, R13 ·
      evidência: `src/guardrails/domain/pii.test.ts`
- [x] **T2** — Mascaramento com marcador estável e restauração na saída ·
      satisfaz R10, R11 · evidência: `src/guardrails/domain/pii.test.ts`
- [x] **T3** — Bloqueio de PII na saída ausente da entrada · satisfaz R12 ·
      evidência: `src/guardrails/domain/guardrail.test.ts`

## FT-04.1 / FT-04.3 — Gateway

- [x] **T4** — Ports `ModelProvider`, `RoutingPolicy`, `CostLedger` e adapter em
      memória · satisfaz ADR-0001 · evidência: `src/gateway/ports/`
- [x] **T5** — Seleção por política com dados regulados e latência · satisfaz
      R1, R2, R3 · evidência: `src/gateway/domain/routing.test.ts`
- [x] **T6** — Execução com fallback e registro de tentativas · satisfaz R4, R5 ·
      evidência: `src/gateway/domain/gateway.test.ts`
- [x] **T7** — Atribuição obrigatória de agente e caso de uso · satisfaz R7 ·
      evidência: `src/gateway/domain/gateway.test.ts`
- [x] **T8** — Lançamento de custo em sucesso e em erro · satisfaz R6 ·
      evidência: `src/finops/domain/ledger.test.ts`
- [x] **T9** — Teto de orçamento diário por agente · satisfaz R8 ·
      evidência: `src/finops/domain/ledger.test.ts`

## F-02.2 — Classificação de risco

- [x] **T10** — Classificação `read`/`write`/`irreversible` e ponto de aprovação ·
      satisfaz R14, R15 · evidência: `src/orchestration/domain/hitl.test.ts`

## Pendentes deste épico

- [ ] **T11** — Adapter Bedrock para `ModelProvider`, com credencial em cofre ·
      satisfaz R1 em produção · requer conta de laboratório
- [ ] **T12** — Adapter persistente de `CostLedger` e conciliação com billing ·
      satisfaz F-06.1 · horizonte H60
- [ ] **T13** — Cache de prompt e batch · FT-04.4 · horizonte H60
