---
name: proposal-writer
id: SK-05
description: Monta a proposta de um pod a partir das notas da reunião e do template, aplica a calculadora de preço e gera o documento para revisão. Use após a descoberta (SK-11), quando houver dor medida e comprador identificado.
---

# Proposal writer (SK-05)

## Quando usar

Depois de SK-11, com AI Readiness Score calculado. Score abaixo de 11 não vira
proposta de pod: vira proposta de diagnóstico.

## Regra que não se negocia

**Nada é enviado sem aprovação humana** (P-07, AG-02: "aprovação obrigatória,
sempre"). Esta skill produz um rascunho e para. Enviar e-mail ao cliente é ação
irreversível (ST-04).

## Passos

1. Leia as notas da reunião e o `discovery.md` do cliente. Se faltar volume,
   tempo ou custo por caso, volte a SK-11 — proposta sem baseline vira KPI que
   não fecha (US-10).
2. Preencha `references/proposal-template.md`. Cada seção puxa de uma fonte:
   escopo vem da dor medida, prazo vem do tamanho, preço vem da calculadora.
3. Rode a calculadora de preço (ST-06 define as faixas; ST-07 define as
   cláusulas). Se o preço calculado ficar **abaixo do piso**, sinalize e exija
   aprovação explícita — não ajuste o escopo sozinho para caber (US-04).
4. Gere a minuta com as cláusulas-padrão de ST-07 (LGPD, IA, PI, limitação de
   responsabilidade) e rode SK-06 sobre ela.
5. Entregue o pacote — proposta, planilha de preço, minuta — para revisão humana
   com o resumo do que mudou em relação ao template.

## Gotchas

- **Não prometa métrica que você não pode medir no dia 1.** Toda promessa de KPI
  na proposta precisa de baseline correspondente (US-10). Sem baseline, escreva
  "medição na primeira semana" em vez de um número.
- **Não prometa autonomia total.** O pod entrega agente com HITL por risco; a
  proposta deve dizer quais ações exigirão aprovação (ST-04). Cliente que
  descobre isso no dia 30 cancela.
- **Escopo é o processo, não a tecnologia.** "Atendimento nível 1 de X" é escopo;
  "implantar RAG" é meio.
- **Prazo de 45 dias é fixo**; o que varia é o escopo. Proposta que estica o
  prazo perde a razão da oferta.
- Tom e vocabulário seguem ST-09; faixas de preço e objeções, ST-06.

## Referências

- `references/proposal-template.md`
