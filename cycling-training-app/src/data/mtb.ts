/**
 * Base de conhecimento de tecnica e setup, derivada do segundo material do projeto.
 *
 * Fonte: LUDOLF, Lucas (Ludolf Bike School). "Primeiros passos para dominar a
 * sua bike" (e-book).
 *
 * Como em livro.ts, aqui nao ha reproducao do texto original: sao anotacoes
 * resumidas com nossas palavras e transformadas em checklists e exercicios
 * acionaveis pelo motor de planejamento.
 */

export interface ItemChecklist {
  id: string
  titulo: string
  passos: string[]
  /** Sintoma que este ajuste costuma resolver — casa com a anamnese. */
  resolve: string[]
}

/** Pilar 1: Bike Setup. Roda uma vez no inicio do plano e a cada troca de peca. */
export const BIKE_SETUP: ItemChecklist[] = [
  {
    id: 'guidom_largura',
    titulo: 'Largura do guidom',
    passos: [
      'Com as maos nas extremidades do guidom e o tronco paralelo ao top tube, o cotovelo deve abrir um pouco mais que 90 graus.',
      'Guidom curto demais fecha o cotovelo e sobrecarrega o triceps.',
      'Guidom largo demais da estabilidade, mas aumenta o risco de bater em arvore em trilha fechada.',
      'Se puder, teste tamanhos diferentes antes de decidir.',
    ],
    resolve: ['Fadiga de triceps', 'Falta de controle'],
  },
  {
    id: 'guidom_giro',
    titulo: 'Giro (rise) do guidom',
    passos: [
      'Girado demais para a frente: mais compressao na parte externa do punho e no nervo ulnar.',
      'Girado demais para tras: mais compressao na palma e no nervo mediano.',
      'Ajuste de 1 a 2 mm por vez e pedale para sentir a diferenca.',
      'Alvo: punho em posicao neutra.',
    ],
    resolve: ['Dormencia nas maos', 'Dor no punho'],
  },
  {
    id: 'manetes',
    titulo: 'Posicao e angulo das manetes',
    passos: [
      'Feche os olhos, apoie as maos nos punhos e estique o indicador: a ponta dele deve cair na curvinha da manete.',
      'O angulo da manete acompanha o angulo do antebraco — nem muito alta (extensao de punho) nem muito baixa (flexao acentuada).',
      'Sem frear, a manete deve tocar a falange medial do indicador.',
      'Aperte a bracadeira o suficiente para a manete girar em queda, mas nao girar ao frear.',
    ],
    resolve: ['Exaustao de antebraco em descida', 'Dor no punho'],
  },
  {
    id: 'pneus',
    titulo: 'Calibragem dos pneus',
    passos: [
      'Menos pressao = mais aderencia e mais arrasto; mais pressao = mais rolagem e menos grip.',
      'Comece pela recomendacao de um app de calibragem (considera peso, aro, terreno, tubeless).',
      'Teste, adicione 3 PSI, reavalie aderencia x rolagem.',
      'Anote a pressao que funcionou e a data da ultima troca de selante (dura cerca de 3 meses).',
    ],
    resolve: ['Perda de tracao', 'Bike pesada de rolar'],
  },
  {
    id: 'suspensao',
    titulo: 'SAG da suspensao',
    passos: [
      'SAG e o quanto o curso afunda com voce equipado em posicao natural.',
      'Trilha: 25 a 30% do curso. Bike park com rampa: 15 a 20%.',
      'Suba equipado, assuma a postura de ataque, faca alguns ciclos, desca sem afundar e leia o anel marcador.',
      'Retorno rapido demais tira leitura do terreno; lento demais nao recupera em batedeira. Comece pela tabela do fabricante e teste cliques.',
    ],
    resolve: ['Bike nervosa', 'Bike que nao acompanha o terreno'],
  },
  {
    id: 'selim_altura',
    titulo: 'Altura e posicao do selim',
    passos: [
      'Pe as 6 horas e paralelo ao solo: o joelho fica em semiflexao.',
      'Pedalando no plano, o quadril tem que ficar estavel — se ele gira a cada pedalada, o selim esta alto.',
      'Nao existe angulo padrao de joelho: quem tem cadeia posterior rigida precisa de selim mais baixo ate ganhar mobilidade.',
      'Selim baixo demais aumenta compressao patelar — o erro classico de quem busca "seguranca".',
      'Se o joelho passa do eixo do pedal, o selim esta avancado demais: troque o avanco em vez de puxar o selim para a frente.',
      'Com rigidez muscular, deixe o selim paralelo ao solo (0 grau).',
    ],
    resolve: ['Dor no joelho', 'Dor lombar', 'Dormencia nas partes intimas'],
  },
  {
    id: 'pes_pedal',
    titulo: 'Posicionamento do pe no pedal',
    passos: [
      'A articulacao metatarso-falangeana (a bolinha antes do dedao) alinha com o eixo do pedal ou fica um pouco a frente.',
      'Pe muito a frente = mais pressao nos dedos e mais desgaste de panturrilha.',
      'Calcanhar alinhado deixa o joelho paralelo ao quadro. Girado para dentro joga o joelho para fora, e vice-versa.',
      'Fora da pedalada, mantenha os pedais paralelos ao solo, principalmente nas curvas.',
      'Em descida, baixe os calcanhares: calcanhar alto joga o peso a frente e tira tracao da roda traseira.',
    ],
    resolve: ['Dor no joelho', 'Panturrilha sobrecarregada', 'Perda de tracao em descida'],
  },
]

