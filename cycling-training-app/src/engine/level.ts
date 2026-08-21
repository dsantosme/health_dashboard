import type { Level, Profile } from '../types'

/**
 * Avaliacao de nivel.
 *
 * O score e transparente de proposito: o atleta ve de onde saiu cada ponto e
 * consegue acompanhar o proprio progresso refazendo o questionario.
 */

export interface ResultadoNivel {
  level: Level
  score: number
  racional: string[]
}

interface Fator {
  rotulo: string
  peso: number
  valor: (p: Profile) => number // 0 a 1
  detalhe: (p: Profile) => string
}

const limitar = (v: number, max: number) => Math.min(Math.max(v, 0), max) / max

const FATORES: Fator[] = [
  {
    rotulo: 'Volume semanal atual',
    peso: 25,
    valor: (p) => limitar(p.horasSemanaAtual, 12),
    detalhe: (p) => `${p.horasSemanaAtual} h/semana de bike hoje`,
  },
  {
    rotulo: 'Anos de ciclismo',
    peso: 15,
    valor: (p) => limitar(p.anosCiclismo, 10),
    detalhe: (p) => `${p.anosCiclismo} ano(s) pedalando`,
  },
  {
    rotulo: 'Quilometragem semanal',
    peso: 15,
    valor: (p) => limitar(p.kmSemanaAtual, 300),
    detalhe: (p) => `${p.kmSemanaAtual} km/semana`,
  },
  {
    rotulo: 'Autoavaliacao de condicionamento',
    peso: 15,
    valor: (p) => (p.autoavaliacaoCondicionamento - 1) / 4,
    detalhe: (p) => `autoavaliacao ${p.autoavaliacaoCondicionamento} de 5`,
  },
  {
    rotulo: 'Pedal mais longo recente',
    peso: 10,
    valor: (p) => limitar(p.maiorPedalRecenteKm, 150),
    detalhe: (p) => `maior pedal recente de ${p.maiorPedalRecenteKm} km`,
  },
  {
    rotulo: 'Base atletica de outros esportes',
    peso: 5,
    valor: (p) => limitar(p.outrosEsportesAnos, 10),
    detalhe: (p) => `${p.outrosEsportesAnos} ano(s) de outros esportes`,
  },
  {
    rotulo: 'Experiencia com treino estruturado',
    peso: 5,
    valor: (p) => (p.treinoEstruturadoAntes ? 1 : 0),
    detalhe: (p) => (p.treinoEstruturadoAntes ? 'ja seguiu plano estruturado' : 'sem plano estruturado antes'),
  },
  {
    rotulo: 'Historico de competicao',
    peso: 5,
    valor: (p) => (p.competiuAntes ? 1 : 0),
    detalhe: (p) => (p.competiuAntes ? 'ja competiu' : 'sem competicao'),
  },
  {
    rotulo: 'Treino de forca ja na rotina',
    peso: 5,
    valor: (p) => (p.fazForcaHoje ? 1 : 0),
    detalhe: (p) => (p.fazForcaHoje ? 'ja faz musculacao' : 'ainda sem musculacao'),
  },
]

export function avaliarNivel(p: Profile): ResultadoNivel {
  let score = 0
  const racional: string[] = []
  for (const f of FATORES) {
    const pontos = f.valor(p) * f.peso
    score += pontos
    racional.push(`${f.rotulo}: ${pontos.toFixed(1)}/${f.peso} — ${f.detalhe(p)}`)
  }

  const arredondado = Math.round(score)
  let level: Level = 'iniciante'
  if (arredondado >= 75) level = 'competitivo'
  else if (arredondado >= 50) level = 'avancado'
  else if (arredondado >= 25) level = 'intermediario'

  racional.push(`Score final ${arredondado}/100 — nivel ${level}.`)
  return { level, score: arredondado, racional }
}
