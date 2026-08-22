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
      { rotulo: 'Bloco de forca', minutos: Math.max(10, minutos - 18), zonaId: 'Z3', observacao: metodo.descricao },
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

/**
 * Escolhe os dias da semana, espalhados o mais uniformemente possivel.
 * Uma sessao por dia: o numero de dias e sempre igual ao de sessoes.
 */
export function espalharDias(quantidade: number): number[] {
  const n = Math.max(1, Math.min(7, quantidade))
  if (n === 1) return [7] // sessao unica cai no fim de semana
  if (n === 7) return [1, 2, 3, 4, 5, 6, 7]
  const dias: number[] = []
  for (let i = 0; i < n; i++) dias.push(Math.round(1 + (i * 6) / (n - 1)))
  for (let i = 1; i < dias.length; i++) {
    if (dias[i] <= dias[i - 1]) dias[i] = dias[i - 1] + 1
  }
  return dias.map((d) => Math.min(7, d))
}

/** Alterna sessao dura e sessao leve, para nao empilhar dois dias pesados. */
function intercalar<T>(duras: T[], leves: T[]): T[] {
  const saida: T[] = []
  while (duras.length || leves.length) {
    if (duras.length) saida.push(duras.shift()!)
    if (leves.length) saida.push(leves.shift()!)
  }
  return saida
}

/** Minutos que cabem no dia: fim de semana costuma ter mais folga. */
function tetoDoDia(p: Profile, dia: number): number {
  return dia >= 6 ? p.minutosFimDeSemana : p.minutosDiaUtil
}

type Vaga =
  | { tipo: 'bike'; modelo: string; peso: number }
  | { tipo: 'forca' }
  | { tipo: 'mobilidade' }

/**
 * Monta a composicao da semana respeitando o numero de dias disponiveis.
 *
 * A ordem de prioridade vem do livro: o pedal longo e inegociavel, depois a
 * intensidade da fase, e so entao a forca — musculacao nunca pode empurrar o
 * cardio para fora da semana.
 */
function comporSemana(p: Profile, a: Assessment, r: Restricoes, fase: WeekPhase): Vaga[] {
  const vagas = Math.max(1, Math.min(p.diasDisponiveis, 7))
  const composicao: Vaga[] = []

  const duras: Vaga[] = []
  const leves: Vaga[] = []

  const nIntensas = sessoesIntensas(fase, a.level)
  for (let k = 0; k < nIntensas; k++) {
    let modelo = 'bike_limiar'
    if (fase === 'pico' && k === 1) modelo = 'bike_sprint'
    else if (fase === 'especifico' && k === 1) modelo = 'bike_vo2'
    else if (fase === 'base') modelo = 'bike_tempo'
    duras.push({ tipo: 'bike', modelo, peso: 1 })
  }
  for (let k = 0; k < sessoesDeForca(p, fase); k++) duras.push({ tipo: 'forca' })

  if (MODALIDADES_TECNICAS.includes(p.modalidade) && fase !== 'recuperacao') {
    leves.push({ tipo: 'bike', modelo: 'bike_tecnica', peso: 0.8 })
  }
  const querMobilidade =
    r.enfaseExtra.includes('mobilidade') || fase === 'recuperacao' || p.diasDisponiveis >= 5
  if (querMobilidade) leves.push({ tipo: 'mobilidade' })

  // o longo abre a fila para nunca ser cortado, mas e alocado no ultimo dia
  const longo: Vaga = {
    tipo: 'bike',
    modelo: fase === 'recuperacao' ? 'bike_base' : 'bike_longo',
    peso: 2.2,
  }

  for (const vaga of intercalar(duras, leves)) {
    if (composicao.length >= vagas - 1) break
    composicao.push(vaga)
  }
  while (composicao.length < vagas - 1) {
    composicao.push({ tipo: 'bike', modelo: fase === 'recuperacao' ? 'bike_recuperacao' : 'bike_base', peso: 1 })
  }
  composicao.push(longo)
  return composicao
}

/** Duracao minima que uma vaga aceita. */
function minimoDaVaga(vaga: Vaga, minutosForca: number): number {
  if (vaga.tipo === 'forca') return minutosForca
  if (vaga.tipo === 'mobilidade') return 20
  return MODELOS[vaga.modelo].minimoMinutos
}

/**
 * Corta sessoes ate a semana caber no volume alvo.
 *
 * Sem isso, uma semana de recuperacao com muitos dias disponiveis somaria os
 * minimos de todas as sessoes e passaria longe do alvo — que e exatamente a
 * reducao de carga que a fase (ou a anamnese) pediu. Corta pelo fim, que e
 * onde estao as sessoes de preenchimento; o pedal longo e o ultimo a sair.
 */
