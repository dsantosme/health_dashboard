import type { IntervalBlock, Modality, SessionKind } from '../types'

/**
 * Modelos de sessao de bike.
 *
 * Cada modelo recebe a duracao disponivel e devolve os blocos (aquecimento,
 * series, intervalos e volta a calma) que somam essa duracao.
 */

export interface ModeloSessao {
  kind: SessionKind
  titulo: string
  objetivo: string
  zonaPrincipal: string | null
  /** Duracao minima para a sessao fazer sentido. */
  minimoMinutos: number
  blocos: (minutos: number, modalidade: Modality) => IntervalBlock[]
  dicas: (modalidade: Modality) => string[]
}

const aquecimento = (min: number): IntervalBlock => ({
  rotulo: 'Aquecimento',
  minutos: min,
  zonaId: 'Z2',
  cadencia: '85-95 rpm',
  observacao: 'Suba o esforco aos poucos. Os ultimos 3 minutos ja em Z2 alta.',
})

const voltaCalma = (min: number): IntervalBlock => ({
  rotulo: 'Volta a calma',
  minutos: min,
  zonaId: 'Z1',
  cadencia: '85-95 rpm',
  observacao: 'Giro leve. Termine com a sequencia de mobilidade da cadeia posterior.',
})

const DICAS_MODALIDADE: Record<Modality, string[]> = {
  urbano: ['Escolha rota com o minimo de semaforo para nao picotar o esforco.', 'Mochila pesada muda a distribuicao de peso: prefira alforge quando puder.'],
  mtb: ['Fora da pedalada, mantenha os pedais paralelos ao solo, principalmente nas curvas.', 'Em descida, baixe os calcanhares para nao ser projetado por cima do guidao.'],
  emtb: ['Use o modo de menor assistencia possivel para o estimulo ser seu, nao do motor.', 'O peso extra da bike exige mais do freio: antecipe a frenagem.'],
  gravel: ['Calibre pensando no trecho mais solto do percurso, nao no asfalto do comeco.', 'Cascalho pede maos leves no guidao — o peso vai nos pes.'],
  road: ['Revese a posicao das maos (topo, manete, drop) para nao travar ombro e pescoco.', 'No grupo, mantenha o giro constante em vez de acelerar e frear.'],
  triathlon: ['Se o objetivo e prova, treine na posicao que voce vai usar na prova.', 'Transicao: os ultimos 10 minutos em cadencia mais alta poupam a perna para a corrida.'],
}

