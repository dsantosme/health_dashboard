/**
 * Base de conhecimento derivada do livro-guia do projeto.
 *
 * Fonte: SOVNDAL, Shannon. "Anatomia do Ciclismo — um guia ilustrado para o
 * aumento de forca, velocidade e resistencia na pratica do ciclismo".
 * Sao Paulo: Manole.
 *
 * Este arquivo NAO reproduz o texto do livro: sao anotacoes e principios
 * resumidos com nossas proprias palavras, usados pelo motor de planejamento.
 * As ilustracoes do app sao desenhos proprios (SVG), nao imagens do livro.
 */

export interface Capitulo {
  numero: number
  titulo: string
  paginaInicial: number
  /** 'lido' = ja destilado no app; 'pendente' = ainda vai virar conteudo. */
  status: 'lido' | 'pendente'
  /** O que este capitulo alimenta dentro do app. */
  aplicacaoNoApp: string
}

/** Sumario do livro — serve de roadmap para chegar a 100% de cobertura. */
export const CAPITULOS: Capitulo[] = [
  {
    numero: 1,
    titulo: 'O ciclista em movimento',
    paginaInicial: 1,
    status: 'lido',
    aplicacaoNoApp:
      'Principios de treino de forca, periodizacao (SAG), tipos de serie, aquecimento e regra de no maximo 3 dias de musculacao por semana.',
  },
  {
    numero: 2,
    titulo: 'Membros superiores',
    paginaInicial: 11,
    status: 'lido',
    aplicacaoNoApp:
      'Exercicios de braco e antebraco, aquecimento especifico de 10 min e o papel dos membros superiores como 2 dos 5 pontos de contato.',
  },
  {
    numero: 3,
    titulo: 'Ombros e pescoco',
    paginaInicial: 32,
    status: 'lido',
    aplicacaoNoApp:
      'Deltoide (tres partes), manguito rotador e musculatura do pescoco: seis exercicios na biblioteca, aquecimento especifico de 10 min e isometria cervical.',
  },
  { numero: 4, titulo: 'Torax', paginaInicial: 56, status: 'pendente', aplicacaoNoApp: 'Peitoral maior e menor — sustentacao do tronco inclinado e pedalar em pe.' },
  { numero: 5, titulo: 'Dorso', paginaInicial: 76, status: 'pendente', aplicacaoNoApp: 'Eretor da espinha, latissimo do dorso e trapezio — dorso plano e aerodinamico sem dor.' },
  { numero: 6, titulo: 'Abdome', paginaInicial: 98, status: 'pendente', aplicacaoNoApp: 'Reto, transverso e obliquos — o contrapeso do dorso; base do protocolo anti dor lombar.' },
  { numero: 7, titulo: 'Membros inferiores: isolamento muscular', paginaInicial: 122, status: 'pendente', aplicacaoNoApp: 'Isolamento de quadriceps, isquiotibiais, gluteos e panturrilha.' },
  { numero: 8, titulo: 'Membros inferiores: forca total', paginaInicial: 144, status: 'pendente', aplicacaoNoApp: 'Agachamento, leg press, afundo — a forca que vira torque no pedal.' },
  { numero: 9, titulo: 'Treinamento corporal global', paginaInicial: 164, status: 'pendente', aplicacaoNoApp: 'Circuitos e movimentos integrados de corpo inteiro.' },
]

export interface Principio {
  id: string
  titulo: string
  texto: string
  capitulo: number
  /** Onde o principio e aplicado automaticamente pelo motor. */
  ondeAplica: string
}

/**
 * Principios do capitulo 1 que o motor de planejamento aplica como regra dura.
 * Cada um tem um efeito concreto no plano gerado.
 */
