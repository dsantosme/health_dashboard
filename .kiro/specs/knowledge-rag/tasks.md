# tasks.md — EP-05 Conhecimento e RAG v0.1

Uma tarefa, um PR. Cada tarefa cita o requisito que satisfaz e termina com
evidência (P-02, ST-03).

## FT-05.1 — Ingestão e chunking

- [x] **T1** — Chunking por tipo (texto, planilha, ticket) preservando ordem ·
      satisfaz R1 · evidência: `src/knowledge/domain/chunking.test.ts`
- [x] **T2** — Metadados de origem para reconstruir citação · satisfaz R2 ·
      evidência: `src/knowledge/domain/chunking.test.ts`
- [x] **T3** — Recusa de ingestão sem `clientId` ou sem rótulos · satisfaz R3 ·
      evidência: `src/knowledge/domain/knowledge.test.ts`
- [x] **T4** — Idempotência por hash de conteúdo · satisfaz R4 ·
      evidência: `src/knowledge/domain/knowledge.test.ts`

## FT-05.3 — ACL

- [x] **T5** — Escopo por `clientId` antes da pontuação · satisfaz R5, R8 ·
      evidência: `src/knowledge/domain/knowledge.test.ts`
- [x] **T6** — Recusa de consulta cruzada entre clientes · satisfaz R6 ·
      evidência: `src/knowledge/domain/knowledge.test.ts`
- [x] **T7** — Elegibilidade por rótulo sem vazar existência do documento ·
      satisfaz R7 · evidência: `src/knowledge/domain/knowledge.test.ts`

## FT-05.2 — Citações e confiança

- [x] **T8** — Citação com documento, posição e trecho · satisfaz R9 ·
      evidência: `src/knowledge/domain/knowledge.test.ts`
- [x] **T9** — Limiar de confiança com escalonamento · satisfaz R10, R11 ·
      evidência: `src/knowledge/domain/knowledge.test.ts`
- [x] **T10** — Trecho recuperado empacotado como dado, nunca como instrução ·
      satisfaz R12 · evidência: `src/knowledge/domain/knowledge.test.ts`

## Pendentes deste épico

- [ ] **T11** — Adapter de busca híbrida (BM25 + vetor) com reranker · requer
      decisão pgvector × OpenSearch (ADR) · horizonte H60
- [ ] **T12** — Calibrar o limiar de confiança contra as 50 perguntas reais ·
      satisfaz R10 de verdade · depende do cliente 1
- [ ] **T13** — EV-02 em CI com recall@k e fidelidade · FT-05.4 · horizonte H60
