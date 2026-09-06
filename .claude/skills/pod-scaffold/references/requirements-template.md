# requirements.md — <FT-id> <nome da feature>

## Contexto

Quem precisa disto, em que situação, e por quê. Uma tela de texto, no máximo.
Cite o épico (EP-*) e as user stories (US-*) que este documento detalha.

## Requisitos (EARS)

Um requisito por linha, sempre no formato:

- R1 WHEN <gatilho observável> THE SYSTEM SHALL <comportamento verificável>.
- R2 WHILE <estado contínuo> THE SYSTEM SHALL <comportamento>.
- R3 IF <condição de erro> THEN THE SYSTEM SHALL <resposta>.

Regras:

- O gatilho é observável de fora. "Quando o usuário quiser" não é gatilho.
- O comportamento é verificável por estado final, não por texto de resposta —
  é o que permite gerar o eval a partir do requisito (P-03).
- Um requisito, uma frase. Se precisar de "e", provavelmente são dois requisitos.

## Métricas

O que precisa ser verdade para a feature ser considerada pronta. Sempre com
número e com o ID do eval que mede: "0 ações proibidas (EV-04); tempo médio de
aprovação < 30 min".

## Fora de escopo

O que este documento **não** cobre, com o ID de onde aquilo vive. Esta seção
evita que o agente amplie o escopo por conta própria.
