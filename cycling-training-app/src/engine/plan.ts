import { MODELOS, MODALIDADES_TECNICAS } from '../data/bikeWorkouts'
import { EXERCICIOS, exercicio, type Exercicio } from '../data/exercises'
import { METODOS_SERIE, type MetodoSerie } from '../data/livro'
import { SEQUENCIA_MOBILIDADE } from '../data/mtb'
import {
  HORIZON_WEEKS,
  type Assessment,
  type Level,
  type Profile,
  type Session,
  type StrengthSet,
  type TrainingPlan,
  type WeekPhase,
  type WeekPlan,
} from '../types'
import { resolverExercicio, type Restricoes } from './constraints'

/**
 * Gerador de plano.
 *
 * Regras duras que vem do livro e que o gerador nunca quebra:
 *  - no maximo 3 sessoes de forca por semana (o ciclista precisa do cardio);
 *  - toda sessao de forca toca varias regioes do corpo, nao so as pernas;
 *  - o metodo de serie muda a cada bloco de 4 semanas;
 *  - a cada 3 semanas de carga entra 1 semana de recuperacao a ~60%.
 */

const ORDEM_ZONA = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6']

function limitarZona(zona: string, teto: string): string {
  return ORDEM_ZONA.indexOf(zona) > ORDEM_ZONA.indexOf(teto) ? teto : zona
}

/** Distribui as fases ao longo das semanas, com recuperacao a cada 4 e taper no fim. */
export function montarFases(semanas: number): WeekPhase[] {
  const proporcao: [WeekPhase, number][] = [
    ['base', 0.4],
    ['construcao', 0.3],
    ['especifico', 0.2],
    ['pico', 0.1],
  ]
  const fases: WeekPhase[] = []
  for (const [fase, prop] of proporcao) {
    const n = Math.round(semanas * prop)
    for (let i = 0; i < n; i++) fases.push(fase)
  }
  while (fases.length < semanas) fases.push('pico')
  fases.length = semanas

  for (let i = 3; i < semanas; i += 4) fases[i] = 'recuperacao'
  if (semanas >= 8) fases[semanas - 1] = 'taper'
  return fases
}

/** Carga relativa da semana (0-100), desenhavel como grafico de periodizacao. */
function cargaDaSemana(fase: WeekPhase, indice: number, semanas: number): number {
  if (fase === 'recuperacao') return 45
  if (fase === 'taper') return 40
  const base = 55 + (indice / Math.max(1, semanas - 1)) * 35
  const bonus = fase === 'pico' ? 10 : fase === 'especifico' ? 5 : 0
  return Math.min(100, Math.round(base + bonus))
}

function horasDaSemana(a: Assessment, fase: WeekPhase, indice: number, semanas: number): number {
  const progresso = semanas <= 1 ? 1 : indice / (semanas - 1)
  const alvo = a.horasSemanaInicial + (a.horasSemanaMax - a.horasSemanaInicial) * progresso
  const fator = fase === 'recuperacao' ? 0.6 : fase === 'taper' ? 0.55 : 1
  return Number((alvo * fator).toFixed(1))
}

/** Quantas sessoes de forca a semana leva. Nunca mais de 3 — regra do livro. */
function sessoesDeForca(p: Profile, fase: WeekPhase): number {
  if (!p.acessos.includes('academia')) return 0
  if (fase === 'taper') return 1
  if (fase === 'recuperacao') return 1
  if (fase === 'pico') return 1
  if (p.diasDisponiveis >= 5) return 3
  if (p.diasDisponiveis >= 3) return 2
  return 1
}

/** Quantas sessoes de bike intensas a fase pede. */
function sessoesIntensas(fase: WeekPhase, nivel: Level): number {
  if (fase === 'recuperacao') return 0
  if (fase === 'base') return nivel === 'iniciante' ? 0 : 1
  if (fase === 'construcao') return 1
  if (fase === 'especifico') return 2
  if (fase === 'pico') return 2
  return 1 // taper
}

/**
 * Escolhe os exercicios de forca da sessao cobrindo o corpo inteiro.
 * A rotacao por bloco garante estimulo novo a cada 4 semanas.
 */
