---
id: ST-01
inclusion: always
---

# Produto (ST-01)

## Missão

Plataforma modular de agentes (**ORBE**) para o mid-market brasileiro. Vendemos
resultado medido, não horas: cada entrega tem baseline no dia 1 e KPI no dia 45.

## O que vendemos

| Oferta                 | O que é                                                     | Prova     |
| ---------------------- | ----------------------------------------------------------- | --------- |
| Pod de IA de 45 dias   | Um processo do cliente operado por agentes com HITL          | KPI-02/04 |
| Baseline de Engenharia | Medição DORA/SPACE antes e depois de agentes de código       | KPI-08    |
| FinOps de IA           | Custo por resultado, showback, otimização de roteamento      | KPI-06    |
| AI Security Assessment | Bateria OWASP LLM Top 10 / MITRE ATLAS contra agentes e RAG  | KPI-10    |

## Princípios (P-01..P-12)

Os doze princípios estão em `docs/plan/plan.yaml` (`principles`). Os quatro que
mais mudam decisões do dia a dia:

- **P-02 Spec é a fonte da verdade** — código deriva de `.kiro/specs/`, nunca o contrário.
- **P-03 Evals são os testes** — sem suíte EV com gate, não vai a produção.
- **P-06 Custo é uma feature** — orçamento de tokens declarado antes de começar.
- **P-07 Humano no loop por risco** — ação irreversível exige aprovação síncrona.

Quando dois princípios colidirem, a ordem de precedência é: **P-07 (segurança
e risco) > P-03 (evidência) > P-06 (custo) > velocidade.**

## Glossário

- **Pod** — engajamento de 45 dias que leva um processo do cliente a produção.
- **Baseline** — medição do processo antes do agente (volume, tempo, custo, qualidade).
- **HITL** — human in the loop; ponto de aprovação classificado por risco (ST-04).
- **Steering** — arquivo de contexto sempre/condicionalmente carregado (`.kiro/steering/`).
- **Skill** — procedimento empacotado (`SKILL.md` + scripts + referências) para agentes.
- **Harness** — ambiente que humanos desenham para os agentes construírem (HR-01..HR-09).
- **Eval** — tarefa verificável por estado final, não por texto da resposta.

## O "porquê" de cada decisão

Toda decisão de arquitetura vira um ADR curto em `docs/adr/` (SK-13, PR-08).
Se você não consegue apontar o ADR, a decisão ainda não foi tomada.

## Idioma

Português do Brasil em tudo que o cliente vê. IDs (`MOD/AG/SK/ST/HK/EV/EP/FT/US`)
em tudo que a IA lê — inclusive commits, PRs e nomes de teste.