/** Pilar 2: postura de ataque — o gesto tecnico base de MTB, E-MTB e gravel. */
export const POSTURA_ATAQUE = {
  passos: [
    'Cotovelos semiflexionados e abertos.',
    'Joelhos semiflexionados e paralelos ao quadro.',
    'Peso distribuido igualmente e na mesma regiao dos dois pes.',
    'Queixo alinhado com o guidom ou um pouco a frente: peso principal nos pes, maos leves.',
    'Coluna quase paralela ao top tube; procure o ponto neutro — aquele em que, ao soltar as maos, o tronco nao cai para a frente nem para tras.',
  ],
  sinaisDeQueEstaErrado: [
    'Bracos e maos tensos',
    'Pernas fadigando cedo demais',
    'Falta de aderencia na roda dianteira',
    'Falta de confianca para soltar em descida tecnica',
  ],
  observacao:
    'Para assimilar a postura, reduza a velocidade e trabalhe tangencia e tracado antes de acelerar. Dificuldade para chegar nela costuma ser rigidez de cadeia posterior ou fraqueza muscular — nao falta de coragem.',
}

/** Pilar 3: eficiencia na pedalada. */
export const EFICIENCIA_PEDALADA = {
  educativoUnilateral: [
    'Precisa de pedal de encaixe.',
    'Terreno com inclinacao leve e constante, piso liso (estradao).',
    'Desencaixe um pe e deixe a perna flutuando.',
    'Suba pedalando com um pe so, mantendo o pe paralelo ao solo.',
    'Aplique forca nos 360 graus: empurre para baixo, arraste para tras, puxe para cima, empurre para a frente.',
    'Escolha marcha leve. Com o cansaco cai a estabilidade de core e a coordenacao — nao insista pesado.',
  ],
  observacao:
    'Pedalada circular deixa o quadriceps mais eficiente e recruta o psoas na fase de puxar. Espere sentir musculos que voce nao sentia antes.',
}

/**
 * Pilar 4: rotina de mobilidade da cadeia posterior.
 * Ordem importa — a cadeia esta interligada do pe a cabeca.
 */
export const SEQUENCIA_MOBILIDADE: string[] = [
  'mob_sola_pe',
  'mob_gastrocnemio',
  'mob_soleo',
  'mob_isquiotibiais',
  'mob_gluteo_sentado',
  'mob_gluteo_deitado',
  'mob_gluteo_pombo',
  'mob_quadriceps',
  'mob_psoas',
  'mob_mackenzie',
  'mob_quadrado_lombar',
  'mob_retracao_cervical',
]

/** Cadeia de compensacao postural que aparece em quem pedala travado. */
export const SINDROME_CRUZADA_SUPERIOR = {
  rigidez: ['Trapezio superior', 'Elevador da escapula', 'Peitoral'],
  fraqueza: ['Trapezio inferior', 'Serratil anterior', 'Musculos profundos do pescoco'],
  explicacao:
    'Cadeia posterior rigida gira o quadril para tras (retroversao pelvica), a coluna flete mais e o pescoco precisa estender demais para ler o terreno. Repetido por meses, isso sobrecarrega a cervical.',
  aviso:
    'Se voce tem dor, dormencia, formigamento ou fraqueza no braco, ou teve um acidente com dor cervical, procure um medico antes de qualquer exercicio.',
}
