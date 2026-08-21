import type { Level, Zone } from '../types'

/**
 * Zonas de treino.
 *
 * Sem medidor de potencia, a referencia util e frequencia cardiaca + percepcao
 * de esforco. Por isso toda zona traz tambem um "teste da fala": e o que
 * funciona na pratica quando o relogio esta em duvida.
 */

interface DefZona {
  id: string
  nome: string
  descricao: string
  fcPct: [number, number]
  /** Percentual da reserva de FC (metodo Karvonen), usado quando ha FC de repouso. */
  hrrPct: [number, number]
  ftpPct: [number, number]
  pse: [number, number]
  falaTeste: string
}

export const DEF_ZONAS: DefZona[] = [
  {
    id: 'Z1',
    nome: 'Z1 — Recuperacao',
    descricao: 'Giro leve para soltar as pernas. Serve para acelerar a recuperacao, nao para ganhar forma.',
    fcPct: [50, 60],
    hrrPct: [40, 55],
    ftpPct: [0, 55],
    pse: [1, 2],
    falaTeste: 'Voce canta sem perder o folego.',
  },
  {
    id: 'Z2',
    nome: 'Z2 — Base aerobica',
    descricao: 'O pao com manteiga do ciclista. Constroi a base que sustenta todo o resto do plano.',
    fcPct: [60, 75],
    hrrPct: [55, 70],
    ftpPct: [56, 75],
    pse: [3, 4],
    falaTeste: 'Voce conversa em frases completas.',
  },
  {
    id: 'Z3',
    nome: 'Z3 — Tempo',
    descricao: 'Ritmo forte porem sustentavel. Melhora a resistencia em subida longa e pedal de grupo.',
    fcPct: [75, 83],
    hrrPct: [70, 80],
    ftpPct: [76, 90],
    pse: [5, 6],
    falaTeste: 'Voce fala frases curtas, respirando entre elas.',
  },
  {
    id: 'Z4',
    nome: 'Z4 — Limiar',
    descricao: 'A fronteira entre o que voce sustenta e o que te quebra. E o que mais move o ponteiro do desempenho.',
    fcPct: [83, 90],
    hrrPct: [80, 88],
    ftpPct: [91, 105],
    pse: [7, 8],
    falaTeste: 'So sai palavra solta.',
  },
  {
    id: 'Z5',
    nome: 'Z5 — VO2 maximo',
    descricao: 'Intervalos curtos e duros que aumentam o teto aerobico.',
    fcPct: [90, 97],
    hrrPct: [88, 97],
    ftpPct: [106, 120],
    pse: [9, 9],
    falaTeste: 'Nao da para falar.',
  },
  {
    id: 'Z6',
    nome: 'Z6 — Neuromuscular',
    descricao: 'Sprint e arranque. Potencia pura, series de segundos com descanso longo.',
    fcPct: [97, 100],
    hrrPct: [97, 100],
    ftpPct: [121, 200],
    pse: [10, 10],
    falaTeste: 'A FC nem acompanha: o que manda aqui e a percepcao e a potencia.',
  },
]

/** Formula de Tanaka — mais precisa que 220 menos a idade em adultos. */
export function fcMaxEstimada(idade: number): number {
  return Math.round(208 - 0.7 * idade)
}

/** Watts por kg tipicos por nivel, para estimar FTP de quem nao tem medidor. */
const WKG_POR_NIVEL: Record<Level, number> = {
  iniciante: 1.8,
  intermediario: 2.4,
  avancado: 3.2,
  competitivo: 4.0,
}

export function ftpEstimado(nivel: Level, pesoKg: number): number {
  return Math.round(WKG_POR_NIVEL[nivel] * pesoKg)
}

export function calcularZonas(opcoes: {
  fcMax: number
  fcRepouso: number | null
  ftp: number | null
}): Zone[] {
  const { fcMax, fcRepouso, ftp } = opcoes
  return DEF_ZONAS.map((z) => {
    let fcBpm: [number, number] | null = null
    if (fcRepouso && fcRepouso < fcMax) {
      // Karvonen: bpm = FCrepouso + %reserva * (FCmax - FCrepouso)
      const reserva = fcMax - fcRepouso
      fcBpm = [
        Math.round(fcRepouso + (z.hrrPct[0] / 100) * reserva),
        Math.round(fcRepouso + (z.hrrPct[1] / 100) * reserva),
      ]
    } else {
      fcBpm = [Math.round((z.fcPct[0] / 100) * fcMax), Math.round((z.fcPct[1] / 100) * fcMax)]
    }
    const watts: [number, number] | null = ftp
      ? [Math.round((z.ftpPct[0] / 100) * ftp), Math.round((z.ftpPct[1] / 100) * ftp)]
      : null
    return {
      id: z.id,
      nome: z.nome,
      descricao: z.descricao,
      fcPct: z.fcPct,
      fcBpm,
      ftpPct: z.ftpPct,
      watts,
      pse: z.pse,
      falaTeste: z.falaTeste,
    }
  })
}
