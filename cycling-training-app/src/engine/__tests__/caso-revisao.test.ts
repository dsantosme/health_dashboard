import { describe, expect, it } from 'vitest'
import { PERFIL_VAZIO } from '../../data/questions'
import { avaliar } from '../assessment'
import { gerarPlano } from '../plan'

/**
 * Caso concreto que a revisao do PR pegou: a anamnese reduzia o volume alvo
 * (condicao cardiaca + sono curto), mas o gerador agendava 42% a mais do que
 * o alvo — anulando na pratica a reducao que ela tinha acabado de aplicar.
 */
describe('volume respeita a reducao da anamnese', () => {
  it('perfil cardiaco com sono ruim fecha no alvo', () => {
    const p = { ...PERFIL_VAZIO, nome: 'T', flagsSaude: ['cardiaco'] as never, horasSono: 5, liberacaoMedica: true }
    const { assessment, restricoes } = avaliar(p)
    const plano = gerarPlano(p, assessment, restricoes)
    for (const s of plano.semanas) {
      const total = s.sessoes.reduce((t, x) => t + x.minutos, 0)
      const alvo = s.horasAlvo * 60
      expect(total).toBeLessThanOrEqual(alvo * 1.1 + 15)
    }
  })
})
