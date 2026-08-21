import type { Aparelho, GrupoDestaque, Pose } from '../illustrations/pose'
import type { HealthFlag } from '../types'

/**
 * Biblioteca de exercicios.
 *
 * Conteudo destilado de:
 *  - SOVNDAL, S. "Anatomia do Ciclismo" (Manole) — capitulos 1 e 2 ja lidos.
 *  - LUDOLF, L. "Primeiros passos para dominar a sua bike" (Ludolf Bike School).
 *  - 'complementar' marca o que ainda vai ser revisado quando os capitulos 3 a 9
 *    do livro forem incorporados. Serve para medir a cobertura do projeto.
 *
 * As ilustracoes sao desenhos proprios: cada passo declara angulos articulares
 * que a Figure renderiza em SVG.
 */

export type GrupoExercicio =
  | 'membros_superiores'
  | 'membros_inferiores'
  | 'core'
  | 'dorso'
  | 'ombro'
  | 'peitoral'
  | 'mobilidade'
  | 'tecnica'

export type Padrao =
  | 'empurrar'
  | 'puxar'
  | 'joelho'
  | 'quadril'
  | 'core'
  | 'isolado'
  | 'mobilidade'
  | 'tecnica'

export interface PassoExercicio {
  texto: string
  pose: Pose
  destaque: GrupoDestaque[]
  aparelho: Aparelho
  legenda: string
  seta?: 'mao' | 'quadril' | 'joelho' | 'pe'
  setaDirecao?: 'cima' | 'baixo' | 'frente' | 'tras'
}

export interface Exercicio {
  id: string
  nome: string
  grupo: GrupoExercicio
  padrao: Padrao
  fonte: { obra: 'anatomia_ciclismo' | 'lbs' | 'complementar'; capitulo: number | null; pagina?: number }
  local: ('academia' | 'casa' | 'rua' | 'trilha' | 'rolo')[]
  musculosPrimarios: string[]
  musculosSecundarios: string[]
  /** A secao "Enfoque no ciclismo": por que este exercicio vira desempenho no pedal. */
  enfoqueNoCiclismo: string
  passos: PassoExercicio[]
  errosComuns: string[]
  contraindicadoSe: HealthFlag[]
  /** Exercicio que entra no lugar quando ha contraindicacao. */
  substituto?: string
  /** Para mobilidade: tempo de sustentacao por lado. */
  duracaoSegundos?: number
  variacoes?: { nome: string; descricao: string }[]
}

const EM_PE: Pose = { tronco: 4, ombro: 0, cotovelo: 0, quadril: 0, joelho: 4 }

// ---------------------------------------------------------------------------
// Membros superiores — capitulo 2 de Anatomia do Ciclismo
// ---------------------------------------------------------------------------