export const PRINCIPIOS: Principio[] = [
  {
    id: 'corpo_inteiro',
    titulo: 'Treine o corpo inteiro, nao so as pernas',
    texto:
      'Os membros inferiores, quadris e nadegas geram a maior parte da forca, mas quem estabiliza a metade inferior e o abdome, o dorso e a metade superior do corpo. Cada sessao de academia deve tocar varias regioes, e nao uma so.',
    capitulo: 1,
    ondeAplica: 'Toda sessao de forca gerada mistura membros inferiores, tronco/core e membros superiores.',
  },
  {
    id: 'max_3_dias_forca',
    titulo: 'No maximo 3 dias de musculacao por semana',
    texto:
      'O ciclista precisa manter o treino cardiorrespiratorio. Musculacao acima de tres dias por semana rouba espaco da bike. Duas a tres sessoes melhoram potencia e forma; uma sessao ja mantem o ganho.',
    capitulo: 1,
    ondeAplica: 'O planejador limita as sessoes de forca a 3 por semana e nunca deixa zerar quando ha acesso a academia.',
  },
  {
    id: 'consistencia',
    titulo: 'Consistencia vence intensidade',
    texto:
      'A perda de condicionamento e mais rapida que o ganho. Se a semana apertar, e melhor manter um treino curto do que pular a semana inteira.',
    capitulo: 1,
    ondeAplica: 'Semanas de recuperacao reduzem volume, mas nunca zeram as sessoes.',
  },
  {
    id: 'variar_bloco',
    titulo: 'Troque o programa a cada 2 a 4 semanas',
    texto:
      'A adaptacao e o segredo (sindrome de adaptacao geral: alerta, adaptacao, exaustao). Manter o mesmo estimulo por muito tempo para de gerar adaptacao; mudar o tipo de serie mantem o corpo "em alerta".',
    capitulo: 1,
    ondeAplica: 'O metodo de serie da academia muda a cada bloco de 4 semanas (circuito, pouco peso/muitas reps, piramide, muito peso/poucas reps).',
  },
  {
    id: 'recuperacao',
    titulo: 'A adaptacao acontece no descanso',
    texto:
      'Treino em excesso leva a fase de exaustao. O ganho de forma acontece enquanto voce descansa e se recupera — nao durante a sessao.',
    capitulo: 1,
    ondeAplica: 'A cada 3 semanas de carga crescente entra 1 semana de recuperacao com ~60% do volume.',
  },
  {
    id: 'aquecimento',
    titulo: 'Aquecimento e alongamento sao parte do treino',
    texto:
      'Chegando na academia: 5 a 10 minutos de cardio leve (remo, eliptico ou bike ergometrica) e cerca de 5 minutos de alongamento, mantendo cada posicao por pelo menos 30 segundos, sem balancar. Alongue de novo no fim.',
    capitulo: 1,
    ondeAplica: 'Toda sessao de forca ja vem com bloco de aquecimento e de volta a calma no cronometro.',
  },
  {
    id: 'simular_posicao',
    titulo: 'Simule a posicao do ciclista',
    texto:
      'Ao levantar peso, reproduza a posicao que voce usa na bike. Na flexao plantar, por exemplo, apoie o pe do mesmo jeito que ele encosta no pedal. Isso aproxima o ganho da academia do gesto do pedal.',
    capitulo: 1,
    ondeAplica: 'Campo "Enfoque no ciclismo" de cada exercicio da biblioteca.',
  },
  {
    id: 'imaginar',
    titulo: 'Imagine-se conduzindo a bicicleta',
    texto:
      'Durante a serie, visualize a aplicacao no pedal: no agachamento, imagine um sprint; na ultima repeticao, imagine ultrapassar o adversario. Nao subestime a imagem mental — atletas profissionais usam isso o tempo todo.',
    capitulo: 1,
    ondeAplica: 'Dica final exibida no player de treino a cada exercicio.',
  },
  {
    id: 'ossos',
    titulo: 'Pedalar nao fortalece osso — a academia fortalece',
    texto:
      'A pedalada e suave com as articulacoes, o que e bom, mas coloca pouca tensao no osso. Quem so pedala tem maior risco de osteoporose. O treino de resistencia aumenta a mineralizacao ossea.',
    capitulo: 1,
    ondeAplica: 'Justificativa mostrada quando o plano insiste em manter forca mesmo em fase de pico.',
  },
  {
    id: 'lombar_abdome',
    titulo: 'Dor nas costas costuma ser abdome fraco',
    texto:
      'Dorso e abdome se contrapoem. Se um lado esta fraco em relacao ao outro, aparece mau alinhamento, estresse na coluna e dor. Dor lombar no ciclista frequentemente vem da falta de condicionamento do abdome, nao do dorso.',
    capitulo: 1,
    ondeAplica: 'Anamnese com dor lombar dispara um bloco extra de core (transverso e obliquos) e reduz carga axial.',
  },
  {
    id: 'bike_fit',
    titulo: 'Regulagem da bike define o comprimento ideal do musculo',
    texto:
      'A sobreposicao de actina e miosina define quanta forca a fibra consegue gerar. Selim muito baixo encurta o musculo; selim muito alto alonga demais. Nos dois casos voce desperdica potencial. Na posicao de 6 horas o joelho fica levemente flexionado.',
    capitulo: 1,
    ondeAplica: 'Checklist de bike fit na tela de Anatomia e alerta quando ha dor de joelho, lombar ou punho.',
  },
  {
    id: 'cinco_pontos',
    titulo: 'Cinco pontos de contato',
    texto:
      'Voce toca a bicicleta em cinco pontos: dois pes, duas maos e a nadega no selim. Quase todos os grandes grupos musculares participam do movimento — por isso dor em qualquer um desses pontos e um problema de todo o sistema.',
    capitulo: 1,
    ondeAplica: 'Mapa anatomico interativo da tela de Anatomia.',
  },
  {
    id: 'ombro_manguito',
    titulo: 'Manguito rotador: o que nao aparece no espelho',
    texto:
      'O papel do manguito rotador (subescapular, infraespinal, redondo menor e supraespinal) e estabilizar a articulacao do ombro. Como ele nao e visivel como o deltoide, costuma ser ignorado na academia — e esse e um erro que leva a dor e lesao de ombro.',
    capitulo: 3,
    ondeAplica: 'Todo bloco de forca inclui um exercicio de manguito rotador ou de ombro posterior.',
  },
  {
    id: 'ombro_simetria',
    titulo: 'O ombro do ciclista se desenvolve so na frente',
    texto:
      'Como voce passa quase todo o tempo inclinado sobre o guidao, o desenvolvimento do ombro acontece na regiao anterior. Sem trabalho da parte posterior, a articulacao desalinha. Anos de ciclismo tambem acentuam a curvatura cervical e inclinam a escapula, aumentando a tensao dos estabilizadores.',
    capitulo: 3,
    ondeAplica: 'Sessoes de forca priorizam ombro posterior e retracao escapular quando a anamnese acusa dor cervical.',
  },
  {
    id: 'pescoco',
    titulo: 'Pescoco em extensao o percurso inteiro',
    texto:
      'Conduzindo pela parte de cima, pelos manetes ou na empunhadura curva, o pescoco fica estendido a maior parte do tempo — trabalho do esplenio e dos extensores. Do outro lado, o esternocleidomastoideo costuma ficar subdesenvolvido, o que cria tensao indevida na cervical. As duas causas mais comuns de dor no pescoco sao treinamento em excesso e posicao inadequada na bike.',
    capitulo: 3,
    ondeAplica: 'Aquecimento com isometria cervical de 10 a 15 segundos por direcao e alerta de bike fit quando ha dor cervical.',
  },
  {
    id: 'membros_superiores',
    titulo: 'Membros superiores sao base, nao enfeite',
    texto:
      'Os bracos dao dois dos cinco pontos de contato: estabilizam o tronco em terreno plano e jogam a bike de um lado para o outro no sprint e na subida em pe. Antes da musculacao de bracos, ao menos 10 minutos de aquecimento com enfase em membro superior.',
    capitulo: 2,
    ondeAplica: 'Sessoes de forca sempre incluem pelo menos um exercicio de membro superior ou de estabilizacao de tronco.',
  },
]

