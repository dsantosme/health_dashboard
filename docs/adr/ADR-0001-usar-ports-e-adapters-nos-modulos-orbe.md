# ADR-0001 — Usar ports e adapters em todos os módulos ORBE

- **Status:** proposto
- **Data:** 2026-09-06
- **Decide sobre:** MOD-01, MOD-02, MOD-03, MOD-04, MOD-05, MOD-06, ST-02, ST-03
- **Autor:** agente inicializador (AG-03) · **Aprovado por:** _pendente_

## Contexto

A base do ORBE nasce dentro do repositório `health_dashboard`, que já usa
hexagonal architecture em `server/` (`ports/`, `adapters/`, `domain/`, documentado
em `docs/HEXAGONAL_ARCHITECTURE.md`). O plano diz que cada módulo deve poder ser
trocado por serviço nativo de nuvem (P-08, "modular e substituível") e que
compramos antes de construir (P-11): o gateway será Bedrock ou Azure AI Foundry,
o RAG será pgvector ou OpenSearch, e essas escolhas ainda não estão feitas.

Ao mesmo tempo, P-03 exige que evals sejam determinísticos, e MOD-01..MOD-06
precisam rodar em CI a cada PR — antes de existir qualquer conta de nuvem.

## Decisão

Todo módulo `MOD-*` expõe seu contrato em `src/<modulo>/ports/` e suas
implementações em `src/<modulo>/adapters/`, com a lógica em `src/<modulo>/domain/`.
O domínio não importa adapter, e não faz I/O: relógio, rede e disco entram por
parâmetro ou por port. Cada módulo entrega um adapter em memória usado pelos
testes e pelos evals.

## Alternativas consideradas

| Alternativa | Por que era atraente | Por que foi descartada |
| --- | --- | --- |
| Chamar os SDKs de nuvem direto no código de cada agente | Menos camadas, menos arquivos; o caminho mais curto para o pod 1 | Fixa o provedor antes da decisão de compra (P-11) e torna todo eval dependente de rede e de credencial — impossível rodar EV-01 em cada PR (P-03) |
| Uma fachada única (`AiPlatform`) sobre todos os módulos | Uma superfície só para os agentes aprenderem | Acopla gateway, RAG e FinOps num objeto que muda por seis motivos diferentes; impede trocar só o RAG por serviço nativo (P-08) |
| Copiar o padrão de `server/` só quando o módulo for para produção | Adia trabalho estrutural | O custo de introduzir port depois é reescrever os testes junto; e o primeiro módulo em produção é justamente o gateway, que todos os outros atravessam |

## Consequências

**Ganhamos:** evals determinísticos sem nuvem nem credencial; troca de provedor
vira um adapter novo, não um refactor; o padrão é o mesmo que a equipe já lê em
`server/`, então não há dois vocabulários no repositório.

**Pagamos:** mais arquivos por módulo e uma indireção a mais para ler; um port
mal desenhado cedo custa caro para mudar depois, porque os adapters seguem.

**Passa a ser proibido:** importar SDK de provedor fora de
`src/<modulo>/adapters/`; fazer I/O no domínio; teste de domínio que precise de
rede. As duas primeiras entram em ST-02 como proibição permanente.

## Como saberemos que erramos

Se, ao integrar o primeiro provedor real (Bedrock), o port precisar de mais de
uma mudança que quebre os adapters em memória, o contrato foi desenhado a partir
da nossa imaginação e não do provedor — e vale reabrir com um port derivado da
API real.
