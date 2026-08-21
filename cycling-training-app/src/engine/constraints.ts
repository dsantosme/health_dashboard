import { EXERCICIOS, type Exercicio } from '../data/exercises'
import type { HealthFlag, Profile } from '../types'

/**
 * Traducao da anamnese em restricoes concretas de plano.
 *
 * Cada bandeira de saude vira tres coisas: um alerta legivel, um teto de
 * intensidade e uma regra de substituicao de exercicio.
 */

export interface Restricoes {
  /** Zona maxima que o plano pode prescrever. */
  tetoZona: 'Z3' | 'Z4' | 'Z5' | 'Z6'
  /** Multiplicador aplicado ao volume semanal (1 = sem ajuste). */
  fatorVolume: number
  /** Ids bloqueados por contraindicacao. */
  bloqueados: Set<string>
  alertas: string[]
  /** Temas de bike fit que a anamnese sugere revisar. */
  revisarNoSetup: string[]
  /** Blocos extras que o plano deve incluir (ex.: core para dor lombar). */
  enfaseExtra: ('core' | 'mobilidade' | 'ombro_posterior')[]
  /** Metodos de serie proibidos (ex.: carga maxima com hipertensao). */
  metodosProibidos: string[]
}

const REGRAS: Record<
  HealthFlag,
  {
    alerta: string
    tetoZona?: Restricoes['tetoZona']
    fatorVolume?: number
    revisarNoSetup?: string[]
    enfase?: Restricoes['enfaseExtra']
    metodosProibidos?: string[]
  }
> = {
  joelho: {
    alerta:
      'Dor no joelho: o plano evita amplitude profunda e prioriza carga guiada. Antes de subir carga, confira a altura e o recuo do selim — selim baixo demais aumenta a compressao patelar, e joelho passando do eixo do pedal tambem.',
    revisarNoSetup: ['selim_altura', 'pes_pedal'],
  },
  lombar: {
    alerta:
      'Dor lombar: entra bloco extra de core e saem os exercicios com carga axial. Vale lembrar que dor nas costas no ciclista costuma vir de abdome fraco em relacao ao dorso, e nao do dorso em si.',
    enfase: ['core'],
    revisarNoSetup: ['selim_altura', 'guidom_giro'],
  },
  ombro_cervical: {
    alerta:
      'Dor de ombro ou cervical: prioridade para ombro posterior e manguito rotador, com carga leve. As duas causas mais comuns de dor no pescoco sao treino em excesso e posicao inadequada na bike.',
    enfase: ['ombro_posterior', 'mobilidade'],
    revisarNoSetup: ['guidom_giro', 'manetes'],
  },
  punho_mao: {
    alerta:
      'Dormencia ou dor em punho e mao: sai carga direta de punho e entra revisao do cockpit. Guidao muito girado para a frente comprime a parte externa do punho e o nervo ulnar; muito para tras, comprime a palma e o nervo mediano.',
    revisarNoSetup: ['guidom_giro', 'manetes'],
  },
  quadril: {
    alerta: 'Dor no quadril ou virilha: a sequencia de mobilidade de gluteo entra em todas as semanas.',
    enfase: ['mobilidade'],
    revisarNoSetup: ['selim_altura'],
  },
  tendinopatia_aquiles: {
    alerta:
      'Tendinopatia de aquiles ou panturrilha: sai flexao plantar com carga e entra mobilidade de gastrocnemio e soleo. Taquinho muito avancado sobrecarrega a panturrilha.',
    enfase: ['mobilidade'],
    revisarNoSetup: ['pes_pedal'],
  },
  hipertensao: {
    alerta:
      'Hipertensao: sem series de carga maxima e sem apneia (manobra de Valsalva). Respire soltando o ar na fase de forca.',
    tetoZona: 'Z4',
    metodosProibidos: ['forca_max'],
  },
  cardiaco: {
    alerta:
      'Condicao cardiaca conhecida: o plano fica em intensidade moderada ate voce ter liberacao explicita do seu cardiologista para treino intervalado.',
    tetoZona: 'Z3',
    fatorVolume: 0.85,
    metodosProibidos: ['forca_max', 'superserie'],
  },
  diabetes: {
    alerta:
      'Diabetes: leve carboidrato de rapida absorcao no treino, meca a glicemia antes e depois de sessao longa ou intensa e evite treinar em jejum.',
  },
  asma: {
    alerta:
      'Asma ou broncoespasmo: aquecimento estendido (15 minutos progressivos) antes de qualquer bloco intenso, e broncodilatador de resgate por perto.',
  },
  cirurgia_recente: {
    alerta: 'Cirurgia nos ultimos 12 meses: volume reduzido e progressao mais lenta, com aval do seu cirurgiao.',
    tetoZona: 'Z4',
    fatorVolume: 0.75,
  },
  sobrepeso: {
    alerta:
      'Foco em volume em Z2 e baixo impacto, que e onde o gasto energetico se sustenta sem sobrecarregar articulacao.',
    fatorVolume: 0.9,
  },
  gestante: {
    alerta:
      'Gestacao ou pos-parto recente: intensidade moderada, nada de exercicio deitado de barriga para cima no terceiro trimestre e acompanhamento obstetrico obrigatorio.',
    tetoZona: 'Z3',
    fatorVolume: 0.8,
    metodosProibidos: ['forca_max', 'superserie'],
  },
}

