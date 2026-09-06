# ORBE — plataforma (`src/`)

Módulos MOD-01..MOD-09 do plano (`docs/plan/plan.yaml`). A aplicação de produto
que já existia no repositório vive em `client/`, `server/` e `shared/`; os dois
se encontram só por contrato (port), nunca por import de implementação.

Todo módulo segue ports & adapters (ADR-0001), no mesmo padrão de `server/`:

```
<modulo>/
├── domain/     lógica pura, sem I/O — é o que os evals conseguem verificar
├── ports/      contratos (interfaces)
└── adapters/   implementações (em memória hoje; nuvem quando houver decisão)
```

| Pasta            | Módulo  | Estado                                                    |
| ---------------- | ------- | --------------------------------------------------------- |
| `gateway/`       | MOD-01  | roteamento por política, fallback, custo por chamada       |
| `guardrails/`    | MOD-02  | PII brasileira na entrada e na saída                       |
| `knowledge/`     | MOD-03  | chunking por tipo, ACL antes da pontuação, citações        |
| `orchestration/` | MOD-04  | classificação de risco e HITL com expiração de 4h          |
| `evals/`         | MOD-05  | runner com graders de estado + suíte EV-01                 |
| `finops/`        | MOD-06  | livro-razão de custo, teto diário, custo por resultado     |
| `agents/`        | AG/AT   | vazio — agentes entram a partir de EP-09                   |
| `mcp-servers/`   | MOD-00  | vazio — conectores entram por SK-02, a partir do pod 1     |
| `portal/`        | MOD-09  | vazio — horizonte H180                                     |

## Regras que valem para todo módulo aqui

1. **Sem I/O no domínio.** Relógio, rede e disco entram por parâmetro ou port.
   É o que torna EV-01 reprodutível em cada PR, sem nuvem nem credencial.
2. **Toda chamada de modelo passa pelo gateway**, com `agentId` e `useCaseId`.
   Chamada direta a SDK de provedor fora de `gateway/adapters/` é bug (ST-02).
3. **Erros dizem o próximo passo**, não só o que quebrou (P-01).
4. **Teste cita o ID** que prova: `it("US-06: bloqueia PII na saída...")`.