export const MODELOS: Record<string, ModeloSessao> = {
  bike_recuperacao: {
    kind: 'bike_recuperacao',
    titulo: 'Giro regenerativo',
    objetivo: 'Acelerar a recuperacao sem gerar carga nova.',
    zonaPrincipal: 'Z1',
    minimoMinutos: 20,
    blocos: (min) => [
      { rotulo: 'Giro leve', minutos: min, zonaId: 'Z1', cadencia: '90-100 rpm', observacao: 'Se bater vontade de forcar, essa e a hora de nao forcar.' },
    ],
    dicas: () => ['Terreno plano. Se a perna estiver pesada demais, troque por descanso completo.'],
  },
  bike_base: {
    kind: 'bike_base',
    titulo: 'Base aerobica',
    objetivo: 'Construir a base que sustenta todo o resto do plano.',
    zonaPrincipal: 'Z2',
    minimoMinutos: 40,
    blocos: (min) => [
      aquecimento(10),
      { rotulo: 'Bloco continuo em Z2', minutos: min - 15, zonaId: 'Z2', cadencia: '85-95 rpm', observacao: 'Voce tem que conseguir conversar em frases completas o tempo todo.' },
      voltaCalma(5),
    ],
    dicas: (m) => DICAS_MODALIDADE[m],
  },
  bike_longo: {
    kind: 'bike_longo',
    titulo: 'Pedal longo',
    objetivo: 'Resistencia e economia de energia em duracao.',
    zonaPrincipal: 'Z2',
    minimoMinutos: 75,
    blocos: (min) => {
      const corpo = min - 22
      const firme = Math.round(corpo * 0.25)
      return [
        aquecimento(12),
        { rotulo: 'Bloco longo em Z2', minutos: corpo - firme, zonaId: 'Z2', cadencia: '85-95 rpm', observacao: 'Coma a cada 45 minutos, mesmo sem fome.' },
        { rotulo: 'Trechos em Z3', minutos: firme, zonaId: 'Z3', repeticoes: 3, cadencia: '80-90 rpm', observacao: 'Tres trechos firmes, distribuidos na segunda metade do pedal.' },
        voltaCalma(10),
      ]
    },
    dicas: (m) => ['Teste no treino longo a comida e a bebida que voce pretende usar na prova.', ...DICAS_MODALIDADE[m]],
  },
  bike_tempo: {
    kind: 'bike_tempo',
    titulo: 'Ritmo (tempo)',
    objetivo: 'Sustentar ritmo forte sem estourar — o esforco de subida longa.',
    zonaPrincipal: 'Z3',
    minimoMinutos: 45,
    blocos: (min) => {
      const trabalho = min - 12 - 5 - 8
      return [
        aquecimento(12),
        { rotulo: `2 x ${Math.round(trabalho / 2)} min de tempo`, minutos: trabalho, zonaId: 'Z3', repeticoes: 2, cadencia: '80-90 rpm', observacao: 'Divida em dois blocos iguais com 5 minutos de Z1 entre eles.' },
        { rotulo: 'Intervalo entre blocos', minutos: 5, zonaId: 'Z1' },
        voltaCalma(8),
      ]
    },
    dicas: (m) => DICAS_MODALIDADE[m],
  },
  bike_limiar: {
    kind: 'bike_limiar',
    titulo: 'Limiar',
    objetivo: 'Empurrar a fronteira entre o que voce sustenta e o que te quebra.',
    zonaPrincipal: 'Z4',
    minimoMinutos: 50,
    blocos: (min) => {
      // 15 de aquecimento + 10 de volta a calma sao fixos; o resto e trabalho
      // mais as recuperacoes entre series, e a conta tem que fechar em `min`.
      const disponivel = min - 25
      const series = disponivel >= 34 ? 3 : 2
      const recuperacao = (series - 1) * 5
      const trabalho = disponivel - recuperacao
      return [
        aquecimento(15),
        { rotulo: `${series} x ${Math.round(trabalho / series)} min em Z4`, minutos: trabalho, zonaId: 'Z4', repeticoes: series, cadencia: '85-95 rpm', observacao: 'Esforco constante: nada de comecar rapido e morrer no fim da serie.' },
        { rotulo: 'Recuperacao entre series', minutos: recuperacao, zonaId: 'Z1', observacao: '5 minutos de giro leve entre as series.' },
        voltaCalma(10),
      ]
    },
    dicas: (m) => ['Se nao conseguir manter a potencia ou a FC na ultima serie, encerre — a sessao ja rendeu.', ...DICAS_MODALIDADE[m]],
  },
  bike_vo2: {
    kind: 'bike_vo2',
    titulo: 'VO2 maximo',
    objetivo: 'Aumentar o teto aerobico com intervalos curtos e duros.',
    zonaPrincipal: 'Z5',
    minimoMinutos: 47,
    blocos: (min) => [
      aquecimento(15),
      { rotulo: '5 x 3 min em Z5', minutos: 15, zonaId: 'Z5', repeticoes: 5, cadencia: '95-105 rpm', observacao: 'Cada tiro comeca ja no esforco alvo, sem construir devagar.' },
      { rotulo: 'Recuperacao 3 min entre tiros', minutos: 12, zonaId: 'Z1' },
      voltaCalma(min - 42),
    ],
    dicas: (m) => ['Nao faca esta sessao com sono ruim ou perna pesada: o ganho depende da qualidade dos tiros.', ...DICAS_MODALIDADE[m]],
  },
  bike_sprint: {
    kind: 'bike_sprint',
    titulo: 'Sprint e potencia',
    objetivo: 'Potencia neuromuscular — o arranque e o ataque.',
    zonaPrincipal: 'Z6',
    minimoMinutos: 43,
    blocos: (min) => [
      aquecimento(15),
      { rotulo: '8 x 15 segundos maximo', minutos: 2, zonaId: 'Z6', repeticoes: 8, cadencia: 'maxima', observacao: 'Levante do selim, segure firme na empunhadura e contenha o balanco lateral da bike com os bracos.' },
      { rotulo: 'Recuperacao 3 min entre sprints', minutos: 21, zonaId: 'Z1', observacao: 'Recuperacao completa mesmo — aqui o descanso e parte do estimulo.' },
      voltaCalma(min - 38),
    ],
    dicas: (m) => ['Imagine a linha de chegada: sprint e tanto cabeca quanto perna.', ...DICAS_MODALIDADE[m]],
  },
  bike_tecnica: {
    kind: 'bike_tecnica',
    titulo: 'Tecnica e pedalada',
    objetivo: 'Postura de ataque, ponto neutro e pedalada circular.',
    zonaPrincipal: 'Z2',
    minimoMinutos: 40,
    blocos: (min) => [
      aquecimento(10),
      { rotulo: 'Educativo de pedalada unilateral', minutos: 10, zonaId: 'Z2', repeticoes: 4, cadencia: '70-80 rpm', observacao: 'Marcha leve. Alterne as pernas a cada 1 minuto.' },
      { rotulo: 'Postura de ataque em velocidade baixa', minutos: 10, zonaId: 'Z2', observacao: 'Procure o ponto neutro: ao soltar as maos, o tronco nao cai para a frente nem para tras.' },
      { rotulo: 'Giro solto', minutos: min - 35, zonaId: 'Z2', cadencia: '95-105 rpm' },
      voltaCalma(5),
    ],
    dicas: (m) => ['Reduza a velocidade para assimilar a postura antes de acelerar.', ...DICAS_MODALIDADE[m]],
  },
}

/** Modalidades que ganham uma sessao de tecnica por semana no plano. */
export const MODALIDADES_TECNICAS: Modality[] = ['mtb', 'emtb', 'gravel']
