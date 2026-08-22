import { describe, expect, it } from 'vitest'
import { PERFIL_VAZIO } from '../../data/questions'
import { avaliar } from '../../engine/assessment'
import { espalharDias, gerarPlano } from '../../engine/plan'
import type { Horizon, Profile } from '../../types'

const perfis: Partial<Profile>[] = []
for (const dias of [1, 2, 3, 4, 5, 6, 7])
  for (const min of [30, 60, 120])
    for (const horizonte of ['curto', 'medio'] as Horizon[])
      for (const flags of [[], ['cardiaco'], ['lombar', 'joelho']] as Profile['flagsSaude'][])
        perfis.push({ dias, minutosDiaUtil: min, minutosFimDeSemana: min * 2, horizonte, flagsSaude: flags } as never)

/**
 * Varredura de invariantes: gera o plano para 126 combinacoes de dias
 * disponiveis, tempo por sessao, horizonte e anamnese, e confere as
 * propriedades que precisam valer em todas elas. Foi o que pegou o volume
 * estourando o alvo e as sessoes empilhadas no mesmo dia.
 */
describe('invariantes do plano', () => {
  it('vale para todas as combinacoes de perfil', () => {
    const problemas: string[] = []
    for (const over of perfis) {
      const o = over as never as { dias: number } & Partial<Profile>
      const p: Profile = { ...PERFIL_VAZIO, ...o, diasDisponiveis: o.dias, nome: 'T' }
      const { assessment, restricoes } = avaliar(p)
      const plano = gerarPlano(p, assessment, restricoes)
      for (const semana of plano.semanas) {
        const dias = semana.sessoes.map((s) => s.dia)
        if (new Set(dias).size !== dias.length) problemas.push(`dia repetido: ${p.diasDisponiveis}d s${semana.numero}`)
        if (dias.length > p.diasDisponiveis) problemas.push(`sessoes demais: ${dias.length} > ${p.diasDisponiveis}`)
        const total = semana.sessoes.reduce((s, x) => s + x.minutos, 0)
        const alvo = semana.horasAlvo * 60
        if (total > alvo * 1.15 + 20) problemas.push(`volume estourado: ${total} vs alvo ${alvo} (${p.diasDisponiveis}d ${p.minutosDiaUtil}min)`)
        for (const s of semana.sessoes) {
          if (s.minutos <= 0) problemas.push(`duracao <= 0: ${s.titulo}`)
          const soma = s.blocos.reduce((t, b) => t + b.minutos, 0)
          if (s.blocos.length && soma !== s.minutos) problemas.push(`blocos ${soma} != sessao ${s.minutos} em ${s.titulo}`)
          if (s.blocos.some((b) => b.minutos < 0)) problemas.push(`bloco negativo em ${s.titulo}`)
          const teto = s.dia >= 6 ? p.minutosFimDeSemana : p.minutosDiaUtil
          if (s.minutos > Math.max(teto, 75) + 1) problemas.push(`sessao ${s.minutos} min nao cabe no dia (teto ${teto}) — ${s.titulo}`)
        }
      }
    }
    if (problemas.length) console.log([...new Set(problemas)].slice(0, 25).join('\n'))
    expect(problemas).toEqual([])
  })
})

describe('espalharDias', () => {
  it('devolve dias unicos, em ordem e dentro da semana', () => {
    for (let n = 1; n <= 7; n++) {
      const dias = espalharDias(n)
      expect(dias).toHaveLength(n)
      expect(new Set(dias).size).toBe(n)
      expect(Math.min(...dias)).toBeGreaterThanOrEqual(1)
      expect(Math.max(...dias)).toBeLessThanOrEqual(7)
      expect([...dias].sort((a, b) => a - b)).toEqual(dias)
    }
  })

  it('poe a sessao unica no fim de semana', () => {
    expect(espalharDias(1)).toEqual([7])
  })
})
