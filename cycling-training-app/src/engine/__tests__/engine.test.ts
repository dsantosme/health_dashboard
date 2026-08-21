import { describe, expect, it } from 'vitest'
import { PERFIL_VAZIO } from '../../data/questions'
import { EXERCICIOS, exercicio } from '../../data/exercises'
import { SEQUENCIA_MOBILIDADE } from '../../data/mtb'
import { HORIZON_WEEKS, type Profile } from '../../types'
import { avaliar } from '../assessment'
import { calcularRestricoes } from '../constraints'
import { avaliarNivel } from '../level'
import { gerarPlano, montarFases } from '../plan'
import { calcularZonas, fcMaxEstimada } from '../zones'

const perfil = (over: Partial<Profile> = {}): Profile => ({ ...PERFIL_VAZIO, nome: 'Teste', ...over })

describe('nivel', () => {
  it('poe iniciante e competitivo nas pontas certas', () => {
    const novato = avaliarNivel(
      perfil({
        horasSemanaAtual: 0,
        kmSemanaAtual: 0,
        maiorPedalRecenteKm: 0,
        anosCiclismo: 0,
        outrosEsportesAnos: 0,
        autoavaliacaoCondicionamento: 1,
        treinoEstruturadoAntes: false,
        competiuAntes: false,
        fazForcaHoje: false,
      }),
    )
    expect(novato.level).toBe('iniciante')
    expect(novato.score).toBe(0)

    const forte = avaliarNivel(
      perfil({
        horasSemanaAtual: 14,
        kmSemanaAtual: 350,
        maiorPedalRecenteKm: 180,
        anosCiclismo: 12,
        outrosEsportesAnos: 12,
        autoavaliacaoCondicionamento: 5,
        treinoEstruturadoAntes: true,
        competiuAntes: true,
        fazForcaHoje: true,
      }),
    )
    expect(forte.level).toBe('competitivo')
    expect(forte.score).toBe(100)
  })

  it('explica cada ponto do score', () => {
    const r = avaliarNivel(perfil())
    expect(r.racional.length).toBeGreaterThan(5)
    expect(r.racional.at(-1)).toContain('Score final')
  })
})

describe('zonas', () => {
  it('usa Tanaka quando nao ha FC maxima medida', () => {
    expect(fcMaxEstimada(40)).toBe(180)
  })

  it('usa Karvonen quando ha FC de repouso', () => {
    const semRepouso = calcularZonas({ fcMax: 180, fcRepouso: null, ftp: 200 })
    const comRepouso = calcularZonas({ fcMax: 180, fcRepouso: 50, ftp: 200 })
    expect(semRepouso[1].fcBpm).toEqual([108, 135])
    expect(comRepouso[1].fcBpm).toEqual([122, 141])
  })

  it('mantem as zonas em ordem crescente', () => {
    const z = calcularZonas({ fcMax: 185, fcRepouso: 55, ftp: 240 })
    for (let i = 1; i < z.length; i++) {
      expect(z[i].fcBpm![0]).toBeGreaterThanOrEqual(z[i - 1].fcBpm![0])
      expect(z[i].watts![0]).toBeGreaterThanOrEqual(z[i - 1].watts![0])
    }
  })
})

describe('restricoes da anamnese', () => {
  it('limita intensidade e bloqueia exercicio com condicao cardiaca', () => {
    const r = calcularRestricoes(perfil({ flagsSaude: ['cardiaco'], liberacaoMedica: true }))
    expect(r.tetoZona).toBe('Z3')
    expect(r.metodosProibidos).toContain('forca_max')
  })

  it('dor lombar tira carga axial e adiciona enfase de core', () => {
    const r = calcularRestricoes(perfil({ flagsSaude: ['lombar'], liberacaoMedica: true }))
    expect(r.bloqueados.has('levantamento_terra_romeno')).toBe(true)
    expect(r.bloqueados.has('agachamento')).toBe(true)
    expect(r.enfaseExtra).toContain('core')
  })

  it('avisa quando falta liberacao medica depois dos 45', () => {
    const r = calcularRestricoes(perfil({ idade: 52, liberacaoMedica: false }))
    expect(r.alertas.join(' ')).toContain('liberacao medica')
    expect(r.tetoZona).toBe('Z4')
  })
})

