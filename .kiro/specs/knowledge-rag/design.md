# design.md — EP-05 Conhecimento e RAG v0.1

## Decisão

A ACL é um **predicado de elegibilidade aplicado antes da pontuação**, não um
filtro depois do ranking. A busca é um port (`Retriever`) com um adapter léxico
em memória, para que os evals rodem sem infraestrutura (ADR-0001).

## Componentes

| Módulo | Papel | Contrato (port) |
| --- | --- | --- |
| MOD-03 | Chunking por tipo, indexação, recuperação com ACL, citação | `Retriever`, `DocumentStore` |
| MOD-02 | Mascara PII do trecho antes de ir ao modelo | `Guardrail` |

```
ingestão
  Document { id, clientId, title, type, accessLabels[], content }
      │  chunk(type)                                  (R1, R2)
      ▼
  Chunk { id, docId, clientId, accessLabels[], ordinal, text, title }
      │  DocumentStore.upsert()  — sem reprocessar se o hash não mudou (R4)
      ▼
consulta
  Query { question, principal: { userId, clientId, labels[] }, k }
      │  1. escopo por clientId          → recusa cruzamento    (R5, R6, R8)
      │  2. elegibilidade por label      → antes de pontuar     (R7)
      │  3. pontuação léxica             → top-k
      │  4. limiar de confiança          → não sabe + escalona  (R10, R11)
      ▼
  Answer { citations: [{ docId, title, ordinal, excerpt, score }], escalate }
```

## Decisões de detalhe

**Escopo antes de pontuação.** Se o filtro viesse depois do ranking, o número de
resultados dependeria de quem pergunta, e um usuário poderia inferir a existência
de documentos que não pode ver pelo tamanho da resposta (R7).

**Recusar em vez de filtrar consulta cruzada.** Uma pergunta que pede dados de
outro cliente é sinal de erro de configuração ou de tentativa; filtrar
silenciosamente esconde os dois (R6).

**"Não sei" é resposta válida e preferida.** Abaixo do limiar, responder com o
melhor trecho disponível é o comportamento que produz alucinação com citação —
o pior resultado possível, porque parece confiável (R10).

**Trecho recuperado nunca vira instrução.** O trecho entra no prompt em bloco de
dados delimitado, com a instrução de que é conteúdo do cliente. Um documento que
diz "ignore as instruções anteriores" é achado de EV-05, não comando (R12).

**Hash de conteúdo para idempotência.** Reingestão do mesmo documento não
reprocessa nem re-embeda — é a diferença entre custo linear e custo quadrático
na operação do pod (R4, P-06).

## Riscos e mitigação

| Risco | Como percebemos | Mitigação |
| --- | --- | --- |
| Busca léxica com recall baixo em vocabulário do cliente | EV-02 abaixo de 0,85 | Port permite trocar por híbrida + reranker sem tocar no domínio |
| Rótulo de acesso desatualizado no índice | Usuário vê o que não deveria | Rótulo é do documento e revalidado na consulta; nunca cacheado por usuário |
| Limiar de confiança calibrado no vácuo | Escalonamento demais ou de menos | Calibrar contra as 50 perguntas reais de EV-02 antes de fixar |
| Índice compartilhado entre clientes por engano | Teste de cruzamento falhando | `clientId` obrigatório na ingestão (R3) e na consulta (R8) |
