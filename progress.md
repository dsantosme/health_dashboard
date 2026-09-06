# progress.md — estado das sessões longas (PR-11, HR-04)

Atualizado ao fim de cada sessão com: o que foi feito, evidências, próximos
passos e custo. Uma sessão nova começa lendo este arquivo e o `git log` recente.

---

## 2026-09-06 — Base de IA (EP-02) e núcleo de EP-04/EP-05

**Sessão:** agente inicializador · **Branch:** `claude/ai-architecture-base-chlqtn`

### O que foi feito

**Plano como fonte de verdade**

- `docs/plan/plan.yaml` — 234 IDs do Plano Operacional 30/60/90/180/365
  (horizontes, P-01..P-12, PR-01..PR-12, MOD-00..MOD-09, AG/AT, SK-01..SK-14,
  ST-01..ST-10, HK-01..HK-08, HR-01..HR-09, EV-01..EV-08, EP-01..EP-14,
  US-01..US-12, KPI-01..KPI-12).
- `docs/plan/proposed.yaml` — canal para IDs novos, vazio.
- `scripts/orbe/validate-plan.mjs` — valida unicidade, referências cruzadas e o
  limite de 150 linhas de `CLAUDE.md`. Sem dependências: roda em hook e em CI.

**Harness (MOD-08 / EP-02)**

- `CLAUDE.md` (63 linhas), `.claude/settings.json` com permissões e hooks.
- HK-01 (PreToolUse Bash) e HK-02 (PostToolUse Edit) — FT-02.3.
- Subagentes `reviewer-security`, `reviewer-cost`, `evals` — FT-02.5.
- Skills SK-01, SK-02, SK-05, SK-11, SK-13 — FT-02.2. SK-01, SK-11 e SK-13 com
  scripts executáveis.
- Steering ST-01..ST-04 — FT-02.1.
- `docs/adr/ADR-0001` — ports & adapters em todos os módulos (**proposto**,
  aguarda aprovação humana).

**Specs (PR-01)**

- `.kiro/specs/gateway/` — EP-04, 15 requisitos EARS, design e tarefas.
- `.kiro/specs/knowledge-rag/` — EP-05, 12 requisitos EARS, design e tarefas.

**Código (`src/`)**

- MOD-01 gateway: roteamento por política, fallback, atribuição obrigatória.
- MOD-02 guardrails: PII brasileira com dígito verificador, mascaramento
  correferente, bloqueio de PII nova na saída.
- MOD-03 conhecimento: chunking por tipo, ACL antes da pontuação, citações,
  limiar de confiança com escalonamento.
- MOD-04 orquestração: classificação de risco e aprovação com expiração de 4h.
- MOD-05 evals: runner com graders de estado + suíte EV-01 (20 casos).
- MOD-06 FinOps: livro-razão, teto diário, custo por resultado.

### Evidências

```
pnpm check          → 0 erros
pnpm test           → 113 testes, 10 arquivos, todos verdes
pnpm evals          → EV-01: 20/20 (100%), limiar 95% — gate PASSA
pnpm orbe:validate  → 234 IDs, 62 arquivos, 0 erros
```

CI em `.github/workflows/orbe.yml` roda os quatro em cada PR.

**Dois defeitos reais encontrados pelos próprios gates, e corrigidos:**

1. **EV-01.15** flagrou que `12345678901` era mascarado como telefone — o padrão
   não tinha barreira de dígito à esquerda e casava no meio do número. Um código
   interno de cliente seria corrompido antes de chegar ao modelo. Corrigido com
   `(?<!\d)` e uma lista de DDDs reais; virou teste de regressão (P-03).
2. Um teste de ACL flagrou que o IDF era calculado sobre o índice inteiro, então
   a **nota de um trecho permitido mudava com a existência de documentos que o
   usuário não podia ver** — exatamente o vazamento que R7 impede. A estatística
   passou a ser calculada sobre o conjunto elegível.

### Próximos passos

Em ordem, e nenhum deles começa sem decisão humana onde indicado:

1. **Aprovar ou recusar o ADR-0001.** Ele está `proposto`; tudo em `src/` segue
   a decisão dele.
2. **Decidir onde o ORBE mora** (ver "Em aberto" abaixo).
3. **T11 de EP-04** — adapter Bedrock para `ModelProvider`, com credencial em
   cofre. Requer a conta de laboratório de H30.
4. **T12 de EP-04** — adapter persistente de `CostLedger` e conciliação com o
   billing. Enquanto não existir, `pnpm cost` lê `.orbe/cost-ledger.jsonl` e diz
   o que não sabe.
5. **T11/T12 de EP-05** — busca híbrida com reranker (exige ADR: pgvector ×
   OpenSearch) e calibração do limiar de confiança contra 50 perguntas reais.
   O limiar atual (0,12) foi escolhido no vácuo e **não deve ir a cliente assim**.
6. **EV-02** (RAG, recall@k e fidelidade) em CI — FT-05.4. Depende do cliente 1.
7. Hooks HK-03..HK-08 e steering ST-05..ST-10, conforme os horizontes do plano.

### Em aberto (decisão humana)

- **O ORBE mora neste repositório?** A base foi construída dentro de
  `health_dashboard` porque foi o repositório indicado. Ela está isolada em
  `src/`, `.kiro/`, `.claude/` e `docs/plan/`, sem tocar em `client/`, `server/`
  ou `shared/` — então move para um repositório `orbe/` próprio sem reescrita, se
  essa for a decisão. Três arquivos compartilhados foram alterados e precisariam
  ser replicados: `package.json` (3 scripts), `tsconfig.json` (`target: ES2022`,
  alias `@orbe/*`) e `vitest.config.ts` (incluir `src/`).
- **Limiar de confiança do RAG** — ver item 5.
- **Tabela de preços por modelo** — `pnpm cost` precisa de `.orbe/pricing.json`;
  os valores dependem do provedor escolhido em T11.

### Custo desta sessão

Sessão de agente único, sem chamadas ao gateway do ORBE (nenhum provedor está
configurado ainda). Custo de tokens da própria sessão de desenvolvimento: não
instrumentado — a instrumentação do custo do trabalho de desenvolvimento é parte
de FT-09.2, ainda não implementada. Registrar isto como lacuna conhecida é mais
honesto do que estimar.