describe('periodizacao', () => {
  it('poe recuperacao a cada quatro semanas e taper no fim', () => {
    const fases = montarFases(12)
    expect(fases).toHaveLength(12)
    expect(fases[3]).toBe('recuperacao')
    expect(fases[7]).toBe('recuperacao')
    expect(fases.at(-1)).toBe('taper')
  })

  it('em 4 semanas fecha com recuperacao', () => {
    expect(montarFases(4).at(-1)).toBe('recuperacao')
  })
})

describe('plano gerado', () => {
  const p = perfil({ horizonte: 'medio', diasDisponiveis: 5, acessos: ['rua', 'academia'] })
  const { assessment, restricoes } = avaliar(p)
  const plano = gerarPlano(p, assessment, restricoes)

  it('tem o numero de semanas do horizonte', () => {
    expect(plano.semanas).toHaveLength(HORIZON_WEEKS.medio)
  })

  it('nunca passa de 3 sessoes de forca por semana', () => {
    for (const s of plano.semanas) {
      expect(s.sessoes.filter((x) => x.kind === 'forca').length).toBeLessThanOrEqual(3)
    }
  })

  it('toda sessao de forca cobre mais de uma regiao do corpo', () => {
    for (const semana of plano.semanas) {
      for (const s of semana.sessoes.filter((x) => x.kind === 'forca')) {
        const grupos = new Set(s.forca.map((f) => exercicio(f.exercicioId)?.grupo))
        expect(grupos.size).toBeGreaterThan(1)
      }
    }
  })

  it('respeita o teto de intensidade da anamnese', () => {
    const comCardiaco = perfil({ flagsSaude: ['cardiaco'], liberacaoMedica: true })
    const a = avaliar(comCardiaco)
    const plan = gerarPlano(comCardiaco, a.assessment, a.restricoes)
    const zonas = plan.semanas.flatMap((s) => s.sessoes.flatMap((x) => x.blocos.map((b) => b.zonaId)))
    expect(zonas.every((z) => ['Z1', 'Z2', 'Z3'].includes(z))).toBe(true)
  })

  it('reduz o volume na semana de recuperacao', () => {
    const carga = plano.semanas.find((s) => s.fase === 'recuperacao')!
    const anterior = plano.semanas[carga.numero - 2]
    expect(carga.horasAlvo).toBeLessThan(anterior.horasAlvo)
  })

  it('todas as sessoes tem dia valido e duracao positiva', () => {
    for (const s of plano.semanas.flatMap((x) => x.sessoes)) {
      expect(s.dia).toBeGreaterThanOrEqual(1)
      expect(s.dia).toBeLessThanOrEqual(7)
      expect(s.minutos).toBeGreaterThan(0)
    }
  })

  it('sem academia, nao prescreve sessao de forca', () => {
    const semGym = perfil({ acessos: ['rua'] })
    const a = avaliar(semGym)
    const plan = gerarPlano(semGym, a.assessment, a.restricoes)
    expect(plan.semanas.flatMap((s) => s.sessoes).some((s) => s.kind === 'forca')).toBe(false)
  })
})

describe('biblioteca', () => {
  it('nao tem id repetido', () => {
    const ids = EXERCICIOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todo exercicio tem passo, ilustracao e enfoque no ciclismo', () => {
    for (const e of EXERCICIOS) {
      expect(e.passos.length).toBeGreaterThan(0)
      expect(e.enfoqueNoCiclismo.length).toBeGreaterThan(30)
      for (const p of e.passos) expect(p.texto.length).toBeGreaterThan(10)
    }
  })

  it('todo substituto aponta para exercicio existente', () => {
    for (const e of EXERCICIOS) {
      if (e.substituto) expect(exercicio(e.substituto)).toBeDefined()
    }
  })

  it('a sequencia de mobilidade existe inteira na biblioteca', () => {
    for (const id of SEQUENCIA_MOBILIDADE) expect(exercicio(id)).toBeDefined()
  })
})
