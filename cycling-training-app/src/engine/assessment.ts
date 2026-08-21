import type { Assessment, Profile } from '../types'
import { calcularRestricoes, type Restricoes } from './constraints'
import { avaliarNivel } from './level'
import { calcularZonas, fcMaxEstimada, ftpEstimado } from './zones'

/**
 * Junta nivel, zonas e restricoes de saude em uma avaliacao unica —
 * o insumo do gerador de plano.
 */
export function avaliar(p: Profile): { assessment: Assessment; restricoes: Restricoes } {
  const { level, score, racional } = avaliarNivel(p)
  const restricoes = calcularRestricoes(p)

  const fcMax = p.fcMaxConhecida ?? fcMaxEstimada(p.idade)
  const ftp = p.ftpWatts ?? ftpEstimado(level, p.pesoKg)
  const imc = p.pesoKg / Math.pow(p.alturaCm / 100, 2)

  const { horasSemanaInicial, horasSemanaMax } = calcularCapacidade(p, restricoes)

  return {
    assessment: {
      level,
      score,
      fcMax,
      fcMaxEstimada: p.fcMaxConhecida === null,
      ftp,
      ftpEstimado: p.ftpWatts === null,
      wattsPorKg: Number((ftp / p.pesoKg).toFixed(2)),
      imc: Number(imc.toFixed(1)),
      zonas: calcularZonas({ fcMax, fcRepouso: p.fcRepouso, ftp }),
      horasSemanaInicial,
      horasSemanaMax,
      alertas: restricoes.alertas,
      racional,
    },
    restricoes,
  }
}

/**
 * Capacidade semanal real: quanto cabe na agenda, e nao quanto seria ideal.
 * O plano comeca perto do volume atual e cresce ate o teto da agenda.
 */
export function calcularCapacidade(p: Profile, r: Restricoes): { horasSemanaInicial: number; horasSemanaMax: number } {
  const diasFimDeSemana = Math.min(2, p.diasDisponiveis)
  const diasUteis = Math.max(0, p.diasDisponiveis - diasFimDeSemana)
  const capacidade = (diasUteis * p.minutosDiaUtil + diasFimDeSemana * p.minutosFimDeSemana) / 60

  const teto = capacidade * r.fatorVolume
  // Comeca no maior entre "o que voce ja faz + 10%" e 60% do teto, sem passar do teto.
  const inicial = Math.min(teto, Math.max(p.horasSemanaAtual * 1.1, teto * 0.6))

  return {
    horasSemanaInicial: Number(Math.max(1, inicial).toFixed(1)),
    horasSemanaMax: Number(Math.max(1.5, teto).toFixed(1)),
  }
}
