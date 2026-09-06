---
name: client-discovery
id: SK-11
description: Conduz o roteiro de descoberta de um cliente (dados disponíveis, dor medida, comprador, restrições) e produz o AI Readiness Score. Use antes de propor um pod, antes de precificar, e sempre que o cliente pedir "uma IA" sem dizer qual processo.
---

# Client discovery (SK-11)

## Quando usar

Antes de qualquer proposta (SK-05) e antes de qualquer scaffold (SK-01). Um pod
vendido sem descoberta vira pod sem baseline — e sem baseline não existe KPI no
dia 45 (US-10), que é o que vendemos.

## O roteiro

Quatro blocos. Cada resposta vira uma linha em `clients/<slug>/discovery.md`.
Não avance de bloco enquanto o anterior tiver "não sei" sem data para descobrir.

**1. Dor medida** — Qual processo? Quantos casos por mês? Quanto tempo por caso?
Quanto custa hoje? O que acontece quando dá errado? *Se o cliente não tem o
número, o primeiro entregável do pod é medir — e isso muda o preço.*

**2. Dados disponíveis** — Onde vive a informação que responde as perguntas?
Está em sistema, em planilha ou na cabeça de alguém? Quem pode ver o quê?
Existe histórico rotulado de casos resolvidos?

**3. Comprador e decisão** — Quem assina? Quem sente a dor? Quem pode vetar
(TI, jurídico, segurança)? Qual orçamento já existe e de qual centro de custo?

**4. Restrições** — Dados que não podem sair do ambiente? Exigência de nuvem
específica? LGPD: quem é controlador e quem é operador? Qual ação o cliente
**nunca** aceitaria que um agente fizesse sozinho?

## AI Readiness Score

```bash
node scripts/readiness.mjs clients/<slug>/discovery.json
```

Cinco dimensões, 0–4 cada (ver `references/readiness-rubric.md`): dados,
processo, integração, governança e patrocínio. O script devolve a nota, a
dimensão mais fraca e a recomendação — inclusive "não vender ainda".

## Gotchas

- **Cliente que não sabe medir a dor não está pronto para um pod**, está pronto
  para um diagnóstico pago. Vender pod nesse estado é vender KPI que não fecha.
- **Score alto em dados e baixo em patrocínio é a pior combinação**: o piloto
  funciona e morre na hora de virar produção.
- **Pergunte a ação proibida cedo.** É ela que define os pontos de HITL (ST-04)
  e, muitas vezes, se o caso de uso é viável.
- Nada de dado pessoal de contatos do cliente no repositório além de papel e
  nome; e-mail e telefone ficam no CRM (ST-04).

## Scripts

- `scripts/readiness.mjs <arquivo.json>`

## Referências

- `references/readiness-rubric.md` — as cinco dimensões e o que é 0, 2 e 4
