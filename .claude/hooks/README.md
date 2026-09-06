# Hooks (HR-05) — gates determinísticos

"Hooks garantem, prompts pedem" (P-05). O catálogo completo HK-01..HK-08 está em
`docs/plan/plan.yaml`; o registro que o Claude Code lê fica em
`.claude/settings.json`.

| ID    | Evento                        | Script                     | Estado    |
| ----- | ----------------------------- | -------------------------- | --------- |
| HK-01 | PreToolUse (Bash)             | `hk-01-bash-guard.mjs`     | ativo     |
| HK-02 | PostToolUse (Edit/Write)      | `hk-02-post-edit.mjs`      | ativo     |
| HK-03 | Stop                          | —                          | H60       |
| HK-04 | PreToolUse (deploy)           | —                          | H60       |
| HK-05 | PostToolUse (escrita via MCP) | —                          | H60       |
| HK-06 | SessionStart                  | —                          | H90       |
| HK-07 | PreToolUse (dados de cliente) | —                          | H90       |
| HK-08 | Notification/Alert            | —                          | H60       |

## Contrato

Todo hook lê o evento em JSON no **stdin** e usa o código de saída:

- `0` — segue; o stderr, se houver, vira aviso para o agente.
- `2` — **bloqueia**; o stderr é o motivo mostrado ao agente.

Um hook nunca deve travar a sessão por defeito próprio: entrada ilegível,
dependência ausente ou erro inesperado saem `0` com aviso.

## Testar um hook

```bash
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' \
  | node .claude/hooks/hk-01-bash-guard.mjs; echo "exit=$?"   # espera 2
```

Todo hook novo entra com teste em `src/evals/suites/` antes de ser registrado.
