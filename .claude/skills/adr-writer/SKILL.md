---
name: adr-writer
id: SK-13
description: Escreve um ADR curto para uma decisão de arquitetura, com alternativas reais e consequências. Use sempre que uma escolha for cara de reverter — dependência no caminho crítico, contrato entre módulos, formato de dado persistido, modelo/provedor, limite de segurança.
---

# ADR writer (SK-13)

## Quando usar

Uma decisão merece ADR quando **reverter custa mais do que decidir**. Sinais:
troca de contrato entre módulos, dado que passa a ser persistido, dependência no
caminho crítico de um agente, limite de segurança, escolha de provedor de modelo.

Não merece ADR: nome de variável, formatação, escolha reversível em uma tarde.

## Passos

1. `node scripts/new-adr.mjs "<título em uma linha>"` — cria o próximo número
   em `docs/adr/` a partir do template.
2. Preencha **Contexto** com o que era verdade quando você decidiu, não com o que
   você conclui. Um ADR é lido daqui a um ano por alguém que não estava lá.
3. Liste **pelo menos duas alternativas reais** — com o motivo de terem sido
   descartadas. Alternativa de palha ("não fazer nada") não conta.
4. Escreva as **consequências**, boas e ruins. Um ADR sem custo declarado é
   propaganda, não decisão.
5. Marque `Status: proposto` e leve ao humano. Só o humano promove para `aceito`
   (P-07, PR-08).

## Gotchas

- **Um ADR, uma decisão.** Documento que decide três coisas não é revisável.
- **Não reescreva ADR aceito.** Se a decisão mudou, escreva um novo que
  `supersede` o anterior, e marque o antigo como `substituído por ADR-XXXX`.
- Cite os IDs afetados (`MOD-*`, `FT-*`) — é assim que o próximo agente encontra
  a decisão a partir do código.
- Se você não consegue escrever a alternativa descartada com honestidade, você
  ainda não entendeu o problema: pesquise antes de escrever.

## Scripts

- `scripts/new-adr.mjs "<título>"`

## Referências

- `references/adr-template.md`