/** Metodos de serie descritos no capitulo 1 — rotacionados a cada bloco. */
export interface MetodoSerie {
  id: 'circuito' | 'resistencia' | 'piramide' | 'forca_max' | 'superserie'
  nome: string
  descricao: string
  series: number
  repeticoes: string
  descansoSegundos: number
  quandoUsar: string
}

export const METODOS_SERIE: MetodoSerie[] = [
  {
    id: 'circuito',
    nome: 'Treinamento em circuito',
    descricao:
      'Varios exercicios em sequencia com pouco descanso entre eles. Trabalha o corpo todo e mantem a frequencia cardiaca alta o tempo inteiro — ganha forca e condicionamento junto.',
    series: 2,
    repeticoes: '12-15',
    descansoSegundos: 30,
    quandoUsar: 'Inicio de plano e volta de periodo parado. Otimo para quem tem pouco tempo na academia.',
  },
  {
    id: 'resistencia',
    nome: 'Pouco peso, muitas repeticoes',
    descricao:
      'Forca prolongada sem ganhar muita massa — exatamente o que o ciclista quer para subir rapido. Complete de 10 a 15 repeticoes por serie.',
    series: 3,
    repeticoes: '10-15',
    descansoSegundos: 60,
    quandoUsar: 'Fase de base e de construcao, e sempre que o objetivo envolve subir melhor.',
  },
  {
    id: 'piramide',
    nome: 'Series em piramide',
    descricao:
      'O peso sobe e as repeticoes caem a cada serie: 10, depois 8, depois 6. Transicao natural entre resistencia e forca maxima.',
    series: 3,
    repeticoes: '10 / 8 / 6',
    descansoSegundos: 90,
    quandoUsar: 'Fase especifica, quando ja existe base de tecnica.',
  },
  {
    id: 'forca_max',
    nome: 'Muito peso, poucas repeticoes',
    descricao:
      'Peso que voce consegue levantar de 4 a 8 vezes, 2 a 3 series. Desenvolve potencia para subida ingreme e prova curta. Peca acompanhamento para as series pesadas.',
    series: 3,
    repeticoes: '4-8',
    descansoSegundos: 150,
    quandoUsar: 'Fase de pico, e apenas com tecnica ja consolidada e sem dor articular ativa.',
  },
  {
    id: 'superserie',
    nome: 'Supersserie',
    descricao:
      'Uma serie unica e longa, de 30 a 40 repeticoes, reduzindo o peso conforme a fadiga chega. Cansa muito e desenvolve forca e potencia prolongadas.',
    series: 1,
    repeticoes: '30-40',
    descansoSegundos: 120,
    quandoUsar: 'Tempero de bloco — uma vez a cada ciclo, nunca em semana de recuperacao.',
  },
]