export const EXERCICIOS_MEMBROS_SUPERIORES: Exercicio[] = [
  {
    id: 'triceps_polia_alta',
    nome: 'Triceps na polia alta',
    grupo: 'membros_superiores',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 20 },
    local: ['academia'],
    musculosPrimarios: ['Triceps braquial'],
    musculosSecundarios: ['Deltoide', 'Flexores do antebraco'],
    enfoqueNoCiclismo:
      'Segurar na parte de cima do guidao mantem o triceps sob estresse constante, porque o corpo esta inclinado para a frente. Este exercicio reproduz essa posicao de mao no topo do guidao. Triceps fraco faz ombro e lombar compensarem, e a conta chega como fadiga e desconforto no pedal longo.',
    passos: [
      {
        texto: 'Em pe de frente para a polia alta, pegada pronada na barra reta, maos na largura dos ombros. Comece com a barra proxima ao torax.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -125 },
        destaque: ['triceps'],
        aparelho: 'polia_alta',
        legenda: 'Inicio: barra no torax',
      },
      {
        texto: 'Estenda os cotovelos lentamente, levando as maos em direcao a parte de cima da coxa. Cotovelos colados ao tronco o tempo todo.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -80 },
        destaque: ['triceps'],
        aparelho: 'polia_alta',
        legenda: 'Meio do movimento',
        seta: 'mao',
        setaDirecao: 'baixo',
      },
      {
        texto: 'Termine com os bracos estendidos, sem travar. Volte devagar a posicao inicial controlando a carga.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -14 },
        destaque: ['triceps', 'antebraco'],
        aparelho: 'polia_alta',
        legenda: 'Final: bracos estendidos',
      },
    ],
    errosComuns: [
      'Abrir os cotovelos para fora — vira exercicio de ombro.',
      'Usar o tronco para empurrar a barra.',
      'Soltar a volta: metade do ganho esta na fase excentrica.',
    ],
    contraindicadoSe: ['ombro_cervical'],
    substituto: 'triceps_coice_halter',
    variacoes: [
      {
        nome: 'Triceps corda',
        descricao:
          'Com corda no lugar da barra, o punho prona ao final e a cabeca curta do triceps trabalha mais. Ao terminar a extensao, abra levemente as pontas da corda.',
      },
    ],
  },
  {
    id: 'triceps_coice_halter',
    nome: 'Triceps coice com halter',
    grupo: 'membros_superiores',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 22 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Triceps braquial'],
    musculosSecundarios: ['Latissimo do dorso', 'Parte espinal do deltoide', 'Eretor da espinha'],
    enfoqueNoCiclismo:
      'E o exercicio que mais se parece com a sua posicao na bike: tronco inclinado, olhar a frente, triceps sustentando parte do peso do corpo. Treinado nessa posicao, fortalece tambem dorso, estabilizadores anteriores do tronco e pescoco — exatamente o que segura a postura em pedal longo, plano, subida ou em pe do selim.',
    passos: [
      {
        texto: 'Halter em uma mao. Incline o tronco a frente e apoie o antebraco oposto logo acima do joelho do mesmo lado do halter.',
        pose: { tronco: 72, ombro: 95, cotovelo: -90, ombroTras: -25, cotoveloTras: -55, quadril: 6, joelho: 26 },
        destaque: ['triceps'],
        aparelho: 'halter',
        legenda: 'Apoio e tronco inclinado',
      },
      {
        texto: 'Braco colado ao tronco, cotovelo a 90 graus e antebraco apontando para o solo.',
        pose: { tronco: 72, ombro: 95, cotovelo: -95, ombroTras: -25, cotoveloTras: -55, quadril: 6, joelho: 26 },
        destaque: ['triceps'],
        aparelho: 'halter',
        legenda: 'Cotovelo a 90 graus',
        seta: 'mao',
        setaDirecao: 'tras',
      },
      {
        texto: 'Estenda o cotovelo ate 180 graus, levando o halter para cima e para tras. Volte controlando.',
        pose: { tronco: 72, ombro: 95, cotovelo: -8, ombroTras: -25, cotoveloTras: -55, quadril: 6, joelho: 26 },
        destaque: ['triceps', 'dorso'],
        aparelho: 'halter',
        legenda: 'Extensao completa',
      },
    ],
    errosComuns: [
      'Deixar o cotovelo cair para longe do tronco.',
      'Arredondar a lombar em vez de manter o dorso plano.',
      'Peso alto demais: o movimento vira balanco de ombro.',
    ],
    contraindicadoSe: ['lombar'],
    substituto: 'triceps_polia_alta',
    variacoes: [
      {
        nome: 'Triceps coice na polia',
        descricao:
          'Mesma execucao com polia baixa. O cabo da resistencia constante; o halter da mais liberdade e exige mais dos estabilizadores, do dorso e do tronco.',
      },
    ],
  },
  {
    id: 'triceps_polia_costas',
    nome: 'Triceps com polia alta, de costas para o aparelho',
    grupo: 'membros_superiores',
    padrao: 'empurrar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 24 },
    local: ['academia'],
    musculosPrimarios: ['Triceps braquial'],
    musculosSecundarios: ['Deltoide', 'Reto do abdome'],
    enfoqueNoCiclismo:
      'Na posicao correta na bike ha uma leve flexao de cotovelo, e manter essa flexao contra o peso do corpo o tempo todo exige triceps. Alem disso, a cada pedalada a bike balanca de um lado para o outro: os membros superiores contrapoem esse deslocamento lateral, e conter esse balanco e potencia que segue para a frente em vez de se perder.',
    passos: [
      {
        texto: 'De costas para a polia, corda acima da cabeca, cotovelos flexionados e maos atras da cabeca. Um pe a frente e outro atras para estabilizar.',
        pose: { tronco: 40, ombro: -145, cotovelo: 115, quadril: -18, joelho: 28, quadrilTras: 26, joelhoTras: 16 },
        destaque: ['triceps'],
        aparelho: 'polia_alta',
        legenda: 'Maos atras da cabeca',
      },
      {
        texto: 'Tronco inclinado 45 graus. Mantenha os bracos imoveis e estenda so os cotovelos, puxando a corda para a frente.',
        pose: { tronco: 44, ombro: -132, cotovelo: 55, quadril: -18, joelho: 28, quadrilTras: 26, joelhoTras: 16 },
        destaque: ['triceps', 'abdome'],
        aparelho: 'polia_alta',
        legenda: 'Extensao em curso',
        seta: 'mao',
        setaDirecao: 'frente',
      },
      {
        texto: 'Termine com os membros superiores estendidos e paralelos ao solo. Volte e alterne a posicao dos pes na proxima serie.',
        pose: { tronco: 44, ombro: -118, cotovelo: 0, quadril: -18, joelho: 28, quadrilTras: 26, joelhoTras: 16 },
        destaque: ['triceps', 'abdome'],
        aparelho: 'polia_alta',
        legenda: 'Bracos paralelos ao solo',
      },
    ],
    errosComuns: [
      'Mover o ombro junto: so o cotovelo trabalha.',
      'Perder o abdome e jogar a lombar em hiperextensao.',
    ],
    contraindicadoSe: ['ombro_cervical', 'lombar'],
    substituto: 'triceps_coice_halter',
    variacoes: [
      {
        nome: 'Triceps testa',
        descricao:
          'Deitado no banco, pegada um pouco mais fechada que a largura dos ombros, umeros na vertical: flexione os cotovelos ate a barra chegar perto da testa e estenda devagar.',
      },
    ],
  },
  {
    id: 'rosca_inversa',
    nome: 'Rosca inversa',
    grupo: 'membros_superiores',
    padrao: 'puxar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 26 },
    local: ['academia'],
    musculosPrimarios: ['Extensores do antebraco', 'Braquiorradial'],
    musculosSecundarios: ['Biceps braquial', 'Braquial'],
    enfoqueNoCiclismo:
      'Muita gente se surpreende com o quanto o braco cansa depois de uma descida dificil. Descida longa e tecnica testa o limite do antebraco e da preensao. Com as maos pronadas voce reproduz a pegada do guidao — e ganha o controle necessario para um desvio subito de roda ou um buraco inesperado.',
    passos: [
      {
        texto: 'Barra com pegada pronada, maos na largura dos ombros, cotovelos estendidos, barra encostando na frente das coxas.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -18 },
        destaque: ['antebraco'],
        aparelho: 'barra',
        legenda: 'Inicio: barra nas coxas',
      },
      {
        texto: 'Cotovelos junto ao tronco, suba a barra ate a altura dos ombros flexionando os cotovelos.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -95 },
        destaque: ['antebraco', 'biceps'],
        aparelho: 'barra',
        legenda: 'Subindo',
        seta: 'mao',
        setaDirecao: 'cima',
      },
      {
        texto: 'Chegue na altura dos ombros e desca controlando ate estender de novo. Para exigir mais do antebraco, mantenha o punho estendido durante a subida.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -140 },
        destaque: ['antebraco', 'biceps'],
        aparelho: 'barra',
        legenda: 'Posicao final',
      },
    ],
    errosComuns: ['Balancar o tronco para subir a barra.', 'Deixar o cotovelo escapar para a frente.'],
    contraindicadoSe: ['punho_mao'],
    substituto: 'flexao_punho',
    variacoes: [
      {
        nome: 'Rosca inversa com halteres',
        descricao: 'Concentra mais o trabalho e garante que um lado nao compense o outro.',
      },
      {
        nome: 'Rosca inversa sobre discos de instabilidade',
        descricao: 'Em pe sobre discos, o core, o dorso e os membros inferiores entram junto.',
      },
    ],
  },
  {
    id: 'extensao_punho',
    nome: 'Extensao do punho',
    grupo: 'membros_superiores',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 28 },
    local: ['academia'],
    musculosPrimarios: ['Extensores do antebraco'],
    musculosSecundarios: ['Musculos da preensao'],
    enfoqueNoCiclismo:
      'Forca de preensao e seguranca. Voce nunca sabe quando vem o trecho irregular, o buraco ou o pedaco sem pavimento que quase arranca o guidao da mao. Treinar preensao e antebraco melhora a conducao e reduz a chance de perder o controle.',
    passos: [
      {
        texto: 'Sentado no banco, barra com os antebracos pronados (palmas para baixo), antebracos apoiados nas coxas.',
        pose: { tronco: 18, ombro: -30, cotovelo: -60, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['antebraco'],
        aparelho: 'banco',
        legenda: 'Antebracos apoiados nas coxas',
      },
      {
        texto: 'Flexione os punhos em direcao ao solo, abaixando a barra ate o fim da amplitude.',
        pose: { tronco: 18, ombro: -30, cotovelo: -60, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['antebraco'],
        aparelho: 'banco',
        legenda: 'Punho desce',
        seta: 'mao',
        setaDirecao: 'baixo',
      },
      {
        texto: 'Passando pela posicao neutra, estenda os punhos para cima o mais alto possivel, sem tirar o antebraco da coxa. Volte devagar.',
        pose: { tronco: 18, ombro: -30, cotovelo: -60, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['antebraco'],
        aparelho: 'banco',
        legenda: 'Punho sobe',
        seta: 'mao',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Levantar o antebraco da coxa.', 'Carga alta demais e amplitude curta.'],
    contraindicadoSe: ['punho_mao'],
    variacoes: [
      {
        nome: 'Enrolador para punho com maos pronadas',
        descricao:
          'Barra cilindrica com corda e um peso pequeno na ponta: bracos estendidos, palmas para baixo, enrole a corda levantando o peso do solo.',
      },
    ],
  },
  {
    id: 'flexao_punho',
    nome: 'Flexao do punho',
    grupo: 'membros_superiores',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 30 },
    local: ['academia'],
    musculosPrimarios: ['Flexores do antebraco'],
    musculosSecundarios: ['Musculos da preensao'],
    enfoqueNoCiclismo:
      'No sprint voce segura firme nas empunhaduras curvas e levanta do selim; a cada impulso do pedal a mao contem o balanco lateral gerado pela perna. O sprint exige o corpo todo, e o antebraco nao e excecao.',
    passos: [
      {
        texto: 'Sentado, barra com os antebracos supinados (palmas para cima), face posterior dos antebracos apoiada nas coxas.',
        pose: { tronco: 18, ombro: -30, cotovelo: -60, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['antebraco'],
        aparelho: 'banco',
        legenda: 'Palmas para cima',
      },
      {
        texto: 'Estenda os punhos em direcao ao solo, deixando a barra descer ate o limite confortavel.',
        pose: { tronco: 18, ombro: -30, cotovelo: -60, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['antebraco'],
        aparelho: 'banco',
        legenda: 'Barra desce',
        seta: 'mao',
        setaDirecao: 'baixo',
      },
      {
        texto: 'Passando pela posicao neutra, flexione os punhos para cima elevando a barra o maximo possivel.',
        pose: { tronco: 18, ombro: -30, cotovelo: -60, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['antebraco'],
        aparelho: 'banco',
        legenda: 'Barra sobe',
        seta: 'mao',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Usar o cotovelo para ajudar.', 'Abrir a mao no fim da amplitude e perder a preensao.'],
    contraindicadoSe: ['punho_mao'],
    variacoes: [
      {
        nome: 'Enrolador para punho com maos supinadas',
        descricao: 'Mesmo enrolador, palmas para cima e cotovelos levemente flexionados: pega tambem o biceps braquial.',
      },
    ],
  },
  {
    id: 'rosca_direta',
    nome: 'Rosca direta',
    grupo: 'membros_superiores',
    padrao: 'puxar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 11 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Biceps braquial'],
    musculosSecundarios: ['Braquial', 'Braquiorradial'],
    enfoqueNoCiclismo:
      'Biceps, triceps e antebraco trabalham em unissono para estabilizar o tronco atraves da articulacao do ombro. O biceps entra com forca quando voce puxa o guidao na subida em pe e no sprint.',
    passos: [
      {
        texto: 'Em pe, halteres ao lado do corpo, palmas para a frente, cotovelos colados ao tronco.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -10 },
        destaque: ['biceps'],
        aparelho: 'halter',
        legenda: 'Inicio',
      },
      {
        texto: 'Flexione o cotovelo sem mover o ombro, levando o halter ate a altura do ombro.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -138 },
        destaque: ['biceps', 'antebraco'],
        aparelho: 'halter',
        legenda: 'Flexao completa',
        seta: 'mao',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Jogar o tronco para tras.', 'Descer rapido demais.'],
    contraindicadoSe: [],
  },
  {
    id: 'flexao_braco',
    nome: 'Flexao de braco',
    grupo: 'peitoral',
    padrao: 'empurrar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 2, pagina: 13 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Peitoral maior', 'Triceps braquial'],
    musculosSecundarios: ['Deltoide', 'Reto do abdome', 'Serratil anterior'],
    enfoqueNoCiclismo:
      'Pedalar em pe segurando na parte curva do guidao imita a posicao de flexao. O peitoral maior e o menor sustentam a inclinacao do tronco e permitem jogar o guidao de um lado para o outro na subida. Serve tambem como aquecimento de membro superior antes da musculacao — com os joelhos no solo, se precisar.',
    passos: [
      {
        texto: 'Apoio de maos na largura dos ombros, corpo em linha reta da cabeca ao calcanhar, abdome firme.',
        pose: { rotacao: 82, tronco: -6, ombro: -78, cotovelo: 0, quadril: -6, joelho: 6, tornozelo: -30, origem: [42, 30] },
        destaque: ['peitoral'],
        aparelho: 'nenhum',
        legenda: 'Posicao alta',
      },
      {
        texto: 'Desca ate o peito chegar perto do solo, cotovelos a cerca de 45 graus do tronco. Sem deixar o quadril cair.',
        pose: { rotacao: 82, tronco: -6, ombro: -50, cotovelo: 62, quadril: -6, joelho: 6, tornozelo: -30, origem: [42, 30] },
        destaque: ['peitoral', 'triceps'],
        aparelho: 'nenhum',
        legenda: 'Posicao baixa',
        seta: 'quadril',
        setaDirecao: 'baixo',
      },
    ],
    errosComuns: ['Quadril caindo (lombar em carga).', 'Cotovelo abrindo a 90 graus do tronco.'],
    contraindicadoSe: ['ombro_cervical', 'punho_mao'],
    substituto: 'triceps_polia_alta',
  },
  {
    id: 'remada_maquina',
    nome: 'Remada na maquina',
    grupo: 'dorso',
    padrao: 'puxar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 1, pagina: 9 },
    local: ['academia'],
    musculosPrimarios: ['Latissimo do dorso', 'Romboides', 'Trapezio medio'],
    musculosSecundarios: ['Biceps braquial', 'Eretor da espinha', 'Deltoide posterior'],
    enfoqueNoCiclismo:
      'O aparelho de remada e a escolha do autor para aquecer, porque trabalha todos os musculos ao mesmo tempo. Como treino, o dorso e o que segura a coluna na posicao inclinada e mantem o dorso plano e aerodinamico sem dor no fim do pedal.',
    passos: [
      {
        texto: 'Sentado, coluna ereta, pegada na largura dos ombros, bracos estendidos a frente.',
        pose: { tronco: 10, ombro: -85, cotovelo: -8, quadril: -88, joelho: 92, origem: [42, 24] },
        destaque: ['dorso'],
        aparelho: 'banco',
        legenda: 'Bracos estendidos',
      },
      {
        texto: 'Puxe levando os cotovelos para tras, escapulas se aproximando, sem encolher os ombros.',
        pose: { tronco: 6, ombro: -20, cotovelo: -125, quadril: -88, joelho: 92, origem: [42, 24] },
        destaque: ['dorso', 'biceps'],
        aparelho: 'banco',
        legenda: 'Puxada',
        seta: 'mao',
        setaDirecao: 'tras',
      },
    ],
    errosComuns: ['Puxar so com o braco.', 'Arredondar a coluna ao voltar.'],
    contraindicadoSe: [],
  },
]

// ---------------------------------------------------------------------------
// Membros inferiores e core.
// Capitulos 6, 7 e 8 do livro ainda serao incorporados; por enquanto estes
// exercicios seguem os principios do capitulo 1 (corpo inteiro, simular a
// posicao do ciclista) e ficam marcados como 'complementar'.
// ---------------------------------------------------------------------------

export const EXERCICIOS_INFERIORES: Exercicio[] = [
  {
    id: 'agachamento',
    nome: 'Agachamento',
    grupo: 'membros_inferiores',
    padrao: 'joelho',
    fonte: { obra: 'complementar', capitulo: 8 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Quadriceps femoral', 'Gluteo maximo'],
    musculosSecundarios: ['Isquiotibiais', 'Eretor da espinha', 'Soleo'],
    enfoqueNoCiclismo:
      'Enquanto agacha, imagine-se realizando um sprint: forcando as pedivelas para baixo e ultrapassando o adversario na ultima repeticao. Essa imagem mental aproxima o ganho de forca do gesto do pedal, e nao e detalhe — atletas profissionais usam isso o tempo todo.',
    passos: [
      {
        texto: 'Pes na largura do quadril, peito aberto, abdome firme, olhar a frente.',
        pose: { ...EM_PE, tronco: 6 },
        destaque: ['quadriceps'],
        aparelho: 'nenhum',
        legenda: 'Em pe',
      },
      {
        texto: 'Desca empurrando o quadril para tras e dobrando o joelho, mantendo o joelho na direcao do pe.',
        pose: { tronco: 28, ombro: -55, cotovelo: -20, quadril: -35, joelho: 62 },
        destaque: ['quadriceps', 'gluteo'],
        aparelho: 'nenhum',
        legenda: 'Meia amplitude',
        seta: 'quadril',
        setaDirecao: 'baixo',
      },
      {
        texto: 'Desca ate onde consegue manter a coluna neutra. Suba empurrando o chao com o pe inteiro.',
        pose: { tronco: 42, ombro: -70, cotovelo: -18, quadril: -62, joelho: 104 },
        destaque: ['quadriceps', 'gluteo'],
        aparelho: 'nenhum',
        legenda: 'Fundo do agachamento',
      },
    ],
    errosComuns: [
      'Joelho colapsando para dentro.',
      'Calcanhar saindo do chao.',
      'Perder a neutralidade da lombar no fundo.',
    ],
    contraindicadoSe: ['joelho', 'lombar', 'hipertensao'],
    substituto: 'leg_press',
  },
  {
    id: 'leg_press',
    nome: 'Leg press',
    grupo: 'membros_inferiores',
    padrao: 'joelho',
    fonte: { obra: 'complementar', capitulo: 8 },
    local: ['academia'],
    musculosPrimarios: ['Quadriceps femoral', 'Gluteo maximo'],
    musculosSecundarios: ['Isquiotibiais'],
    enfoqueNoCiclismo:
      'Carga sem exigir estabilizacao de coluna — util quando ha historico de dor lombar, ou quando o objetivo e forca de perna sem risco tecnico. Posicione os pes como eles ficam no pedal: a bolinha antes do dedao alinhada com onde ficaria o eixo.',
    passos: [
      {
        texto: 'Costas e quadril bem apoiados, pes na largura do quadril na plataforma.',
        pose: { tronco: 62, ombro: 40, cotovelo: 0, quadril: -78, joelho: 78, origem: [40, 26] },
        destaque: ['quadriceps'],
        aparelho: 'banco',
        legenda: 'Joelhos flexionados',
      },
      {
        texto: 'Empurre ate quase estender o joelho, sem travar. Volte controlando ate cerca de 90 graus.',
        pose: { tronco: 62, ombro: 40, cotovelo: 0, quadril: -78, joelho: 22, origem: [40, 26] },
        destaque: ['quadriceps', 'gluteo'],
        aparelho: 'banco',
        legenda: 'Extensao',
        seta: 'pe',
        setaDirecao: 'frente',
      },
    ],
    errosComuns: ['Travar o joelho na extensao.', 'Tirar a lombar do encosto no fim da descida.'],
    contraindicadoSe: ['hipertensao'],
  },
  {
    id: 'afundo',
    nome: 'Afundo (passada)',
    grupo: 'membros_inferiores',
    padrao: 'joelho',
    fonte: { obra: 'complementar', capitulo: 8 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Quadriceps femoral', 'Gluteo maximo'],
    musculosSecundarios: ['Isquiotibiais', 'Gluteo medio', 'Core'],
    enfoqueNoCiclismo:
      'A pedalada e unilateral: uma perna estende enquanto a outra flexiona. O afundo treina exatamente esse cenario e expoe assimetria entre as pernas, que na bike aparece como joelho desviando ou quadril girando.',
    passos: [
      {
        texto: 'Em pe, de um passo a frente mantendo o tronco ereto.',
        pose: { tronco: 8, ombro: 8, cotovelo: -12, quadril: -22, joelho: 24, quadrilTras: 18, joelhoTras: 18 },
        destaque: ['quadriceps'],
        aparelho: 'nenhum',
        legenda: 'Passo a frente',
      },
      {
        texto: 'Desca o joelho de tras em direcao ao solo ate o joelho da frente formar 90 graus. Joelho da frente alinhado com o pe.',
        pose: { tronco: 10, ombro: 10, cotovelo: -12, quadril: -34, joelho: 84, quadrilTras: 34, joelhoTras: 96 },
        destaque: ['quadriceps', 'gluteo'],
        aparelho: 'nenhum',
        legenda: 'Fundo da passada',
        seta: 'quadril',
        setaDirecao: 'baixo',
      },
    ],
    errosComuns: ['Passo curto demais, jogando o joelho muito a frente do pe.', 'Tronco caindo para a frente.'],
    contraindicadoSe: ['joelho'],
    substituto: 'elevacao_pelvica',
  },
  {
    id: 'levantamento_terra_romeno',
    nome: 'Levantamento terra romeno',
    grupo: 'membros_inferiores',
    padrao: 'quadril',
    fonte: { obra: 'complementar', capitulo: 7 },
    local: ['academia'],
    musculosPrimarios: ['Isquiotibiais', 'Gluteo maximo'],
    musculosSecundarios: ['Eretor da espinha', 'Latissimo do dorso'],
    enfoqueNoCiclismo:
      'Os isquiotibiais entram na fase de arrastar o pedal para tras. Trabalhar a cadeia posterior tambem contrapoe o encurtamento que vem de horas sentado — na cadeira e no selim.',
    passos: [
      {
        texto: 'Barra proxima as coxas, joelhos levemente flexionados, coluna neutra.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -12, joelho: 12 },
        destaque: ['isquiotibiais'],
        aparelho: 'barra',
        legenda: 'Inicio',
      },
      {
        texto: 'Empurre o quadril para tras deslizando a barra pela coxa. Desca ate sentir o alongamento atras da coxa, sem arredondar as costas.',
        pose: { tronco: 66, ombro: 0, cotovelo: 0, quadril: 12, joelho: 16 },
        destaque: ['isquiotibiais', 'gluteo', 'dorso'],
        aparelho: 'barra',
        legenda: 'Quadril para tras',
        seta: 'quadril',
        setaDirecao: 'tras',
      },
    ],
    errosComuns: ['Transformar em agachamento (dobrando o joelho).', 'Arredondar a lombar no fim da descida.'],
    contraindicadoSe: ['lombar', 'cirurgia_recente'],
    substituto: 'elevacao_pelvica',
  },
  {
    id: 'elevacao_pelvica',
    nome: 'Elevacao pelvica (ponte de gluteo)',
    grupo: 'membros_inferiores',
    padrao: 'quadril',
    fonte: { obra: 'complementar', capitulo: 7 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Gluteo maximo'],
    musculosSecundarios: ['Isquiotibiais', 'Transverso do abdome'],
    enfoqueNoCiclismo:
      'Com o pedal as 12 horas a coxa fica quase paralela ao solo, e e dali que o gluteo maximo puxa forte na descida da pedalada. Gluteo fraco transfere o trabalho para a lombar.',
    passos: [
      {
        texto: 'Deitado de costas, joelhos flexionados, pes apoiados na largura do quadril.',
        pose: { rotacao: -92, tronco: 0, ombro: 96, cotovelo: 0, quadril: 76, joelho: 92, origem: [52, 8] },
        destaque: ['gluteo'],
        aparelho: 'nenhum',
        legenda: 'Quadril no solo',
      },
      {
        texto: 'Empurre o solo com o calcanhar e suba o quadril ate alinhar joelho, quadril e ombro. Aperte o gluteo no topo por 2 segundos.',
        pose: { rotacao: -70, tronco: 0, ombro: 118, cotovelo: 0, quadril: 60, joelho: 92, origem: [52, 14] },
        destaque: ['gluteo', 'isquiotibiais'],
        aparelho: 'nenhum',
        legenda: 'Quadril no alto',
        seta: 'quadril',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Estender a lombar em vez de o quadril.', 'Empurrar com a ponta do pe.'],
    contraindicadoSe: [],
  },
  {
    id: 'panturrilha_em_pe',
    nome: 'Flexao plantar em pe (panturrilha)',
    grupo: 'membros_inferiores',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 1, pagina: 8 },
    local: ['academia'],
    musculosPrimarios: ['Gastrocnemio', 'Soleo'],
    musculosSecundarios: ['Musculos intrinsecos do pe'],
    enfoqueNoCiclismo:
      'Este e o exemplo do livro para "simule a posicao de ciclista": apoie o pe no aparelho do mesmo jeito que a sapatilha encosta no pedal — a bolinha antes do dedao sobre o apoio. A panturrilha contribui na maior parte da pedalada e estabiliza o tornozelo.',
    passos: [
      {
        texto: 'Ponta do pe no apoio, calcanhar livre, joelho quase estendido. Desca o calcanhar ate alongar a panturrilha.',
        pose: { ...EM_PE, joelho: 8, tornozelo: -22 },
        destaque: ['panturrilha'],
        aparelho: 'degrau',
        legenda: 'Calcanhar abaixo do degrau',
      },
      {
        texto: 'Suba na ponta do pe o mais alto possivel e segure 1 segundo no topo antes de descer devagar.',
        pose: { ...EM_PE, joelho: 6, tornozelo: 34 },
        destaque: ['panturrilha'],
        aparelho: 'degrau',
        legenda: 'Ponta do pe',
        seta: 'quadril',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Amplitude curta.', 'Usar impulso em vez de forca.'],
    contraindicadoSe: ['tendinopatia_aquiles'],
  },
]

export const EXERCICIOS_CORE: Exercicio[] = [
  {
    id: 'prancha',
    nome: 'Prancha frontal',
    grupo: 'core',
    padrao: 'core',
    fonte: { obra: 'complementar', capitulo: 6 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Transverso do abdome', 'Reto do abdome'],
    musculosSecundarios: ['Obliquos', 'Gluteo maximo', 'Serratil anterior'],
    enfoqueNoCiclismo:
      'O abdome faz a sustentacao anterior e lateral do tronco, contrapondo o dorso. Dor nas costas no ciclista costuma vir de abdome fraco, e nao de dorso ruim: se um lado esta fraco em relacao ao outro, sobra estresse para a coluna.',
    passos: [
      {
        texto: 'Antebracos no solo sob os ombros, corpo em linha reta, umbigo para dentro.',
        pose: { rotacao: 84, tronco: -4, ombro: -74, cotovelo: 78, quadril: -4, joelho: 5, tornozelo: -30, origem: [42, 22] },
        destaque: ['abdome'],
        aparelho: 'nenhum',
        legenda: 'Linha reta da cabeca ao calcanhar',
      },
    ],
    errosComuns: ['Quadril alto demais (vira descanso).', 'Quadril caindo (carga na lombar).', 'Prender a respiracao.'],
    contraindicadoSe: ['ombro_cervical'],
    substituto: 'dead_bug',
    duracaoSegundos: 40,
  },
  {
    id: 'prancha_lateral',
    nome: 'Prancha lateral',
    grupo: 'core',
    padrao: 'core',
    fonte: { obra: 'complementar', capitulo: 6 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Obliquo interno', 'Obliquo externo'],
    musculosSecundarios: ['Gluteo medio', 'Quadrado lombar'],
    enfoqueNoCiclismo:
      'Estabilidade lateral e o que impede o quadril de girar a cada pedalada e o que segura a bike no lugar quando voce joga ela lado a lado na subida.',
    passos: [
      {
        texto: 'Apoiado no antebraco, cotovelo sob o ombro, quadril alinhado e elevado. Segure sem deixar o quadril cair.',
        pose: { rotacao: 84, tronco: -4, ombro: -74, cotovelo: 78, quadril: -4, joelho: 4, tornozelo: -30, origem: [42, 22] },
        destaque: ['abdome'],
        aparelho: 'nenhum',
        legenda: 'Quadril alinhado',
      },
    ],
    errosComuns: ['Quadril caindo.', 'Ombro encolhido em direcao a orelha.'],
    contraindicadoSe: ['ombro_cervical'],
    substituto: 'dead_bug',
    duracaoSegundos: 30,
  },
  {
    id: 'dead_bug',
    nome: 'Dead bug (abdominal contralateral)',
    grupo: 'core',
    padrao: 'core',
    fonte: { obra: 'complementar', capitulo: 6 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Transverso do abdome'],
    musculosSecundarios: ['Reto do abdome', 'Obliquos'],
    enfoqueNoCiclismo:
      'Treina manter a lombar estavel enquanto os membros se movem — que e literalmente o que o tronco faz durante toda a pedalada. Opcao segura para quem tem historico de dor lombar.',
    passos: [
      {
        texto: 'Deitado de costas, quadril e joelho a 90 graus, bracos apontando para o teto, lombar encostada no solo.',
        pose: { rotacao: -90, tronco: 0, ombro: 92, cotovelo: 0, quadril: 90, joelho: 90, origem: [52, 8] },
        destaque: ['abdome'],
        aparelho: 'nenhum',
        legenda: 'Posicao inicial',
      },
      {
        texto: 'Estenda o braco de um lado e a perna do lado oposto ate quase tocar o solo, sem tirar a lombar do chao. Volte e alterne.',
        pose: { rotacao: -90, tronco: 0, ombro: 150, cotovelo: 0, quadril: 40, joelho: 22, origem: [52, 8] },
        destaque: ['abdome'],
        aparelho: 'nenhum',
        legenda: 'Braco e perna opostos',
        seta: 'mao',
        setaDirecao: 'tras',
      },
    ],
    errosComuns: ['Arquear a lombar ao estender.', 'Ir rapido demais.'],
    contraindicadoSe: [],
    duracaoSegundos: 45,
  },
  {
    id: 'bird_dog',
    nome: 'Bird dog (quatro apoios)',
    grupo: 'core',
    padrao: 'core',
    fonte: { obra: 'complementar', capitulo: 5 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Eretor da espinha', 'Transverso do abdome'],
    musculosSecundarios: ['Gluteo maximo', 'Trapezio medio'],
    enfoqueNoCiclismo:
      'Dorso e abdome trabalhando juntos, que e a condicao para manter o dorso plano na bike sem dor depois de duas horas.',
    passos: [
      {
        texto: 'Em quatro apoios, maos sob os ombros e joelhos sob o quadril, coluna neutra.',
        pose: { rotacao: 86, tronco: -6, ombro: -84, cotovelo: 0, quadril: -6, joelho: 88, origem: [44, 26] },
        destaque: ['dorso'],
        aparelho: 'nenhum',
        legenda: 'Quatro apoios',
      },
      {
        texto: 'Estenda o braco de um lado e a perna do lado oposto ate a linha do tronco. Segure 3 segundos e alterne.',
        pose: { rotacao: 86, tronco: -6, ombro: -128, cotovelo: 0, quadril: -6, joelho: 88, quadrilTras: 24, joelhoTras: 6, origem: [44, 26] },
        destaque: ['dorso', 'gluteo'],
        aparelho: 'nenhum',
        legenda: 'Extensao contralateral',
      },
    ],
    errosComuns: ['Girar o quadril ao levantar a perna.', 'Levantar a perna acima da linha do tronco.'],
    contraindicadoSe: [],
    duracaoSegundos: 45,
  },
]

// ---------------------------------------------------------------------------
// Mobilidade — sequencia da cadeia posterior (Ludolf Bike School).
// A ordem importa: a cadeia esta interligada do pe a cabeca.
// ---------------------------------------------------------------------------

const AVISO_20S = 'Respire fundo e relaxe o corpo todo durante a sustentacao. Repita do outro lado.'

export const EXERCICIOS_MOBILIDADE: Exercicio[] = [
  {
    id: 'mob_sola_pe',
    nome: 'Liberacao da sola do pe',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Fascia plantar'],
    musculosSecundarios: ['Cadeia posterior'],
    enfoqueNoCiclismo:
      'Desconforto na sola do pe durante o pedal costuma vir da sapatilha, do taquinho muito avancado, de treino forte ou de pista com muito empurra-bike. E o primeiro elo da cadeia posterior — comecar por aqui faz o resto da sequencia render.',
    passos: [
      {
        texto: 'Em pe, apoie a sola do pe sobre uma bolinha e deslize o pe sobre ela por 1 minuto. Repita do outro lado.',
        pose: { ...EM_PE, quadril: -8, joelho: 12 },
        destaque: [],
        aparelho: 'bolinha',
        legenda: 'Deslize a sola sobre a bolinha',
        seta: 'pe',
        setaDirecao: 'frente',
      },
    ],
    errosComuns: ['Peso demais sobre a bolinha logo de inicio.'],
    contraindicadoSe: [],
    duracaoSegundos: 60,
  },
  {
    id: 'mob_gastrocnemio',
    nome: 'Mobilidade de gastrocnemio',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Gastrocnemio'],
    musculosSecundarios: ['Fascia plantar'],
    enfoqueNoCiclismo:
      'Panturrilha rigida limita o tornozelo e muda o angulo de trabalho do joelho na pedalada.',
    passos: [
      {
        texto: 'Fique a cerca de 30 cm da parede e incline o tronco a frente com as duas maos apoiadas nela.',
        pose: { tronco: 26, ombro: -110, cotovelo: 0, quadril: -6, joelho: 14, quadrilTras: 16, joelhoTras: 4, origem: [40, 47] },
        destaque: [],
        aparelho: 'parede',
        legenda: 'Maos na parede',
      },
      {
        texto: 'Estenda uma perna para tras, calcanhar no solo e dedos apontando para a frente. Quadril paralelo a parede e coluna reta, como uma linha da cabeca ao pe. Sustente 20 segundos. ' + AVISO_20S,
        pose: { tronco: 24, ombro: -108, cotovelo: 0, quadril: -8, joelho: 26, quadrilTras: 24, joelhoTras: 2, tornozeloTras: -18, origem: [40, 47] },
        destaque: ['panturrilha'],
        aparelho: 'parede',
        legenda: 'Perna de tras estendida',
      },
    ],
    errosComuns: ['Deixar o calcanhar de tras subir.', 'Girar o quadril em vez de mante-lo paralelo a parede.'],
    contraindicadoSe: [],
    duracaoSegundos: 20,
  },
  {
    id: 'mob_soleo',
    nome: 'Mobilidade de soleo',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Soleo'],
    musculosSecundarios: ['Tendao do calcaneo'],
    enfoqueNoCiclismo:
      'O soleo so aparece com o joelho flexionado — que e como a perna passa a maior parte da pedalada. Por isso ele precisa de um exercicio separado do gastrocnemio.',
    passos: [
      {
        texto: 'Um pe contra um degrau, perna oposta estendida atras, dedos para a frente, joelho da frente flexionado.',
        pose: { tronco: 16, ombro: -40, cotovelo: -30, quadril: -20, joelho: 40, quadrilTras: 22, joelhoTras: 6, origem: [42, 47] },
        destaque: [],
        aparelho: 'degrau',
        legenda: 'Pe no degrau',
      },
      {
        texto: 'Agache um pouco projetando o joelho a frente, quadril paralelo a parede e coluna reta. Sustente 20 segundos. ' + AVISO_20S,
        pose: { tronco: 20, ombro: -40, cotovelo: -30, quadril: -26, joelho: 62, quadrilTras: 22, joelhoTras: 8, origem: [42, 47] },
        destaque: ['panturrilha'],
        aparelho: 'degrau',
        legenda: 'Joelho projeta a frente',
        seta: 'joelho',
        setaDirecao: 'frente',
      },
    ],
    errosComuns: ['Tirar o calcanhar de tras do chao.'],
    contraindicadoSe: [],
    duracaoSegundos: 20,
  },
  {
    id: 'mob_isquiotibiais',
    nome: 'Alongamento de isquiotibiais com faixa',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Isquiotibiais'],
    musculosSecundarios: ['Cadeia posterior'],
    enfoqueNoCiclismo:
      'Isquiotibiais rigidos puxam o quadril para tras (retroversao pelvica). Na bike isso vira coluna mais fletida, pescoco em extensao acentuada para ler o terreno e menos potencia transferida ao pedal.',
    passos: [
      {
        texto: 'Deite alinhado no chao, flexione uma perna e passe uma toalha ou faixa no calcanhar (nao no meio do pe, senao o alongamento vai para a panturrilha).',
        pose: { rotacao: -90, tronco: 0, ombro: 60, cotovelo: -40, quadril: 108, joelho: 70, origem: [52, 8] },
        destaque: [],
        aparelho: 'faixa',
        legenda: 'Faixa no calcanhar',
      },
      {
        texto: 'Estenda o joelho e tracione a faixa por 20 segundos mantendo a coluna reta, sem criar arco na lombar. Flexione um pouquinho o joelho para levar o alongamento a parte alta do isquiotibial. ' + AVISO_20S,
        pose: { rotacao: -90, tronco: 0, ombro: 74, cotovelo: -26, quadril: 128, joelho: 16, origem: [52, 8] },
        destaque: ['isquiotibiais'],
        aparelho: 'faixa',
        legenda: 'Joelho estendido',
        seta: 'pe',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Deixar a lombar arquear.', 'Puxar com forca em vez de sustentar relaxado.'],
    contraindicadoSe: [],
    duracaoSegundos: 20,
    variacoes: [
      {
        nome: 'Isquiotibial lateralizado',
        descricao:
          'A partir da posicao anterior, flexione um pouco o joelho, lateralize a perna e tracione por 20 segundos sem deixar o quadril girar.',
      },
    ],
  },
  {
    id: 'mob_gluteo_sentado',
    nome: 'Gluteo sentado (figura 4)',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Gluteo maximo', 'Gluteo medio'],
    musculosSecundarios: ['Rotadores do quadril'],
    enfoqueNoCiclismo:
      'O gluteo e muito exigido na fase de empurrar o pedal para baixo. Liberar a tensao dos rotadores melhora o posicionamento da patela e alivia dor de joelho e quadril.',
    passos: [
      {
        texto: 'Sentado em uma cadeira, apoie o tornozelo direito sobre o joelho esquerdo.',
        pose: { tronco: 8, ombro: -46, cotovelo: -60, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: [],
        aparelho: 'cadeira',
        legenda: 'Tornozelo sobre o joelho',
      },
      {
        texto: 'Abrace o joelho direito e leve-o em direcao ao peito esquerdo por 20 segundos, coluna reta e umbigo para dentro. ' + AVISO_20S,
        pose: { tronco: 22, ombro: -70, cotovelo: -70, quadril: -92, joelho: 96, origem: [46, 24] },
        destaque: ['gluteo'],
        aparelho: 'cadeira',
        legenda: 'Joelho ao peito oposto',
        seta: 'joelho',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Arredondar a coluna para alcancar o joelho.'],
    contraindicadoSe: [],
    duracaoSegundos: 20,
  },
  {
    id: 'mob_gluteo_deitado',
    nome: 'Gluteo deitado',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Gluteo maximo'],
    musculosSecundarios: ['Piriforme'],
    enfoqueNoCiclismo: 'Versao deitada da figura 4, com mais controle de coluna — boa depois de treino longo.',
    passos: [
      {
        texto: 'Deitado, flexione a perna direita a 90 graus e apoie o tornozelo esquerdo sobre o joelho direito.',
        pose: { rotacao: -90, tronco: 0, ombro: 100, cotovelo: -30, quadril: 96, joelho: 92, origem: [52, 8] },
        destaque: [],
        aparelho: 'nenhum',
        legenda: 'Pernas cruzadas',
      },
      {
        texto: 'Abrace a coxa direita entrelacando os dedos e tracione por 20 segundos, mantendo o joelho direito na linha do ombro direito e o umbigo para dentro. ' + AVISO_20S,
        pose: { rotacao: -90, tronco: 0, ombro: 118, cotovelo: -50, quadril: 128, joelho: 96, origem: [52, 8] },
        destaque: ['gluteo'],
        aparelho: 'nenhum',
        legenda: 'Tracione a coxa',
        seta: 'joelho',
        setaDirecao: 'tras',
      },
    ],
    errosComuns: ['Levantar a cabeca e travar o pescoco.'],
    contraindicadoSe: [],
    duracaoSegundos: 20,
  },
  {
    id: 'mob_gluteo_pombo',
    nome: 'Gluteo no solo (posicao do pombo)',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Gluteo maximo', 'Rotadores profundos'],
    musculosSecundarios: ['Flexores do quadril'],
    enfoqueNoCiclismo: 'Fecha a sequencia de gluteo — a mais intensa das tres, e a que mais abre o quadril.',
    passos: [
      {
        texto: 'Sentado no chao, flexione a perna direita a frente e apoie as duas maos no solo.',
        pose: { tronco: 40, ombro: -80, cotovelo: 0, quadril: -74, joelho: 96, quadrilTras: 60, joelhoTras: 30, origem: [44, 14] },
        destaque: [],
        aparelho: 'nenhum',
        legenda: 'Perna da frente flexionada',
      },
      {
        texto: 'Incline a frente com o peso nas maos e jogue a perna esquerda para tras. Alinhe o quadril, estufe o peito e imagine o umbigo indo entre as maos. Sustente 20 segundos sem fletir a coluna. ' + AVISO_20S,
        pose: { tronco: 52, ombro: -84, cotovelo: 0, quadril: -80, joelho: 100, quadrilTras: 74, joelhoTras: 14, origem: [44, 12] },
        destaque: ['gluteo'],
        aparelho: 'nenhum',
        legenda: 'Peso nas maos, peito aberto',
      },
    ],
    errosComuns: ['Fletir a coluna — reduz muito o alongamento.', 'Deixar o quadril desalinhado.'],
    contraindicadoSe: ['joelho'],
    substituto: 'mob_gluteo_deitado',
    duracaoSegundos: 20,
  },
  {
    id: 'mob_quadriceps',
    nome: 'Quadriceps em pe',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Reto femoral', 'Vasto lateral', 'Vasto medial', 'Vasto intermedio'],
    musculosSecundarios: ['Flexores do quadril'],
    enfoqueNoCiclismo:
      'Ao incorporar a pedalada circular voce trabalha melhor o quadriceps — e pode sentir tensao em regioes dele que nunca sentiu.',
    passos: [
      {
        texto: 'Joelho da perna de apoio semiflexionado, peso entre o meio do pe e o calcanhar. Traga o pe oposto em direcao ao gluteo mantendo a coluna reta.',
        pose: { tronco: 4, ombro: 50, cotovelo: -30, quadril: 0, joelho: 10, quadrilTras: 12, joelhoTras: 130 },
        destaque: ['quadriceps'],
        aparelho: 'nenhum',
        legenda: 'Pe em direcao ao gluteo',
      },
      {
        texto: 'Jogue o joelho um pouco para tras e sustente 20 segundos sem inclinar o tronco a frente. ' + AVISO_20S,
        pose: { tronco: 2, ombro: 60, cotovelo: -26, quadril: 0, joelho: 10, quadrilTras: 26, joelhoTras: 136 },
        destaque: ['quadriceps'],
        aparelho: 'nenhum',
        legenda: 'Joelho recuado',
        seta: 'joelho',
        setaDirecao: 'tras',
      },
    ],
    errosComuns: ['Inclinar o tronco a frente, o que anula o alongamento.'],
    contraindicadoSe: ['joelho'],
    duracaoSegundos: 20,
  },
  {
    id: 'mob_psoas',
    nome: 'Psoas ajoelhado',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Psoas'],
    musculosSecundarios: ['Iliaco', 'Reto femoral'],
    enfoqueNoCiclismo:
      'O psoas e muito solicitado quando voce puxa o pedal para cima. Como ele se origina nas vertebras toracicas e lombares, psoas rigido vira dor lombar.',
    passos: [
      {
        texto: 'Ajoelhe com uma perna a frente, coluna reta, umbigo para dentro e peito estufado.',
        pose: { tronco: 4, ombro: 6, cotovelo: -20, quadril: -78, joelho: 88, quadrilTras: 4, joelhoTras: 100, origem: [44, 26] },
        destaque: [],
        aparelho: 'nenhum',
        legenda: 'Posicao ajoelhada',
      },
      {
        texto: 'Desloque o quadril para a frente e para baixo mantendo a respiracao constante, por 20 segundos. Joelho da frente ligeiramente para fora em relacao ao pe. ' + AVISO_20S,
        pose: { tronco: 0, ombro: 8, cotovelo: -20, quadril: -92, joelho: 92, quadrilTras: 12, joelhoTras: 104, origem: [44, 24] },
        destaque: ['quadriceps'],
        aparelho: 'nenhum',
        legenda: 'Quadril a frente e para baixo',
        seta: 'quadril',
        setaDirecao: 'frente',
      },
    ],
    errosComuns: ['Estender a lombar em vez de levar o quadril a frente.'],
    contraindicadoSe: ['joelho'],
    duracaoSegundos: 20,
    variacoes: [
      {
        nome: 'Reto femoral',
        descricao:
          'Da mesma posicao ajoelhada, traga o pe de tras em direcao ao gluteo e so entao desloque o quadril a frente e para baixo. Extensao de quadril com flexao de joelho e o que alonga o reto femoral de verdade.',
      },
    ],
  },
  {
    id: 'mob_mackenzie',
    nome: 'Extensao de coluna (Mackenzie)',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Eretor da espinha'],
    musculosSecundarios: ['Reto do abdome (alongamento)'],
    enfoqueNoCiclismo:
      'Extensao da coluna e muito usada no manejo de dor lombar e cai bem depois de treino longo, que passa horas em flexao.',
    passos: [
      {
        texto: 'Deitado de barriga para baixo, peito do pe no solo, cotovelos apoiados na linha dos ombros.',
        pose: { rotacao: 88, tronco: -6, ombro: -72, cotovelo: 76, quadril: -8, joelho: 4, tornozelo: 40, origem: [46, 12] },
        destaque: [],
        aparelho: 'nenhum',
        legenda: 'Apoio nos cotovelos',
      },
      {
        texto: 'Olhe para o teto, estufe o peito, projete o queixo a frente e imagine levar o umbigo em direcao as maos. Sustente 20 segundos relaxando trapezio e gluteo. Se doer a lombar, afaste os cotovelos; se persistir, nao faca.',
        pose: { rotacao: 66, tronco: -14, ombro: -60, cotovelo: 70, quadril: -10, joelho: 4, tornozelo: 40, origem: [46, 12] },
        destaque: ['dorso'],
        aparelho: 'nenhum',
        legenda: 'Peito afastado do solo',
        seta: 'quadril',
        setaDirecao: 'baixo',
      },
    ],
    errosComuns: ['Contrair o gluteo e o trapezio.', 'Forcar a lombar alem do confortavel.'],
    contraindicadoSe: ['lombar', 'cirurgia_recente'],
    duracaoSegundos: 20,
    variacoes: [
      {
        nome: 'Evolucao com cotovelos estendidos',
        descricao:
          'Se o anterior foi confortavel: palmas no solo na linha dos ombros e estenda os cotovelos afastando o peito do chao. Se houve desconforto no anterior, esta versao nao e para voce.',
      },
    ],
  },
  {
    id: 'mob_quadrado_lombar',
    nome: 'Quadrado lombar sentado',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Quadrado lombar'],
    musculosSecundarios: ['Obliquos', 'Latissimo do dorso'],
    enfoqueNoCiclismo:
      'Selim na altura errada faz o quadril girar a cada pedalada, e o quadrado lombar alonga e encurta sob tensao, sem estabilidade, milhares de vezes por treino. Este alivio anda junto com a correcao da altura do selim.',
    passos: [
      {
        texto: 'Sentado no solo, pernas estendidas e pes bem afastados. Flexione o joelho direito trazendo o pe de encontro a coxa esquerda.',
        pose: { tronco: 12, ombro: -60, cotovelo: -10, quadril: -86, joelho: 8, origem: [42, 12] },
        destaque: [],
        aparelho: 'nenhum',
        legenda: 'Sentado, pernas afastadas',
      },
      {
        texto: 'Estique a coluna, incline um pouco a frente, alinhe o ombro esquerdo com a perna esquerda e incline lateralmente projetando o braco direito sobre a cabeca. Sustente 20 segundos. ' + AVISO_20S,
        pose: { tronco: 32, ombro: -150, cotovelo: 20, quadril: -86, joelho: 8, origem: [42, 12] },
        destaque: ['dorso'],
        aparelho: 'nenhum',
        legenda: 'Inclinacao lateral',
        seta: 'mao',
        setaDirecao: 'frente',
      },
    ],
    errosComuns: ['Coluna arredondada — se nao consegue mante-la reta, faca sentado em um banco.'],
    contraindicadoSe: [],
    duracaoSegundos: 20,
  },
  {
    id: 'mob_retracao_cervical',
    nome: 'Retracao cervical',
    grupo: 'mobilidade',
    padrao: 'mobilidade',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Musculos suboccipitais'],
    musculosSecundarios: ['Musculos profundos do pescoco'],
    enfoqueNoCiclismo:
      'Cadeia posterior rigida gira o quadril para tras, a coluna flete mais e o pescoco precisa estender demais para ler a trilha. Somado a postura do celular, isso sobrecarrega a cervical.',
    passos: [
      {
        texto: 'Coluna e pescoco bem retos. Incline um pouco a cabeca a frente.',
        pose: { ...EM_PE, pescoco: 14, ombro: 4, cotovelo: -20 },
        destaque: [],
        aparelho: 'nenhum',
        legenda: 'Cabeca levemente a frente',
      },
      {
        texto: 'Leve as maos ao queixo e empurre-o em direcao a coluna por 20 segundos. Voce deve sentir alongar na base do cranio. A regiao e sensivel: nao exagere na forca.',
        pose: { ...EM_PE, pescoco: -6, ombro: -140, cotovelo: 96 },
        destaque: [],
        aparelho: 'nenhum',
        legenda: 'Queixo em direcao a coluna',
        seta: 'mao',
        setaDirecao: 'tras',
      },
    ],
    errosComuns: ['Empurrar com forca demais.', 'Fazer o exercicio com dor irradiando para o braco.'],
    contraindicadoSe: ['ombro_cervical'],
    duracaoSegundos: 20,
  },
]

// ---------------------------------------------------------------------------
// Educativos tecnicos — para fazer na bike.
// ---------------------------------------------------------------------------

export const EXERCICIOS_TECNICA: Exercicio[] = [
  {
    id: 'tec_postura_ataque',
    nome: 'Postura de ataque',
    grupo: 'tecnica',
    padrao: 'tecnica',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['trilha', 'rua'],
    musculosPrimarios: ['Core', 'Gluteo maximo'],
    musculosSecundarios: ['Deltoide', 'Triceps braquial'],
    enfoqueNoCiclismo:
      'O segredo de uma pilotagem solida e a distribuicao de peso. Dificuldade para chegar na postura costuma ser rigidez de cadeia posterior ou fraqueza muscular — por isso ela vem depois da mobilidade no plano.',
    passos: [
      {
        texto: 'Fora do selim: cotovelos e joelhos semiflexionados, cotovelos abertos, peso distribuido igualmente nos dois pes.',
        pose: { tronco: 54, ombro: -96, cotovelo: 34, quadril: -14, joelho: 34, origem: [40, 34] },
        destaque: ['abdome'],
        aparelho: 'bike',
        legenda: 'Cotovelos e joelhos semiflexionados',
      },
      {
        texto: 'Alinhe o queixo com o guidao ou um pouco a frente: peso principal nos pes, maos leves. Coluna quase paralela ao top tube. Ajuste milimetros para a frente e para tras ate achar o ponto neutro — aquele em que, ao soltar as maos, o tronco nao cai para nenhum lado.',
        pose: { tronco: 62, ombro: -100, cotovelo: 28, quadril: -10, joelho: 30, origem: [38, 34] },
        destaque: ['abdome', 'triceps'],
        aparelho: 'bike',
        legenda: 'Queixo na linha do guidao',
        seta: 'quadril',
        setaDirecao: 'frente',
      },
    ],
    errosComuns: [
      'Bracos e maos tensos.',
      'Pernas fadigando cedo demais.',
      'Peso muito para tras, tirando aderencia da roda dianteira.',
    ],
    contraindicadoSe: [],
    duracaoSegundos: 300,
  },
  {
    id: 'tec_pedalada_unilateral',
    nome: 'Educativo de pedalada unilateral',
    grupo: 'tecnica',
    padrao: 'tecnica',
    fonte: { obra: 'lbs', capitulo: null },
    local: ['rua', 'rolo'],
    musculosPrimarios: ['Psoas', 'Isquiotibiais', 'Gastrocnemio'],
    musculosSecundarios: ['Quadriceps femoral', 'Gluteo maximo'],
    enfoqueNoCiclismo:
      'Pedalar com transferencia de forca circular economiza energia no percurso inteiro e ajuda a passar os obstaculos maiores. Precisa de pratica ate virar automatico.',
    passos: [
      {
        texto: 'Com pedal de encaixe, procure terreno liso de inclinacao leve e constante (um estradao). Marcha leve.',
        pose: { tronco: 46, ombro: -92, cotovelo: 24, quadril: -34, joelho: 62, origem: [40, 36] },
        destaque: [],
        aparelho: 'bike',
        legenda: 'Terreno liso, marcha leve',
      },
      {
        texto: 'Desencaixe um pe e deixe a perna flutuando. Suba pedalando so com o outro pe, mantendo-o paralelo ao solo.',
        pose: { tronco: 46, ombro: -92, cotovelo: 24, quadril: -60, joelho: 84, quadrilTras: 20, joelhoTras: 40, origem: [40, 36] },
        destaque: ['quadriceps'],
        aparelho: 'bike',
        legenda: 'Uma perna so',
      },
      {
        texto: 'Aplique forca nos 360 graus: empurre para baixo, arraste para tras, puxe para cima, empurre para a frente. Espere sentir musculos que voce nao usava.',
        pose: { tronco: 46, ombro: -92, cotovelo: 24, quadril: 30, joelho: 96, quadrilTras: 20, joelhoTras: 40, origem: [40, 36] },
        destaque: ['isquiotibiais', 'panturrilha'],
        aparelho: 'bike',
        legenda: 'Forca nos 360 graus',
        seta: 'pe',
        setaDirecao: 'tras',
      },
    ],
    errosComuns: [
      'Marcha pesada demais — a coordenacao vai embora com a fadiga.',
      'Deixar o pe cair a cada volta em vez de mante-lo paralelo ao solo.',
    ],
    contraindicadoSe: ['joelho'],
    duracaoSegundos: 300,
  },
]


// ---------------------------------------------------------------------------
// Ombros e pescoco — capitulo 3 de Anatomia do Ciclismo.
// O ombro e a ligacao entre membro superior e tronco: sustenta o peso da parte
// de cima do corpo o percurso inteiro, sentado, em pe ou no sprint.
// ---------------------------------------------------------------------------

export const EXERCICIOS_OMBRO: Exercicio[] = [
  {
    id: 'desenvolvimento_sentado',
    nome: 'Desenvolvimento sentado com halteres',
    grupo: 'ombro',
    padrao: 'empurrar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 3, pagina: 36 },
    local: ['academia'],
    musculosPrimarios: ['Parte clavicular do deltoide'],
    musculosSecundarios: ['Parte acromial do deltoide', 'Triceps braquial', 'Porcao superior do peitoral maior', 'Trapezio'],
    enfoqueNoCiclismo:
      'Toda posicao no ciclismo depende dos ombros para contrapor o peso do tronco inclinado sobre o guidao. As partes clavicular e acromial do deltoide sao o que estabiliza o tronco enquanto voce pedala. Lembre-se: qualquer movimento da bike que nao empurre voce para a frente e energia jogada fora.',
    passos: [
      {
        texto: 'Sentado na bola de estabilidade (ou no banco), halteres com cotovelos flexionados e maos na altura dos ombros, palmas para a frente.',
        pose: { tronco: 6, ombro: -22, cotovelo: -148, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['ombro'],
        aparelho: 'halter',
        legenda: 'Maos na altura dos ombros',
      },
      {
        texto: 'Suba os dois halteres verticalmente ao mesmo tempo, ate os cotovelos ficarem estendidos.',
        pose: { tronco: 6, ombro: -172, cotovelo: -6, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['ombro', 'triceps'],
        aparelho: 'halter',
        legenda: 'Cotovelos estendidos',
        seta: 'mao',
        setaDirecao: 'cima',
      },
      {
        texto: 'Abaixe os dois halteres ate a posicao inicial, controlando. Dorso plano e nadegas um pouco a frente sobre a bola, para ela nao rolar para tras.',
        pose: { tronco: 6, ombro: -22, cotovelo: -148, quadril: -88, joelho: 92, origem: [46, 24] },
        destaque: ['ombro'],
        aparelho: 'halter',
        legenda: 'Volta controlada',
      },
    ],
    errosComuns: ['Arquear a lombar para empurrar o peso.', 'Deixar a bola rolar para tras.'],
    contraindicadoSe: ['ombro_cervical', 'hipertensao'],
    substituto: 'elevacao_giro_halteres',
    variacoes: [
      { nome: 'Desenvolvimento no aparelho', descricao: 'Mais seguranca e estabilidade — boa opcao para quem fica tenso com halteres ou barra.' },
      { nome: 'Desenvolvimento com barra', descricao: 'Maos na largura dos ombros, barra a frente do torax ou atras da cabeca; eleve ate estender os cotovelos.' },
    ],
  },
  {
    id: 'remada_em_pe',
    nome: 'Remada em pe',
    grupo: 'ombro',
    padrao: 'puxar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 3, pagina: 38 },
    local: ['academia'],
    musculosPrimarios: ['Parte clavicular do deltoide', 'Parte acromial do deltoide'],
    musculosSecundarios: ['Infraespinal', 'Supraespinal', 'Redondo menor', 'Trapezio'],
    enfoqueNoCiclismo:
      'Em subida longa as maos ficam no topo do guidao e, quando voce decide forcar, traciona o guidao para cima a cada giro das pedivelas. E a posicao que qualquer ciclista assume quando entra no ritmo da montanha. Concentre-se nela enquanto puxa a barra.',
    passos: [
      {
        texto: 'Barra com pegada pronada, maos um pouco mais estreitas que a largura dos ombros, bracos estendidos para baixo.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -12 },
        destaque: ['ombro'],
        aparelho: 'barra',
        legenda: 'Bracos estendidos',
      },
      {
        texto: 'Puxe a barra verticalmente ate a parte superior do torax, mantendo os cotovelos elevados. Volte lentamente.',
        pose: { ...EM_PE, ombro: -34, cotovelo: -122 },
        destaque: ['ombro', 'dorso'],
        aparelho: 'barra',
        legenda: 'Cotovelos elevados',
        seta: 'mao',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Cotovelo abaixo da mao no topo.', 'Balancar o tronco para dar impulso.'],
    contraindicadoSe: ['ombro_cervical'],
    substituto: 'remada_unilateral',
    variacoes: [
      { nome: 'Remada em pe com cabo', descricao: 'Barra reta na polia baixa; dorso plano, cotovelos elevados, puxe ate a parte superior do torax.' },
      { nome: 'Remada em pe sobre discos de instabilidade', descricao: 'As pernas estabilizam a posicao e o tronco, inclusive a lombar, entra no trabalho.' },
    ],
  },
  {
    id: 'elevacao_giro_halteres',
    nome: 'Elevacao e giro com halteres',
    grupo: 'ombro',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 3, pagina: 40 },
    local: ['academia'],
    musculosPrimarios: ['Parte clavicular do deltoide', 'Parte acromial do deltoide'],
    musculosSecundarios: ['Trapezio', 'Porcao superior do peitoral maior', 'Parte espinal do deltoide', 'Supraespinal', 'Eretor da espinha'],
    enfoqueNoCiclismo:
      'Ao levantar do selim voce desloca o peso de um lado para o outro para empregar mais potencia nos pedais — o mesmo movimento do ataque no plano e do sprint final. Esse deslocamento torce a parte superior do corpo o tempo todo. Aqui voce carrega os dois lados de forma diferente ao mesmo tempo, e o dorso e o tronco precisam impedir a torcao: o centro de gravidade muda de forma dinamica e voce compensa.',
    passos: [
      {
        texto: 'Um halter em cada mao, pronacao (palmas para tras), cotovelos estendidos e membros ao lado do corpo.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -6 },
        destaque: ['ombro'],
        aparelho: 'halter',
        legenda: 'Halteres ao lado do corpo',
      },
      {
        texto: 'Cotovelos estendidos: levante o membro direito para a frente ate ficar paralelo ao solo e, ao mesmo tempo, o esquerdo para o lado ate tambem ficar paralelo ao solo.',
        pose: { ...EM_PE, ombro: -88, cotovelo: -4, ombroTras: 2, cotoveloTras: -4 },
        destaque: ['ombro'],
        aparelho: 'halter',
        legenda: 'Um a frente, outro ao lado',
        seta: 'mao',
        setaDirecao: 'frente',
      },
      {
        texto: 'No plano horizontal, troque a posicao: leve o direito para o lado e o esquerdo para a frente. Depois abaixe os halteres e repita alternando a posicao inicial.',
        pose: { ...EM_PE, ombro: -88, cotovelo: -4, ombroTras: -88, cotoveloTras: -4 },
        destaque: ['ombro', 'abdome'],
        aparelho: 'halter',
        legenda: 'Troca no plano horizontal',
      },
    ],
    errosComuns: ['Subir os ombros em direcao a orelha.', 'Girar o tronco junto — e ele que deve segurar a torcao.'],
    contraindicadoSe: ['ombro_cervical'],
    variacoes: [
      { nome: 'Sobre discos de instabilidade', descricao: 'Aumenta bastante a exigencia de estabilizacao.' },
    ],
  },
  {
    id: 'a_frame',
    nome: 'A-Frame (manguito rotador)',
    grupo: 'ombro',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 3, pagina: 42 },
    local: ['academia', 'casa'],
    musculosPrimarios: ['Parte acromial do deltoide', 'Subescapular', 'Infraespinal', 'Supraespinal', 'Redondo menor'],
    musculosSecundarios: ['Partes clavicular e espinal do deltoide', 'Trapezio', 'Biceps braquial'],
    enfoqueNoCiclismo:
      'O manguito rotador nao aparece no espelho como o deltoide, e por isso e o grupo mais ignorado na academia — um erro que leva a dor e lesao de ombro. Na posicao de pedalar, e ele que estabiliza o ombro e da a base para voce sustentar o peso do corpo.',
    passos: [
      {
        texto: 'Halteres com os polegares para cima, cotovelos junto a cintura e antebracos apontando para a frente.',
        pose: { ...EM_PE, ombro: 2, cotovelo: -92 },
        destaque: ['ombro'],
        aparelho: 'halter',
        legenda: 'Antebracos a frente',
      },
      {
        texto: 'Mova cada halter lateralmente mantendo os antebracos paralelos ao solo (rotacao lateral do ombro).',
        pose: { ...EM_PE, ombro: 2, cotovelo: -92, ombroTras: 2, cotoveloTras: -92 },
        destaque: ['ombro'],
        aparelho: 'halter',
        legenda: 'Abre lateralmente',
        seta: 'mao',
        setaDirecao: 'tras',
      },
      {
        texto: 'Com os cotovelos ainda a 90 graus, leve os halteres acima da cabeca ate se tocarem. Depois desca a posicao lateral e volte a frente, fazendo o caminho inverso.',
        pose: { ...EM_PE, ombro: -158, cotovelo: -66 },
        destaque: ['ombro'],
        aparelho: 'halter',
        legenda: 'Halteres acima da cabeca',
        seta: 'mao',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Peso alto demais — manguito rotador responde a carga leve e movimento limpo.', 'Perder os 90 graus de cotovelo no meio do caminho.'],
    contraindicadoSe: [],
    variacoes: [
      { nome: 'Rotacao lateral com halter', descricao: 'Deitado com dorso e cotovelo apoiados no banco, antebraco cruzado na cintura e paralelo ao solo: gire na altura do ombro descrevendo um arco ate a vertical.' },
      { nome: 'Rotacao medial com halter', descricao: 'Mesma posicao, antebraco estendido lateralmente paralelo ao solo: gire descrevendo o arco do banco ate a vertical.' },
    ],
  },
  {
    id: 'elevacao_lateral_bola',
    nome: 'Elevacao lateral sobre a bola de estabilidade',
    grupo: 'ombro',
    padrao: 'isolado',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 3, pagina: 44 },
    local: ['academia'],
    musculosPrimarios: ['Parte espinal do deltoide'],
    musculosSecundarios: ['Parte acromial do deltoide', 'Trapezio', 'Romboides', 'Infraespinal', 'Redondo menor', 'Redondo maior', 'Eretor da espinha'],
    enfoqueNoCiclismo:
      'Duas forcas agem no ombro na bike: o peso constante para baixo sobre o guidao e a tracao para cima quando voce enfrenta subida ou sprint. Como voce passa quase todo o tempo inclinado a frente, o desenvolvimento acontece na regiao anterior do ombro. Este exercicio trabalha a parte posterior — e simetria e o que alinha a articulacao e evita lesao.',
    passos: [
      {
        texto: 'Pes apoiados na parede, parte anterior do quadril e abdome sobre uma bola grande. Halteres pendendo na vertical, polegares para cima.',
        pose: { rotacao: 84, tronco: -6, ombro: -84, cotovelo: 0, quadril: -6, joelho: 4, tornozelo: -20, origem: [40, 26] },
        destaque: ['dorso'],
        aparelho: 'halter',
        legenda: 'Bracos pendendo',
      },
      {
        texto: 'Cotovelos estendidos, levante as maos em arco ate ficarem a 90 graus em relacao ao corpo e paralelas ao solo. Volte devagar.',
        pose: { rotacao: 84, tronco: -6, ombro: -12, cotovelo: 0, quadril: -6, joelho: 4, tornozelo: -20, origem: [40, 26] },
        destaque: ['ombro', 'dorso'],
        aparelho: 'halter',
        legenda: 'Arco ate 90 graus',
        seta: 'mao',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Dobrar o cotovelo para levantar mais peso.', 'Perder o apoio dos pes na parede.'],
    contraindicadoSe: ['lombar'],
    substituto: 'a_frame',
    variacoes: [
      { nome: 'Elevacao lateral no banco com tronco flexionado', descricao: 'Sentado no banco, torax proximo dos joelhos, cotovelos estendidos e bracos para baixo: eleve lateralmente ate ficarem paralelos ao solo.' },
    ],
  },
  {
    id: 'remada_unilateral',
    nome: 'Remada unilateral',
    grupo: 'ombro',
    padrao: 'puxar',
    fonte: { obra: 'anatomia_ciclismo', capitulo: 3, pagina: 46 },
    local: ['academia'],
    musculosPrimarios: ['Parte espinal do deltoide', 'Latissimo do dorso'],
    musculosSecundarios: ['Trapezio', 'Romboides', 'Biceps braquial'],
    enfoqueNoCiclismo:
      'Ao levantar para o sprint voce nao so pedala mais forte: traciona o guidao com forca, alternando os lados. A remada unilateral simula essa tracao oscilante. Enquanto executa, imagine o sprint final e sinta cada braco puxando o guidao.',
    passos: [
      {
        texto: 'Joelho e mao do mesmo lado apoiados no banco, dorso paralelo ao solo.',
        pose: { tronco: 84, ombro: -66, cotovelo: 0, ombroTras: -30, cotoveloTras: -40, quadril: 8, joelho: 24, origem: [44, 30] },
        destaque: ['dorso'],
        aparelho: 'halter',
        legenda: 'Dorso paralelo ao solo',
      },
      {
        texto: 'Halter na outra mao, membro superior pendendo na vertical em direcao ao solo.',
        pose: { tronco: 84, ombro: -60, cotovelo: 0, ombroTras: -30, cotoveloTras: -40, quadril: 8, joelho: 24, origem: [44, 30] },
        destaque: ['dorso'],
        aparelho: 'halter',
        legenda: 'Braco na vertical',
      },
      {
        texto: 'Puxe o halter ate a mao se aproximar do torax, deslizando o cotovelo contra o lado do tronco. Volte a posicao inicial.',
        pose: { tronco: 84, ombro: 30, cotovelo: -118, ombroTras: -30, cotoveloTras: -40, quadril: 8, joelho: 24, origem: [44, 30] },
        destaque: ['dorso', 'ombro'],
        aparelho: 'halter',
        legenda: 'Cotovelo desliza pelo tronco',
        seta: 'mao',
        setaDirecao: 'cima',
      },
    ],
    errosComuns: ['Girar o tronco para puxar mais peso.', 'Puxar so com o biceps, sem levar o cotovelo para tras.'],
    contraindicadoSe: ['lombar'],
    variacoes: [
      { nome: 'Puxada unilateral com cabo', descricao: 'Sentado, alca na polia baixa, outra mao no joelho: puxe a alca para tras ate o lado do tronco, cotovelo e braco junto ao corpo.' },
    ],
  },
]

export const EXERCICIOS: Exercicio[] = [
  ...EXERCICIOS_MEMBROS_SUPERIORES,
  ...EXERCICIOS_INFERIORES,
  ...EXERCICIOS_CORE,
  ...EXERCICIOS_OMBRO,
  ...EXERCICIOS_MOBILIDADE,
  ...EXERCICIOS_TECNICA,
]

const PORID = new Map(EXERCICIOS.map((e) => [e.id, e]))

export function exercicio(id: string): Exercicio | undefined {
  return PORID.get(id)
}
