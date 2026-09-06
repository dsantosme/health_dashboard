# AI Readiness Score — rubrica (SK-11)

Cinco dimensões, nota inteira de 0 a 4. Pontue pela evidência que você viu, não
pelo que foi prometido na reunião. Total máximo: 20.

## 1. `dados` — a informação existe e é alcançável

- **0** — está na cabeça das pessoas ou em e-mail.
- **2** — está em sistema, mas sem API; exportação manual em planilha.
- **4** — está em sistema com API ou banco acessível, com histórico de casos resolvidos.

## 2. `processo` — a dor é medida

- **0** — ninguém sabe quantos casos por mês nem quanto custa.
- **2** — há volume, mas o tempo e o custo por caso são estimativa.
- **4** — volume, tempo, custo e taxa de erro conhecidos, com fonte verificável.

## 3. `integracao` — dá para agir nos sistemas

- **0** — sistema fechado, fornecedor não colabora.
- **2** — API existe, mas o acesso depende de negociação ou de licença extra.
- **4** — credencial de escopo mínimo disponível em dias, ambiente de teste incluído.

## 4. `governanca` — o risco tem dono

- **0** — não há política de dados; ninguém sabe quem aprova.
- **2** — há política, mas o papel LGPD (controlador/operador) não está claro.
- **4** — aprovadores definidos por tipo de ação, política de dados escrita,
  ação proibida declarada.

## 5. `patrocinio` — alguém quer isto de verdade

- **0** — a conversa nasceu de curiosidade sobre "IA".
- **2** — há interesse, mas o orçamento é hipotético.
- **4** — quem sente a dor e quem assina são conhecidos, com orçamento e prazo.

## Como o score se traduz

| Faixa | Leitura | Recomendação |
| --- | --- | --- |
| 16–20 | Pronto | Propor pod de 45 dias com KPI contratado |
| 11–15 | Pronto com lacuna | Propor pod, com a dimensão fraca como primeira tarefa |
| 6–10 | Não pronto | Vender diagnóstico pago; pod só depois da medição |
| 0–5 | Fora do ICP hoje | Não vender; reavaliar em um trimestre |

Qualquer dimensão em **0** rebaixa a recomendação um nível, mesmo com total alto:
um único zero costuma ser o que mata o pod no dia 40.