function encolherAteCaber(vagas: Vaga[], minutosAlvo: number, minutosForca: number): Vaga[] {
  const soma = (lista: Vaga[]) => lista.reduce((t, v) => t + minimoDaVaga(v, minutosForca), 0)
  const saida = [...vagas]
  while (saida.length > 1 && soma(saida) > minutosAlvo) saida.splice(saida.length - 2, 1)

  // sobrou so o pedal longo e ainda nao cabe: troca por uma sessao mais curta
  if (saida.length === 1 && soma(saida) > minutosAlvo) {
    const unica = saida[0]
    if (unica.tipo === 'bike') {
      const alternativa = minutosAlvo >= MODELOS.bike_base.minimoMinutos ? 'bike_base' : 'bike_recuperacao'
      saida[0] = { tipo: 'bike', modelo: alternativa, peso: unica.peso }
    }
  }
  return saida
}

/**
 * Reparte os minutos da semana entre as sessoes.
 *
 * O alvo e fechar em horasAlvo: forca e mobilidade tem duracao fixa, e o que
 * sobra vai para a bike proporcionalmente ao peso de cada sessao, sempre
 * respeitando o minimo do modelo e o tempo que cabe naquele dia.
 */
function repartirMinutos(
  p: Profile,
  vagas: Vaga[],
  dias: number[],
  minutosAlvo: number,
  minutosForca: number,
): number[] {
  const minutos = vagas.map((v) => (v.tipo === 'forca' ? minutosForca : v.tipo === 'mobilidade' ? 20 : 0))
  const fixos = minutos.reduce((s, m) => s + m, 0)

  const indicesBike = vagas.map((v, i) => (v.tipo === 'bike' ? i : -1)).filter((i) => i >= 0)
  if (!indicesBike.length) return minutos

  const pesoTotal = indicesBike.reduce((s, i) => s + (vagas[i] as { peso: number }).peso, 0)
  let restante = Math.max(0, minutosAlvo - fixos)

  // primeira passada: proporcional ao peso, dentro dos limites de cada sessao
  const limites = indicesBike.map((i) => ({
    i,
    minimo: MODELOS[(vagas[i] as { modelo: string }).modelo].minimoMinutos,
    maximo: tetoDoDia(p, dias[i]),
  }))
  for (const { i, minimo, maximo } of limites) {
    const peso = (vagas[i] as { peso: number }).peso
    const bruto = Math.round((restante * peso) / pesoTotal)
    minutos[i] = Math.min(Math.max(bruto, minimo), Math.max(minimo, maximo))
  }

  // segunda passada: devolve a sobra (ou desconta o excesso) nas sessoes que
  // ainda tem folga, para o total nao passar longe do alvo
  const total = () => minutos.reduce((s, m) => s + m, 0)
  for (let volta = 0; volta < 3 && Math.abs(total() - minutosAlvo) > 2; volta++) {
    const diferenca = minutosAlvo - total()
    const ajustaveis = limites.filter(({ i, minimo, maximo }) =>
      diferenca > 0 ? minutos[i] < maximo : minutos[i] > minimo,
    )
    if (!ajustaveis.length) break
    const porSessao = Math.round(diferenca / ajustaveis.length)
    if (porSessao === 0) break
    for (const { i, minimo, maximo } of ajustaveis) {
      minutos[i] = Math.min(Math.max(minutos[i] + porSessao, minimo), Math.max(minimo, maximo))
    }
  }
  return minutos
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

    const minutosForca = Math.min(Math.max(p.minutosDiaUtil || 45, 30), 75)
    const vagas = encolherAteCaber(comporSemana(p, a, r, fase), minutosTotais, minutosForca)
    const dias = espalharDias(vagas.length)
    const minutos = repartirMinutos(p, vagas, dias, minutosTotais, minutosForca)

    const sessoes: Session[] = []
    let indiceForca = 0
    vagas.forEach((vaga, k) => {
      const dia = dias[k]
      if (vaga.tipo === 'forca') {
        sessoes.push(sessaoForca(p, a, r, fase, bloco, indiceForca++, minutos[k], dia, i + 1))
      } else if (vaga.tipo === 'mobilidade') {
        sessoes.push(sessaoMobilidade(dia, i + 1, minutos[k]))
      } else {
        sessoes.push(sessaoBike(vaga.modelo, p, a, r, minutos[k], dia, i + 1, k))
      }
    })

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
