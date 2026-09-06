---
id: ST-02
inclusion: always
---

# Stack e proibições (ST-02)

## Stack aprovada

| Camada                | Escolha                                              | Regra           |
| --------------------- | ---------------------------------------------------- | --------------- |
| Runtime deste repo    | Node 22 + TypeScript 5.9 (ESM), pnpm 10               | obrigatório     |
| Testes                | Vitest (`pnpm test`)                                  | obrigatório     |
| Formato               | Prettier (config na raiz)                             | obrigatório     |
| Orquestração          | Claude Agent SDK, Bedrock AgentCore                   | comprar (P-11)  |
| Ferramentas de agente | MCP (servers em TypeScript ou Python 3.12)            | comprar/construir |
| Gateway de modelos    | Bedrock (Claude, Nova), Azure AI Foundry              | comprar         |
| Guardrails            | Bedrock Guardrails + módulo próprio de testes         | híbrido         |
| RAG                   | Postgres/pgvector ou OpenSearch; busca híbrida + reranker | comprar base |
| Observabilidade       | OpenTelemetry → Grafana                               | obrigatório     |
| IaC                   | CDK ou Terraform em `infra/`                          | um por conta    |

## Regras de código (`src/`)

1. **Ports & adapters.** Cada módulo `MOD-*` expõe um contrato em `ports/` e
   implementações em `adapters/`. Segue o padrão já usado em `server/`
   (ver `docs/HEXAGONAL_ARCHITECTURE.md`). Domínio não importa adapter.
2. **Sem I/O no domínio.** Relógio, rede e disco entram por parâmetro ou port —
   é o que torna os graders de eval determinísticos (P-03).
3. **`strict: true`.** Sem `any` implícito, sem `as unknown as`.
4. **Erros acionáveis** (P-01): mensagem diz o que fazer, não só o que quebrou.
5. **Toda chamada de modelo passa pelo gateway** (`src/gateway`, US-05). Chamada
   direta a SDK de provedor fora de `src/gateway/adapters/` é bug.

## Proibições

- Segredo em prompt, log, teste ou repositório — só em cofre (ST-04).
- Dado de cliente usado para treino, em qualquer hipótese.
- Índice de RAG compartilhado entre clientes (ACL por cliente, US-08).
- Dependência nova sem ADR quando ela entra no caminho crítico de um agente.
- `pnpm install` de pacote não fixado em `package.json` dentro de hook ou CI.

## Comandos

```bash
pnpm test            # Vitest (unitários + contrato)
pnpm check           # tsc --noEmit
pnpm format          # Prettier
pnpm orbe:validate   # IDs do plano + limite de CLAUDE.md
pnpm evals           # suítes EV-* (gate de deploy, HK-04)
pnpm cost            # custo por agente/caso de uso do dia
```