const ORDEM_ZONA: Restricoes['tetoZona'][] = ['Z3', 'Z4', 'Z5', 'Z6']

export function calcularRestricoes(p: Profile): Restricoes {
  const r: Restricoes = {
    tetoZona: 'Z6',
    fatorVolume: 1,
    bloqueados: new Set(),
    alertas: [],
    revisarNoSetup: [],
    enfaseExtra: [],
    metodosProibidos: [],
  }

  for (const flag of p.flagsSaude) {
    const regra = REGRAS[flag]
    if (!regra) continue
    r.alertas.push(regra.alerta)
    if (regra.tetoZona && ORDEM_ZONA.indexOf(regra.tetoZona) < ORDEM_ZONA.indexOf(r.tetoZona)) {
      r.tetoZona = regra.tetoZona
    }
    if (regra.fatorVolume) r.fatorVolume *= regra.fatorVolume
    if (regra.revisarNoSetup) r.revisarNoSetup.push(...regra.revisarNoSetup)
    if (regra.enfase) r.enfaseExtra.push(...regra.enfase)
    if (regra.metodosProibidos) r.metodosProibidos.push(...regra.metodosProibidos)
  }

  for (const e of EXERCICIOS) {
    if (e.contraindicadoSe.some((f) => p.flagsSaude.includes(f))) r.bloqueados.add(e.id)
  }

  if (!p.liberacaoMedica && (p.idade >= 45 || p.flagsSaude.length > 0)) {
    r.alertas.push(
      'Voce nao marcou liberacao medica recente. Antes de subir para os blocos intensos, faca uma avaliacao — vale principalmente pelo que ela descarta.',
    )
    if (ORDEM_ZONA.indexOf('Z4') < ORDEM_ZONA.indexOf(r.tetoZona)) r.tetoZona = 'Z4'
  }

  if (p.horasSono < 6) {
    r.alertas.push('Menos de 6 horas de sono: a adaptacao acontece no descanso. O plano reduz o volume ate o sono melhorar.')
    r.fatorVolume *= 0.9
  }
  if (p.nivelEstresse >= 4) {
    r.alertas.push('Estresse alto: carga reduzida. Estresse de vida e estresse de treino somam no mesmo balde.')
    r.fatorVolume *= 0.9
  }
  if (p.medicacaoContinua) {
    r.alertas.push('Medicacao continua: cheque com quem prescreveu se ela altera frequencia cardiaca — se alterar, use a percepcao de esforco como referencia, nao o relogio.')
  }

  r.revisarNoSetup = [...new Set(r.revisarNoSetup)]
  r.enfaseExtra = [...new Set(r.enfaseExtra)]
  r.metodosProibidos = [...new Set(r.metodosProibidos)]
  return r
}

/** Aplica a restricao a um exercicio: devolve ele mesmo, o substituto, ou nada. */
export function resolverExercicio(e: Exercicio, r: Restricoes): Exercicio | null {
  if (!r.bloqueados.has(e.id)) return e
  if (e.substituto) {
    const alt = EXERCICIOS.find((x) => x.id === e.substituto)
    if (alt && !r.bloqueados.has(alt.id)) return alt
  }
  return null
}
