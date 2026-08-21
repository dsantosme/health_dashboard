/**
 * Cinematica direta de uma figura humana de perfil.
 *
 * As ilustracoes do app sao desenhos proprios gerados a partir de angulos
 * articulares — nao imagens escaneadas de livro. Cada passo de um exercicio
 * declara uma Pose, e a Pose vira pontos na tela.
 *
 * Convencao de angulos (graus, sistema matematico com Y para cima):
 *   0   = segmento apontando para baixo (ou para cima, no caso do tronco)
 *   +   = gira no sentido do "para a frente" da figura (para a direita da tela)
 */

export type Vec = readonly [number, number]

export interface Pose {
  /** Inclinacao do tronco a partir da vertical. 0 = ereto, 90 = horizontal. */
  tronco: number
  /** Angulo do pescoco somado ao do tronco. Negativo = olhar para cima. */
  pescoco?: number
  /** Braco da frente, medido a partir do "para baixo" absoluto. */
  ombro: number
  cotovelo: number
  /** Perna da frente. quadril = coxa a partir do "para baixo" absoluto. */
  quadril: number
  /** Flexao do joelho (0 = perna reta). */
  joelho: number
  /** Flexao do tornozelo. Positivo = ponta do pe para baixo. */
  tornozelo?: number
  /** Membros do lado oposto — usados em posicoes assimetricas (afundo, passada). */
  ombroTras?: number
  cotoveloTras?: number
  quadrilTras?: number
  joelhoTras?: number
  tornozeloTras?: number
  /** Rotacao do corpo inteiro em torno do quadril. 90 = deitado de barriga para cima. */
  rotacao?: number
  /** Posicao do quadril no quadro 100x100 (x da esquerda, y do chao). */
  origem?: Vec
  /**
   * 'auto' (padrao) desce a figura ate o ponto mais baixo tocar o chao, o que
   * evita ter que calcular a altura do quadril em cada agachamento e prancha.
   */
  apoio?: 'auto' | 'nenhum'
}

export const SEGMENTOS = {
  tronco: 30,
  pescoco: 8,
  cabeca: 6.5,
  braco: 15,
  antebraco: 14,
  coxa: 23,
  canela: 23,
  pe: 9,
} as const

const rad = (g: number) => (g * Math.PI) / 180

function girar([x, y]: Vec, graus: number): Vec {
  const c = Math.cos(rad(graus))
  const s = Math.sin(rad(graus))
  // Sentido horario visualmente (com Y para cima): +angulo joga o vetor para +X.
  return [x * c + y * s, -x * s + y * c]
}

function somar([x, y]: Vec, [dx, dy]: Vec, escala = 1): Vec {
  return [x + dx * escala, y + dy * escala]
}

/** Linha do chao no quadro 100x100. */
export const CHAO = 94

const CIMA: Vec = [0, 1]
const BAIXO: Vec = [0, -1]

export interface Esqueleto {
  quadril: Vec
  ombro: Vec
  pescoco: Vec
  cabeca: Vec
  cotovelo: Vec
  mao: Vec
  joelho: Vec
  tornozelo: Vec
  ponta: Vec
  cotoveloTras: Vec | null
  maoTras: Vec | null
  joelhoTras: Vec | null
  tornozeloTras: Vec | null
  pontaTras: Vec | null
  /** Direcao do tronco, util para posicionar aparelhos. */
  dirTronco: Vec
}

/**
 * Resolve a pose em pontos no quadro 100x100 usado pelos SVGs.
 * O resultado ja vem em coordenadas de tela (Y para baixo).
 */