function selecionarForca(
  p: Profile,
  r: Restricoes,
  bloco: number,
  indiceSessao: number,
  minutos: number,
): Exercicio[] {
  const disponiveis = (grupo: Exercicio['grupo'], padrao?: Exercicio['padrao']) =>
    EXERCICIOS.filter(
      (e) =>
        e.grupo === grupo &&
        (!padrao || e.padrao === padrao) &&
        e.local.includes(p.acessos.includes('academia') ? 'academia' : 'casa'),
    )
      .map((e) => resolverExercicio(e, r))
      .filter((e): e is Exercicio => e !== null)

  const girar = (lista: Exercicio[], deslocamento: number) =>
    lista.length ? lista[(bloco + deslocamento + indiceSessao) % lista.length] : null

  const escolhidos: (Exercicio | null)[] = [
    girar(disponiveis('membros_inferiores', 'joelho'), 0),
    girar(disponiveis('membros_inferiores', 'quadril'), 1),
    girar(disponiveis('core'), 2),
    girar(disponiveis('ombro'), 3),
    girar(disponiveis('membros_superiores'), 4),
  ]

  // Enfase extra vinda da anamnese entra na frente.
  if (r.enfaseExtra.includes('core')) escolhidos.unshift(girar(disponiveis('core'), 5))
  if (r.enfaseExtra.includes('ombro_posterior')) escolhidos.unshift(girar(disponiveis('ombro'), 6))

  // Sessao curta corta do fim; sessao longa ganha panturrilha e dorso.
  const limite = minutos >= 70 ? 7 : minutos >= 50 ? 5 : 4
  if (minutos >= 70) {
    escolhidos.push(girar(disponiveis('dorso'), 7), girar(disponiveis('peitoral'), 8))
  }

  const unicos: Exercicio[] = []
  for (const e of escolhidos) {
    if (e && !unicos.some((x) => x.id === e.id)) unicos.push(e)
    if (unicos.length >= limite) break
  }
  return unicos
}

function metodoDoBloco(bloco: number, fase: WeekPhase, r: Restricoes, nivel: Level): MetodoSerie {
  let candidatos = METODOS_SERIE.filter((m) => !r.metodosProibidos.includes(m.id))
  if (nivel === 'iniciante') candidatos = candidatos.filter((m) => m.id === 'circuito' || m.id === 'resistencia')
  if (fase === 'recuperacao' || fase === 'taper') {
    return candidatos.find((m) => m.id === 'circuito') ?? candidatos[0]
  }
  if (fase === 'pico') {
    return candidatos.find((m) => m.id === 'forca_max') ?? candidatos[candidatos.length - 1]
  }
  return candidatos[bloco % candidatos.length]
}

function sessaoForca(
  p: Profile,
  a: Assessment,
  r: Restricoes,
  fase: WeekPhase,
  bloco: number,
  indiceSessao: number,
  minutos: number,
  dia: number,
  semana: number,
): Session {
  const metodo = metodoDoBloco(bloco, fase, r, a.level)
  const exercicios = selecionarForca(p, r, bloco, indiceSessao, minutos)
  const leve = fase === 'recuperacao' || fase === 'taper'

  const forca: StrengthSet[] = exercicios.map((e) => ({
    exercicioId: e.id,
    series: leve ? Math.max(1, metodo.series - 1) : metodo.series,
    repeticoes: e.duracaoSegundos ? `${e.duracaoSegundos}s por lado` : metodo.repeticoes,
    descansoSegundos: metodo.descansoSegundos,
    cargaSugerida: cargaSugerida(metodo, a.level, leve),
    observacao: e.enfoqueNoCiclismo,
  }))

  return {
    id: `s${semana}-forca-${indiceSessao}`,
    dia,
    kind: 'forca',
    titulo: `Forca ${String.fromCharCode(65 + indiceSessao)} — ${metodo.nome}`,
    objetivo: metodo.quandoUsar,
    minutos,
    zonaPrincipal: null,
    blocos: [
      { rotulo: 'Aquecimento cardio', minutos: 8, zonaId: 'Z2', observacao: 'Remo, eliptico ou bike ergometrica. O autor prefere o remo, que pega o corpo todo.' },
      { rotulo: 'Alongamento', minutos: 5, zonaId: 'Z1', observacao: 'Cada posicao por pelo menos 30 segundos, sem balancar.' },
      { rotulo: 'Bloco de forca', minutos: minutos - 18, zonaId: 'Z3', observacao: metodo.descricao },
      { rotulo: 'Alongamento final', minutos: 5, zonaId: 'Z1', observacao: 'Alongue de novo ao terminar: musculo bem alongado entrega mais potencia.' },
    ],
    forca,
    dicas: [
      'Simule a posicao do ciclista sempre que der: o pe no aparelho como ele encosta no pedal.',
      'Enquanto levanta o peso, imagine-se conduzindo a bike — no agachamento, um sprint; na ultima repeticao, a ultrapassagem.',
      'Nao passe de 3 dias de musculacao na semana: o resto dos dias e para pedalar.',
    ],
  }
}

