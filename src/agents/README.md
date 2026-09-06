# Agentes (AG-00..AG-10, AT-01..AT-05)

Vazio por enquanto — e de propósito. Os agentes internos entram em EP-09 e os
templates de cliente em EP-10; antes disso não há gateway em produção nem RAG
com dados reais para eles usarem.

Quando o primeiro entrar, ele começa por:

1. `.kiro/specs/<caso-de-uso>/requirements.md` em EARS (P-02).
2. Suíte de evals **antes** do agente (PR-02, evals-first).
3. Orçamento de tokens declarado (ST-05) — `src/agents/**` é o caminho que ativa
   aquele steering por `fileMatch`.
4. Pontos de HITL definidos por risco (ST-04, `src/orchestration`).
