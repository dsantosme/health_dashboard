# requirements.md — EP-04 Gateway e guardrails v0.1 (MOD-01, MOD-02)

## Contexto

Todo agente do ORBE chama modelos. Sem um ponto único de passagem, não há como
atribuir custo (P-06), aplicar política de dados regulados, nem mascarar PII
antes que ela chegue ao provedor (LGPD). O épico EP-04 entrega esse ponto:
roteamento por política, guardrails de entrada e saída, e custo por chamada.

Detalha as user stories **US-05** (roteamento e atribuição de custo) e **US-06**
(PII na entrada e na saída), e as features FT-04.1, FT-04.2 e FT-04.3.

Resultado esperado (KPI do épico): **100% das chamadas de modelo com custo
atribuído a um agente e a um caso de uso.**

## Requisitos (EARS)

### Roteamento e custo (FT-04.1, FT-04.3 — US-05)

- **R1** WHEN um agente solicitar uma completude THE SYSTEM SHALL selecionar o
  modelo pela política vigente, considerando custo, latência máxima e se a
  requisição contém dados regulados.
- **R2** WHEN a requisição for marcada como contendo dados regulados THE SYSTEM
  SHALL selecionar apenas modelos cuja política permita dados regulados.
- **R3** IF nenhum modelo satisfizer a política THEN THE SYSTEM SHALL recusar a
  chamada com erro acionável, sem chamar provedor algum.
- **R4** WHEN o modelo primário falhar THE SYSTEM SHALL tentar o próximo modelo
  elegível e registrar que houve fallback, com o motivo da falha.
- **R5** IF todos os modelos elegíveis falharem THEN THE SYSTEM SHALL propagar o
  erro do último provedor e registrar a tentativa completa.
- **R6** WHEN uma chamada terminar, com sucesso ou erro THE SYSTEM SHALL
  registrar um lançamento de custo com agente, caso de uso, modelo, tokens de
  entrada e saída, e valor calculado.
- **R7** WHEN uma requisição chegar sem identificação de agente ou de caso de uso
  THE SYSTEM SHALL recusá-la, porque custo não atribuível é custo invisível.
- **R8** WHILE o orçamento diário de um agente estiver estourado THE SYSTEM SHALL
  recusar novas chamadas daquele agente e sinalizar o estouro (HK-08).

### Guardrails de PII (FT-04.2 — US-06)

- **R9** WHEN o texto de entrada contiver CPF, CNPJ, e-mail, telefone, CEP ou
  cartão THE SYSTEM SHALL substituir cada ocorrência por um marcador estável
  antes de enviar ao provedor, e registrar o evento com o tipo e a quantidade —
  nunca com o valor.
- **R10** WHEN o mesmo valor de PII aparecer mais de uma vez na entrada THE
  SYSTEM SHALL usar o mesmo marcador em todas as ocorrências, para preservar a
  correferência.
- **R11** WHEN a saída do modelo contiver um marcador emitido na entrada THE
  SYSTEM SHALL restaurar o valor original antes de devolver ao agente.
- **R12** IF a saída do modelo contiver PII que não estava na entrada THEN THE
  SYSTEM SHALL bloquear a resposta e registrar o incidente.
- **R13** WHEN um CPF ou CNPJ sintaticamente inválido aparecer THE SYSTEM SHALL
  tratá-lo como não sendo PII, para não corromper códigos internos do cliente.

### Classificação de risco (F-02.2)

- **R14** WHEN uma ação for submetida ao gateway THE SYSTEM SHALL classificá-la
  como `read`, `write` ou `irreversible` conforme ST-04.
- **R15** WHEN a ação for `write` ou `irreversible` THE SYSTEM SHALL exigir
  aprovação antes da execução, com a evidência do que será alterado.

## Métricas

- 100% das chamadas com agente e caso de uso atribuídos (KPI do épico EP-04).
- 0 PII em log de auditoria — verificado por teste, não por inspeção.
- Pass rate de EV-01 ≥ 95% (KPI-05); nenhum achado crítico do `reviewer-security`.
- Custo por resultado registrado e visível para o painel (F-06.1).

## Fora de escopo

- Cache de prompt e batch — FT-04.4, horizonte H60.
- Multi-nuvem e modelos open-weight — F-01.3, horizonte H180.
- Testes ofensivos de injeção — F-02.3 e EV-05, horizonte H180.
- Fluxo de aprovação assíncrona com timeout de 4h — FT-06.1, detalhado em EP-06;
  aqui só a classificação e o ponto de parada (R14, R15).
