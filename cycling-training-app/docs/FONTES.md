# Fontes e cobertura

## 1. Anatomia do Ciclismo — Shannon Sovndal (Manole)

Guia ilustrado de treinamento de força para ciclistas. É a espinha dorsal do motor de planejamento:
os princípios do capítulo 1 viraram regras duras do gerador de plano.

| Cap. | Título | Pág. | Status | O que alimenta no app |
|---|---|---|---|---|
| 1 | O ciclista em movimento | 1 | ✅ incorporado | Princípios de treino de força, periodização (SAG), métodos de série, aquecimento, regra dos 3 dias |
| 2 | Membros superiores | 11 | ✅ incorporado | 7 exercícios de braço e antebraço, aquecimento específico |
| 3 | Ombros e pescoço | 32 | ✅ incorporado | 6 exercícios de deltoide e manguito rotador, isometria cervical |
| 4 | Tórax | 56 | ⬜ pendente | Peitoral maior e menor |
| 5 | Dorso | 76 | ⬜ pendente | Eretor da espinha, latíssimo, trapézio |
| 6 | Abdome | 98 | ⬜ pendente | Reto, transverso e oblíquos |
| 7 | Membros inferiores: isolamento | 122 | ⬜ pendente | Isolamento de quadríceps, isquiotibiais, glúteos, panturrilha |
| 8 | Membros inferiores: força total | 144 | ⬜ pendente | Agachamento, leg press, afundo |
| 9 | Treinamento corporal global | 164 | ⬜ pendente | Circuitos e movimentos integrados |

Exercícios marcados com `fonte.obra: 'complementar'` em `src/data/exercises.ts` são os que ainda
serão revisados quando os capítulos 4 a 9 entrarem — hoje eles seguem os princípios do capítulo 1.
A tela **Base** mostra essa mesma tabela dentro do app, com a barra de progresso de cobertura.

### Regras que o gerador de plano herdou do capítulo 1

- Máximo de 3 sessões de musculação por semana (o ciclista precisa manter o cardio); 1 já mantém o ganho.
- Toda sessão de força toca várias regiões do corpo, nunca só as pernas.
- O método de série muda a cada bloco de 4 semanas (circuito → pouco peso/muitas reps → pirâmide →
  muito peso/poucas reps → supersérie).
- A cada 3 semanas de carga crescente entra 1 semana de recuperação a ~60% do volume.
- Aquecimento de 5 a 10 min de cardio + 5 min de alongamento (30 s por posição), e alongar de novo no fim.
- "Simule a posição de ciclista" e "imagine-se conduzindo a bicicleta" viraram campos de cada exercício.

## 2. Primeiros passos para dominar a sua bike — Lucas Ludolf (Ludolf Bike School)

E-book de 65 páginas sobre domínio técnico de MTB. Cobre o que o livro de anatomia não cobre:
regulagem da bike e gesto técnico.

- **Bike setup**: largura e giro do guidom, posição e ângulo das manetes, calibragem de pneus,
  SAG da suspensão (25–30% em trilha, 15–20% em bike park), altura e recuo do selim, posição do pé no pedal.
- **Postura de ataque**: os 5 pontos de checagem e o ponto neutro.
- **Eficiência na pedalada**: educativo de pedalada unilateral e alinhamento dos pés.
- **Mobilidade**: sequência completa da cadeia posterior, do pé à cabeça — virou as 12 entradas
  `mob_*` da biblioteca e a sessão de mobilidade do plano.
- **Síndrome cruzada superior**: explica por que rigidez posterior vira dor cervical no ciclista.

Cada item de bike setup carrega os sintomas que resolve, e a anamnese usa isso: quem marca dor no
joelho recebe o checklist de altura de selim; dormência na mão recebe o de giro do guidom.

## Ilustrações extraídas

`scripts/extrair-figuras.py` recorta as figuras dos materiais originais para `src/assets/livro/`:

| Origem | O que sai |
|---|---|
| Fotos das páginas do livro | 12 ilustrações de execução, 12 desenhos de "Enfoque no ciclismo", 6 figuras de anatomia (fig. 1.1, 1.3, 2.1/2.2, 2.3, 3.1, 3.2) |
| PDF do e-book (JPEGs embutidos) | 5 fotos da rotina de mobilidade, 2 de técnica, 7 de bike setup, 8 diagramas de anatomia |

O recorte é automático: caixa aproximada por página → correção do amarelado → remoção da aba
escura do capítulo → separação do desenho e do texto (pela moldura retangular, com tolerância a
foto torta, ou pela calha de papel em branco) → aparo até o conteúdo → WebP. O mapa de páginas
está em `scripts/mapa-paginas.json`.

## Direitos autorais

Nenhum texto das obras é reproduzido no app ou no repositório, e **nenhuma imagem extraída é
versionada** — `src/assets/livro/` está no `.gitignore`, porque este repositório é público e as
figuras são obra protegida. O que vai para o git são anotações, resumos e regras derivadas,
escritas com nossas palavras e sempre com a fonte citada (obra, capítulo e página), mais as
figuras SVG desenhadas por código e o script que reproduz a extração na máquina de quem tem
os originais.
