---
name: mcp-server-builder
id: SK-02
description: Gera um MCP server para REST ou SQL com autenticação, testes e descrições de ferramenta otimizadas para agentes. Use quando um agente precisar agir num sistema do cliente (ERP, CRM, WMS/TMS, warehouse) e ainda não houver conector.
---

# MCP server builder (SK-02)

## Quando usar

Um agente precisa ler ou escrever num sistema e não existe conector (MOD-00).
Antes de construir, verifique se o fornecedor já publica um MCP server — comprar
antes de construir (P-11).

## Princípio que guia tudo

**Agentes são usuários** (P-01). A qualidade de um MCP server está na descrição
das ferramentas, não na elegância do código. Um agente escolhe a ferramenta
lendo o `description`; se ele escolhe errado, a descrição está errada.

## Passos

1. **Modele as ferramentas pelo trabalho, não pela API.** `buscar_pedido_por_nota`
   é ferramenta; `GET /v2/orders` é endpoint. Uma ferramenta que exige três
   chamadas encadeadas para ser útil deveria ser uma só.
2. **Escreva a descrição antes do código**, com: o que a ferramenta faz, quando
   usá-la, quando **não** usá-la, e o que ela devolve. Ver
   `references/tool-description.md`.
3. **Separe leitura de escrita em servers ou escopos diferentes.** Escrita entra
   na classe `write`/`irreversible` de ST-04 e passa por aprovação; leitura não
   deve carregar credencial capaz de escrever (HR-03).
4. **Erros acionáveis.** `"pedido 123 não encontrado; confirme o número da nota
   ou use buscar_pedido_por_cliente"` — nunca `"HTTP 404"`. O agente precisa
   saber o próximo passo a partir da mensagem.
5. **Paginação e limite explícitos.** Toda ferramenta de listagem devolve no
   máximo N itens e diz quantos ficaram de fora. Resposta gigante estoura
   contexto e orçamento (P-04, P-06).
6. **Teste de contrato** para cada ferramenta: entrada válida, entrada inválida,
   recurso ausente, e o caso de autorização negada.
7. Registre o conector em `clients/<slug>/connectors/` e a decisão de escopo em
   um ADR se ele der acesso de escrita (SK-13).

## Gotchas

- **Nunca coloque credencial no argumento da ferramenta.** Ela vem do ambiente
  ou do cofre; argumento aparece em log e em contexto (ST-04).
- **SQL: só consulta parametrizada, e só sobre o catálogo aprovado.** Ferramenta
  que aceita SQL livre é ferramenta que aceita exfiltração (EV-05).
- **Máscara de PII na saída da ferramenta**, não só no prompt (F-02.1). O
  conector é a fronteira onde o dado do cliente entra.
- **Dados grandes não voltam pelo contexto.** Devolva referência (caminho,
  identificador) e deixe o agente processar por execução de código.
- Ferramenta cujo nome precisa de comentário para ser entendido tem nome errado.

## Referências

- `references/tool-description.md` — anatomia de uma descrição que o agente acerta