function cargaSugerida(metodo: MetodoSerie, nivel: Level, leve: boolean): string {
  if (leve) return 'Carga leve: a sessao e de manutencao, nao de estimulo.'
  switch (metodo.id) {
    case 'forca_max':
      return 'Peso que voce levanta no maximo 4 a 8 vezes. Peca acompanhamento nas series pesadas.'
    case 'resistencia':
      return 'Peso que permite completar 15 repeticoes com tecnica limpa nas duas ultimas.'
    case 'piramide':
      return 'Suba o peso a cada serie: 10 reps, depois 8, depois 6.'
    case 'superserie':
      return 'Comece moderado e reduza o peso conforme a fadiga chega, mantendo as repeticoes.'
    default:
      return nivel === 'iniciante'
        ? 'Comece com o peso do corpo ou carga minima. Tecnica antes de carga.'
        : 'Carga moderada, pouco descanso: a frequencia cardiaca fica alta o treino inteiro.'
  }
}

function sessaoMobilidade(dia: number, semana: number, minutos: number): Session {
  return {
    id: `s${semana}-mob`,
    dia,
    kind: 'core_mobilidade',
    titulo: 'Mobilidade da cadeia posterior',
    objetivo: 'Destravar a cadeia posterior para conseguir a postura na bike sem dor.',
    minutos,
    zonaPrincipal: null,
    blocos: [
      {
        rotulo: 'Sequencia completa, do pe a cabeca',
        minutos,
        zonaId: 'Z1',
        observacao: 'A ordem importa: a cadeia esta interligada. 20 segundos por posicao e por lado.',
      },
    ],
    forca: SEQUENCIA_MOBILIDADE.map((id) => ({
      exercicioId: id,
      series: 1,
      repeticoes: `${exercicio(id)?.duracaoSegundos ?? 20}s por lado`,
      descansoSegundos: 10,
      cargaSugerida: 'Sem carga. Respire fundo e relaxe o corpo todo durante a sustentacao.',
    })),
    dicas: ['Se algum movimento gerar dor, pule ele e siga a sequencia.', 'Faca no fim do dia ou depois do treino longo.'],
  }
}

function sessaoBike(
  modeloId: string,
  p: Profile,
  a: Assessment,
  r: Restricoes,
  minutos: number,
  dia: number,
  semana: number,
  indice: number,
): Session {
  const modelo = MODELOS[modeloId]
  const blocos = modelo.blocos(minutos, p.modalidade).map((b) => ({ ...b, zonaId: limitarZona(b.zonaId, r.tetoZona) }))
  const zona = modelo.zonaPrincipal ? limitarZona(modelo.zonaPrincipal, r.tetoZona) : null
  const nomeZona = a.zonas.find((z) => z.id === zona)

  return {
    id: `s${semana}-${modeloId}-${indice}`,
    dia,
    kind: modelo.kind,
    titulo: modelo.titulo,
    objetivo: modelo.objetivo,
    minutos,
    zonaPrincipal: zona,
    blocos,
    forca: [],
    dicas: [...modelo.dicas(p.modalidade), ...(nomeZona ? [`Referencia de ${nomeZona.nome}: ${nomeZona.falaTeste}`] : [])],
  }
}

/** Espalha as sessoes na semana sem colocar dois dias duros seguidos. */
function distribuirDias(quantidade: number): number[] {
  const preferencia = [2, 4, 6, 7, 3, 5, 1]
  return preferencia.slice(0, quantidade).sort((x, y) => x - y)
}