/** Aquecimento especifico por regiao, como o livro traz no inicio de cada capitulo. */
export const AQUECIMENTOS: { regiao: string; capitulo: number; minutos: number; itens: string[] }[] = [
  {
    regiao: 'Geral (toda sessao de forca)',
    capitulo: 1,
    minutos: 10,
    itens: [
      '5 a 10 minutos de cardio leve: remo, eliptico ou bike ergometrica.',
      'Cerca de 5 minutos de alongamento, cada posicao por pelo menos 30 segundos, sem balancar.',
      'Alongue de novo ao terminar o treino.',
    ],
  },
  {
    regiao: 'Membros superiores',
    capitulo: 2,
    minutos: 10,
    itens: [
      'Eliptico com barras moveis ou aparelho de remada.',
      'Flexoes com os joelhos no solo e elevacao em barra.',
      'Circunducao de membro superior.',
      'Alongamento de biceps, triceps, antebraco e ombro.',
    ],
  },
  {
    regiao: 'Ombros e pescoco',
    capitulo: 3,
    minutos: 10,
    itens: [
      'Pular corda ou remar no aparelho.',
      'Circunducoes do membro superior para a frente e para tras, ate 360 graus de amplitude.',
      'Alongue o pescoco para a frente, para tras e para os lados.',
      'Isometria cervical: segure a cabeca com a mao e resista por 10 a 15 segundos em cada direcao.',
    ],
  },
]

