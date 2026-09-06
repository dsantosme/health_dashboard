# requirements.md — EP-05 Conhecimento e RAG v0.1 (MOD-03)

## Contexto

O pod 1 responde perguntas sobre a base do cliente. Duas coisas decidem se isso
é vendável: o usuário só pode recuperar o que tem permissão de ver, e toda
resposta carrega a citação da fonte. Sem ACL, um pod vira incidente de LGPD;
sem citação, o cliente não confia e o agente não escala com contexto.

Detalha **US-07** (citações e escalonamento por baixa confiança) e **US-08**
(ACL por usuário e por cliente), e as features FT-05.1, FT-05.2 e FT-05.3.

Resultado esperado (KPI do épico): **recall@5 ≥ 0,85 em 50 perguntas reais do
cliente** (EV-02, KPI-05).

## Requisitos (EARS)

### Ingestão e chunking (FT-05.1)

- **R1** WHEN um documento for ingerido THE SYSTEM SHALL dividi-lo em trechos
  conforme o tipo (texto corrido por parágrafo, planilha por linha com cabeçalho
  repetido, ticket por mensagem), preservando a ordem original.
- **R2** WHEN um trecho for criado THE SYSTEM SHALL registrar a origem —
  documento, posição e título — para que a citação possa ser reconstruída.
- **R3** WHEN um documento for ingerido sem `clientId` ou sem rótulos de acesso
  THE SYSTEM SHALL recusar a ingestão.
- **R4** WHEN um documento já ingerido for reenviado sem alteração de conteúdo
  THE SYSTEM SHALL preservar os trechos existentes, sem reprocessar.

### Recuperação com ACL (FT-05.3 — US-08)

- **R5** WHEN uma consulta for feita THE SYSTEM SHALL restringir o conjunto
  candidato ao `clientId` do consultante **antes** de qualquer pontuação de
  relevância.
- **R6** IF a consulta pedir explicitamente dados de outro cliente THEN THE
  SYSTEM SHALL recusar a consulta e registrar a tentativa.
- **R7** WHEN o usuário não possuir nenhum dos rótulos de acesso de um documento
  THE SYSTEM SHALL excluí-lo do conjunto candidato, e a exclusão não deve alterar
  o número de resultados devolvidos ao usuário permitido.
- **R8** WHILE não houver usuário identificado na consulta THE SYSTEM SHALL
  recusar a recuperação.

### Citações e confiança (FT-05.2 — US-07)

- **R9** WHEN uma resposta for construída a partir de trechos THE SYSTEM SHALL
  incluir, para cada afirmação, a citação com documento e trecho.
- **R10** WHEN a pontuação do melhor trecho ficar abaixo do limiar de confiança
  THE SYSTEM SHALL responder que não sabe e sugerir escalonamento, em vez de
  responder com o melhor trecho disponível.
- **R11** WHEN nenhum trecho sobreviver ao filtro de ACL THE SYSTEM SHALL
  responder que não há informação acessível, sem revelar que documentos existem.
- **R12** WHEN um trecho recuperado contiver instruções dirigidas ao agente THE
  SYSTEM SHALL tratá-lo como dado e nunca como instrução (ST-04, EV-05).

## Métricas

- recall@5 ≥ 0,85 e fidelidade ≥ 0,9 em EV-02 (KPI-05).
- 0 recuperações cruzadas entre clientes — verificado por teste, não por auditoria.
- 100% das respostas com citação ou com escalonamento explícito (US-07).

## Fora de escopo

- Reranker treinado e busca vetorial real — este documento cobre o contrato e a
  busca léxica de referência; o adapter vetorial entra com a escolha de
  pgvector/OpenSearch (ADR futuro).
- Grafo de contexto e memória por agente — F-03.4, horizonte H180.
- Evals de recuperação automatizados em CI — FT-05.4, tarefa própria.