export function resolver(pose: Pose): Esqueleto {
  const rot = pose.rotacao ?? 0
  const origem = pose.origem ?? [50, 47]

  const dirTronco = girar(girar(CIMA, pose.tronco), rot)
  const dirPescoco = girar(dirTronco, pose.pescoco ?? 0)

  const quadril: Vec = [0, 0]
  const ombro = somar(quadril, dirTronco, SEGMENTOS.tronco)
  const pescoco = somar(ombro, dirPescoco, SEGMENTOS.pescoco)
  const cabeca = somar(ombro, dirPescoco, SEGMENTOS.pescoco + SEGMENTOS.cabeca * 0.6)

  const dirBraco = girar(girar(BAIXO, pose.ombro), rot)
  const cotovelo = somar(ombro, dirBraco, SEGMENTOS.braco)
  const dirAntebraco = girar(dirBraco, pose.cotovelo)
  const mao = somar(cotovelo, dirAntebraco, SEGMENTOS.antebraco)

  const dirCoxa = girar(girar(BAIXO, pose.quadril), rot)
  const joelho = somar(quadril, dirCoxa, SEGMENTOS.coxa)
  const dirCanela = girar(dirCoxa, pose.joelho)
  const tornozelo = somar(joelho, dirCanela, SEGMENTOS.canela)
  const dirPe = girar(dirCanela, -(90 - (pose.tornozelo ?? 0)))
  const ponta = somar(tornozelo, dirPe, SEGMENTOS.pe)

  let cotoveloTras: Vec | null = null
  let maoTras: Vec | null = null
  if (pose.ombroTras !== undefined) {
    const d = girar(girar(BAIXO, pose.ombroTras), rot)
    cotoveloTras = somar(ombro, d, SEGMENTOS.braco)
    maoTras = somar(cotoveloTras, girar(d, pose.cotoveloTras ?? 0), SEGMENTOS.antebraco)
  }

  let joelhoTras: Vec | null = null
  let tornozeloTras: Vec | null = null
  let pontaTras: Vec | null = null
  if (pose.quadrilTras !== undefined) {
    const d = girar(girar(BAIXO, pose.quadrilTras), rot)
    joelhoTras = somar(quadril, d, SEGMENTOS.coxa)
    const dc = girar(d, pose.joelhoTras ?? 0)
    tornozeloTras = somar(joelhoTras, dc, SEGMENTOS.canela)
    pontaTras = somar(tornozeloTras, girar(dc, -(90 - (pose.tornozeloTras ?? 0))), SEGMENTOS.pe)
  }

  // Converte para coordenadas de tela: X desloca pela origem, Y inverte.
  const bruto = (p: Vec): Vec => [origem[0] + p[0], 100 - (origem[1] + p[1])]

  const todos = [
    quadril, ombro, pescoco, cabeca, cotovelo, mao, joelho, tornozelo, ponta,
    cotoveloTras, maoTras, joelhoTras, tornozeloTras, pontaTras,
  ].filter(Boolean) as Vec[]

  // Apoia a figura no chao: assim cada pose so precisa declarar angulos.
  let ajuste = 0
  if ((pose.apoio ?? 'auto') === 'auto') {
    const maisBaixo = Math.max(...todos.map((p) => bruto(p)[1]))
    ajuste = CHAO - maisBaixo
  }

  const tela = (p: Vec): Vec => {
    const [x, y] = bruto(p)
    return [x, y + ajuste]
  }
  const telaOuNulo = (p: Vec | null) => (p ? tela(p) : null)

  return {
    quadril: tela(quadril),
    ombro: tela(ombro),
    pescoco: tela(pescoco),
    cabeca: tela(cabeca),
    cotovelo: tela(cotovelo),
    mao: tela(mao),
    joelho: tela(joelho),
    tornozelo: tela(tornozelo),
    ponta: tela(ponta),
    cotoveloTras: telaOuNulo(cotoveloTras),
    maoTras: telaOuNulo(maoTras),
    joelhoTras: telaOuNulo(joelhoTras),
    tornozeloTras: telaOuNulo(tornozeloTras),
    pontaTras: telaOuNulo(pontaTras),
    dirTronco: [dirTronco[0], -dirTronco[1]],
  }
}

/** Grupos musculares que podem ser destacados na figura. */
export type GrupoDestaque =
  | 'quadriceps'
  | 'isquiotibiais'
  | 'gluteo'
  | 'panturrilha'
  | 'triceps'
  | 'biceps'
  | 'antebraco'
  | 'ombro'
  | 'peitoral'
  | 'dorso'
  | 'abdome'

/** Aparelhos e apoios que a ilustracao sabe desenhar. */
export type Aparelho =
  | 'barra'
  | 'halter'
  | 'polia_alta'
  | 'polia_baixa'
  | 'banco'
  | 'parede'
  | 'degrau'
  | 'cadeira'
  | 'faixa'
  | 'bolinha'
  | 'bike'
  | 'nenhum'