export function gerarPlano(p: Profile, a: Assessment, r: Restricoes): TrainingPlan {
  const semanas = HORIZON_WEEKS[p.horizonte]
  const fases = montarFases(semanas)
  const planoSemanas: WeekPlan[] = []

  for (let i = 0; i < semanas; i++) {
    const fase = fases[i]
    const bloco = Math.floor(i / 4)
    const horas = horasDaSemana(a, fase, i, semanas)
    const minutosTotais = Math.round(horas * 60)

    const nForca = sessoesDeForca(p, fase)
    const nIntensas = sessoesIntensas(fase, a.level)
    const nSessoes = Math.min(p.diasDisponiveis, 7)
    const nBike = Math.max(1, nSessoes - nForca)

    const dias = distribuirDias(nSessoes)
    const sessoes: Session[] = []

    // Orcamento: forca leva a duracao de um dia util; o resto vai para a bike.
    const minutosForca = Math.min(p.minutosDiaUtil, 75)
    const minutosBikeTotal = Math.max(60, minutosTotais - nForca * minutosForca)

    // O pedal longo fica no fim de semana e leva a maior fatia.
    const minutosLongo = Math.min(p.minutosFimDeSemana, Math.round(minutosBikeTotal * (nBike > 1 ? 0.45 : 1)))
    const minutosRestantes = Math.max(0, minutosBikeTotal - minutosLongo)
    const minutosPorSessao = nBike > 1 ? Math.round(minutosRestantes / (nBike - 1)) : 0

    const modelosBike: string[] = []
    for (let k = 0; k < nIntensas && modelosBike.length < nBike - 1; k++) {
      if (fase === 'pico' && k === 1) modelosBike.push('bike_sprint')
      else if (fase === 'especifico' && k === 1) modelosBike.push('bike_vo2')
      else if (fase === 'base') modelosBike.push('bike_tempo')
      else modelosBike.push('bike_limiar')
    }
    if (MODALIDADES_TECNICAS.includes(p.modalidade) && modelosBike.length < nBike - 1) {
      modelosBike.push('bike_tecnica')
    }
    while (modelosBike.length < nBike - 1) {
      modelosBike.push(fase === 'recuperacao' ? 'bike_recuperacao' : 'bike_base')
    }

    let d = 0
    let indiceForca = 0
    for (const modeloId of modelosBike) {
      const min = Math.max(MODELOS[modeloId].minimoMinutos, Math.min(minutosPorSessao, p.minutosDiaUtil))
      sessoes.push(sessaoBike(modeloId, p, a, r, min, dias[d++] ?? 3, i + 1, d))
    }
    for (let k = 0; k < nForca; k++) {
      sessoes.push(sessaoForca(p, a, r, fase, bloco, indiceForca++, minutosForca, dias[d++] ?? 5, i + 1))
    }
    // O longo sempre fecha a semana, no dia mais livre.
    sessoes.push(
      sessaoBike(
        fase === 'recuperacao' ? 'bike_base' : 'bike_longo',
        p,
        a,
        r,
        Math.max(MODELOS[fase === 'recuperacao' ? 'bike_base' : 'bike_longo'].minimoMinutos, minutosLongo),
        dias[dias.length - 1] ?? 7,
        i + 1,
        99,
      ),
    )
    if (r.enfaseExtra.includes('mobilidade') || fase === 'recuperacao' || p.diasDisponiveis >= 5) {
      sessoes.push(sessaoMobilidade(dias[d] ?? 1, i + 1, 20))
    }

    sessoes.sort((x, y) => x.dia - y.dia)

    planoSemanas.push({
      numero: i + 1,
      fase,
      foco: focoDaFase(fase, p.modalidade),
      horasAlvo: horas,
      carga: cargaDaSemana(fase, i, semanas),
      sessoes,
    })
  }

  return {
    criadoEm: new Date().toISOString(),
    horizonte: p.horizonte,
    semanas: planoSemanas,
    resumo: montarResumo(p, a, r, semanas),
  }
}

function focoDaFase(fase: WeekPhase, modalidade: string): string {
  switch (fase) {
    case 'base':
      return 'Volume em Z2 e tecnica. E aqui que se constroi o que sustenta o resto.'
    case 'construcao':
      return 'Entra o limiar. A base vira capacidade de sustentar ritmo.'
    case 'especifico':
      return `Intensidade especifica para ${modalidade}: limiar mais VO2 maximo.`
    case 'pico':
      return 'Menos volume, mais qualidade. Potencia e sprint.'
    case 'recuperacao':
      return 'Volume reduzido a 60%. A adaptacao acontece agora, nao na semana passada.'
    case 'taper':
      return 'Polimento: mantem a intensidade curta, corta o volume. Chegar descansado vale mais que treinar mais.'
  }
}

function montarResumo(p: Profile, a: Assessment, r: Restricoes, semanas: number): string[] {
  const linhas = [
    `Plano de ${semanas} semanas para ${p.modalidade.toUpperCase()}, nivel ${a.level} (score ${a.score}/100).`,
    `Comeca em ${a.horasSemanaInicial} h/semana e chega a ${a.horasSemanaMax} h/semana, com semana de recuperacao a cada 4.`,
    `Zonas calculadas para FC maxima de ${a.fcMax} bpm${a.fcMaxEstimada ? ' (estimada pela idade)' : ''}` +
      (a.ftp ? ` e FTP de ${a.ftp} W${a.ftpEstimado ? ' (estimado)' : ''}, ${a.wattsPorKg} W/kg.` : '.'),
  ]
  if (p.acessos.includes('academia')) {
    linhas.push(
      'Academia entra com no maximo 3 sessoes por semana, sempre de corpo inteiro, com o metodo de serie mudando a cada bloco de 4 semanas.',
    )
  } else {
    linhas.push(
      'Voce nao marcou acesso a academia. Vale reconsiderar: pedalar quase nao gera tensao no osso, e quem so pedala tem mais risco de osteoporose.',
    )
  }
  if (r.tetoZona !== 'Z6') {
    linhas.push(`Por causa da anamnese, a intensidade maxima do plano e ${r.tetoZona}.`)
  }
  return linhas
}