/** Checklist de bike fit resumido do capitulo 1. */
export const BIKE_FIT_CHECKLIST = [
  'Na posicao de 6 horas (pedal embaixo) o joelho fica levemente flexionado, nunca travado.',
  'Com o pedal as 12 horas a coxa fica quase paralela ao solo — e dali que o gluteo maximo puxa forte na descida.',
  'Cotovelos levemente flexionados no guidao; ombro solto, sem encolher em direcao a orelha.',
  'Dorso plano e alongado, nao arredondado: quem sustenta sao eretor da espinha, latissimo e trapezio.',
  'Dormencia na mao ou dor cervical geralmente e peso demais nos bracos ou regulagem, nao "falta de costume".',
  'Se algo doer de forma repetida, procure uma regulagem profissional antes de aumentar carga de treino.',
]

/** Regioes do corpo do ciclista e por que cada uma importa (capitulos 1 e 2). */
export interface RegiaoAnatomica {
  id: string
  nome: string
  musculos: string[]
  papelNoCiclismo: string
  capitulo: number
}

export const REGIOES: RegiaoAnatomica[] = [
  {
    id: 'membros_inferiores',
    nome: 'Membros inferiores e quadril',
    musculos: ['Quadriceps femoral', 'Isquiotibiais', 'Gluteo maximo', 'Gastrocnemio', 'Soleo'],
    papelNoCiclismo:
      'Geram a maior parte da forca. Como as pedivelas ficam a 180 graus, os flexores de um lado trabalham enquanto os extensores do outro se contraem — a pedalada usa todos os grupos a cada volta.',
    capitulo: 1,
  },
  {
    id: 'abdome',
    nome: 'Abdome',
    musculos: ['Reto do abdome', 'Transverso do abdome', 'Obliquo interno', 'Obliquo externo'],
    papelNoCiclismo:
      'Sustentacao anterior e lateral do tronco, contrapondo o dorso. Abdome fraco em relacao ao dorso e uma causa classica de dor nas costas no ciclista.',
    capitulo: 1,
  },
  {
    id: 'dorso',
    nome: 'Dorso',
    musculos: ['Eretor da espinha', 'Latissimo do dorso', 'Trapezio'],
    papelNoCiclismo:
      'Sustentam a coluna na posicao inclinada e mantem o dorso plano — melhor aerodinamica e menos dor em pedal longo.',
    capitulo: 1,
  },
  {
    id: 'ombro_pescoco',
    nome: 'Ombros e pescoco',
    musculos: [
      'Deltoide — partes clavicular, acromial e espinal',
      'Manguito rotador — subescapular, infraespinal, redondo menor, supraespinal',
      'Romboides',
      'Esplenio da cabeca',
      'Esternocleidomastoideo',
      'Trapezio e elevador da escapula',
    ],
    papelNoCiclismo:
      'O ombro e a ligacao entre membros superiores e tronco: sustenta o peso da parte de cima do corpo o percurso inteiro e se contrapoe a gravidade sentado, em pe ou no sprint. A articulacao e esferoidea, com seis movimentos e muita amplitude — e quanto mais liberdade, menos estrutura de sustentacao, o que aumenta o potencial de lesao. O esplenio estende o pescoco para manter o olhar na pista.',
    capitulo: 3,
  },
  {
    id: 'torax',
    nome: 'Torax',
    musculos: ['Peitoral maior', 'Peitoral menor'],
    papelNoCiclismo:
      'Permitem inclinar o tronco e jogar o guidao de um lado para o outro na subida. Pedalar em pe segurando o drop lembra a posicao de flexao de braco.',
    capitulo: 1,
  },
  {
    id: 'membros_superiores',
    nome: 'Membros superiores',
    musculos: [
      'Biceps braquial (cabecas longa e curta)',
      'Braquial',
      'Braquiorradial',
      'Coracobraquial',
      'Triceps braquial (cabecas longa, medial e curta)',
      'Flexores e extensores do carpo',
      'Pronador redondo e supinador',
    ],
    papelNoCiclismo:
      'Dois dos cinco pontos de contato. Biceps, triceps e antebraco trabalham em unissono para estabilizar o tronco atraves da articulacao do ombro; no sprint e na subida em pe eles jogam a bike lado a lado.',
    capitulo: 2,
  },
]
