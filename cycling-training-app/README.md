# Ciclo Coach — MVP

App para ciclistas montarem planos de treino de **curto, médio e longo prazo**, com as sessões
ilustradas passo a passo. Feito para ser usado no celular, na academia, offline.

Funciona 100% no navegador: sem backend, sem cadastro, sem enviar dado nenhum para lugar nenhum.
Tudo fica no `localStorage` do aparelho.

## O que ele faz

1. **Anamnese e perfil** — 6 etapas de questionário: dados pessoais, modalidade (Urbano, MTB,
   E-MTB, Gravel, Road, Triathlon), objetivo, histórico de atleta, condicionamento atual,
   anamnese de saúde e rotina de vida (dias disponíveis, tempo por treino, sono, estresse, acessos).
2. **Avaliação** — calcula nível (score 0–100 explicado item a item), FC máxima (Tanaka ou medida),
   zonas de treino (Karvonen quando há FC de repouso), FTP informado ou estimado por W/kg, e os
   alertas de segurança que a anamnese dispara.
3. **Plano periodizado** — 4, 12 ou 24 semanas com fases base → construção → específico → pico,
   semana de recuperação a cada 4 e taper no fim. Volume começa perto do que você já faz e cresce
   até o teto da sua agenda.
4. **Sessões** — bike (base, longo, tempo, limiar, VO2, sprint, técnica) com blocos, tempo, séries,
   intervalos, cadência e zona; e academia com exercícios, séries, repetições, descanso e carga sugerida.
5. **Modo treino** — a tela que fica aberta no celular durante o treino: cronômetro de descanso com
   apito, passo a passo ilustrado de cada exercício, campo de carga usada e registro de PSE e notas.
6. **Biblioteca** — 37 exercícios ilustrados com músculos primários e secundários, "enfoque no
   ciclismo", erros comuns e variações.
7. **Base** — a teoria aberta: princípios que o motor aplica, anatomia do ciclista, bike setup,
   postura de ataque, sequência de mobilidade e o mapa de quanto do material-fonte já foi incorporado.

## As ilustrações

Não são imagens escaneadas de livro. Cada passo de exercício declara **ângulos articulares**
(`src/illustrations/pose.ts`) e um renderizador de cinemática direta (`Figure.tsx`) desenha a figura
em SVG, destacando em laranja o grupo muscular trabalhado e desenhando o aparelho (barra, halter,
polia, banco, degrau, faixa, bike). Vantagem: são leves, funcionam offline, escalam em qualquer tela
e podem ser corrigidas mudando um número.

## Fontes

- **SOVNDAL, Shannon. _Anatomia do Ciclismo_ (Manole).** Capítulos 1, 2 e 3 incorporados.
- **LUDOLF, Lucas (Ludolf Bike School). _Primeiros passos para dominar a sua bike_ (e-book).**
  Bike setup, postura de ataque, eficiência de pedalada e a sequência de mobilidade.

O que está no código são **anotações e princípios resumidos com nossas palavras**, não o texto das
obras. Veja `docs/FONTES.md` para o roadmap de cobertura (capítulos 4 a 9 pendentes).

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # typecheck
npm test         # testes do motor de planejamento
npm run build    # build de produção em dist/
```

O `build` gera um site estático que pode ser publicado em qualquer lugar (GitHub Pages, Netlify,
Vercel). O `base` do Vite é relativo, então funciona em subpasta.

## Estrutura

```
src/
  types.ts              modelo de domínio
  data/
    livro.ts            princípios, capítulos, métodos de série e anatomia (Sovndal)
    mtb.ts              bike setup, postura de ataque, mobilidade (LBS)
    exercises.ts        biblioteca de exercícios com poses ilustradas
    bikeWorkouts.ts     modelos de sessão de bike
    questions.ts        questionário declarativo
  engine/
    level.ts            score e nível
    zones.ts            FC máxima, Karvonen, zonas, FTP estimado
    constraints.ts      anamnese → restrições concretas
    assessment.ts       junta tudo em uma avaliação
    plan.ts             periodização e montagem das sessões
  illustrations/        cinemática direta + renderizador SVG
  components/           telas
  lib/store.tsx         estado + persistência local
```

## Aviso

Organiza treino; não substitui avaliação médica nem acompanhamento de profissional de educação física.
Dor persistente, dormência ou formigamento são motivo para procurar um profissional antes de continuar.
