/**
 * Modelo de dominio do Ciclo Coach.
 *
 * O fluxo e: Respostas do questionario -> Profile -> Assessment (nivel + zonas +
 * restricoes) -> TrainingPlan (curto/medio/longo prazo) -> Session -> execucao.
 */

export type Modality = 'urbano' | 'mtb' | 'emtb' | 'gravel' | 'road' | 'triathlon'

export const MODALITY_LABEL: Record<Modality, string> = {
  urbano: 'Urbano / Commuter',
  mtb: 'MTB (Mountain Bike)',
  emtb: 'E-MTB (MTB eletrica)',
  gravel: 'Gravel',
  road: 'Speed / Road',
  triathlon: 'Triathlon',
}

export type Goal =
  | 'saude'
  | 'emagrecimento'
  | 'resistencia'
  | 'performance'
  | 'evento'

export const GOAL_LABEL: Record<Goal, string> = {
  saude: 'Saude e bem-estar',
  emagrecimento: 'Perder peso / composicao corporal',
  resistencia: 'Aguentar pedais mais longos',
  performance: 'Ficar mais rapido / mais forte',
  evento: 'Preparar uma prova ou desafio',
}

/** Horizontes do plano. Cada um tem um numero fixo de semanas no MVP. */
export type Horizon = 'curto' | 'medio' | 'longo'

export const HORIZON_WEEKS: Record<Horizon, number> = {
  curto: 4,
  medio: 12,
  longo: 24,
}

export const HORIZON_LABEL: Record<Horizon, string> = {
  curto: 'Curto prazo (4 semanas)',
  medio: 'Medio prazo (12 semanas)',
  longo: 'Longo prazo (24 semanas)',
}

export type Level = 'iniciante' | 'intermediario' | 'avancado' | 'competitivo'

export const LEVEL_LABEL: Record<Level, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediario',
  avancado: 'Avancado',
  competitivo: 'Competitivo',
}

/**
 * Bandeiras de saude vindas da anamnese. Sao usadas para (a) filtrar exercicios
 * contraindicados e (b) limitar intensidade/volume do plano.
 */
export type HealthFlag =
  | 'joelho'
  | 'lombar'
  | 'ombro_cervical'
  | 'punho_mao'
  | 'quadril'
  | 'tendinopatia_aquiles'
  | 'hipertensao'
  | 'cardiaco'
  | 'diabetes'
  | 'asma'
  | 'cirurgia_recente'
  | 'sobrepeso'
  | 'gestante'

export const HEALTH_FLAG_LABEL: Record<HealthFlag, string> = {
  joelho: 'Dor / lesao no joelho',
  lombar: 'Dor lombar',
  ombro_cervical: 'Dor no ombro ou cervical',
  punho_mao: 'Dormencia ou dor em punho / mao',
  quadril: 'Dor no quadril ou virilha',
  tendinopatia_aquiles: 'Tendinopatia de aquiles / panturrilha',
  hipertensao: 'Hipertensao',
  cardiaco: 'Condicao cardiaca conhecida',
  diabetes: 'Diabetes',
  asma: 'Asma ou broncoespasmo por exercicio',
  cirurgia_recente: 'Cirurgia nos ultimos 12 meses',
  sobrepeso: 'Sobrepeso / obesidade',
  gestante: 'Gestante ou pos-parto recente',
}

/** Onde o atleta consegue treinar. Define o mix de sessoes do plano. */
export type Access = 'rua' | 'rolo' | 'academia' | 'trilha' | 'piscina' | 'corrida'

export const ACCESS_LABEL: Record<Access, string> = {
  rua: 'Bicicleta na rua',
  rolo: 'Rolo / bike indoor',
  academia: 'Academia (musculacao)',
  trilha: 'Trilha / single track',
  piscina: 'Piscina',
  corrida: 'Corrida',
}

export interface Profile {
  nome: string
  idade: number
  sexo: 'masculino' | 'feminino' | 'outro'
  pesoKg: number
  alturaCm: number

  modalidade: Modality
  modalidadesSecundarias: Modality[]
  objetivo: Goal
  horizonte: Horizon
  eventoAlvo: string

  anosCiclismo: number
  outrosEsportesAnos: number
  treinoEstruturadoAntes: boolean
  competiuAntes: boolean

  horasSemanaAtual: number
  kmSemanaAtual: number
  maiorPedalRecenteKm: number
  fcRepouso: number | null
  fcMaxConhecida: number | null
  ftpWatts: number | null
  fazForcaHoje: boolean
  autoavaliacaoCondicionamento: number // 1 a 5

  flagsSaude: HealthFlag[]
  liberacaoMedica: boolean
  medicacaoContinua: boolean
  observacoesSaude: string

  diasDisponiveis: number // dias por semana
  minutosDiaUtil: number
  minutosFimDeSemana: number
  horasSono: number
  nivelEstresse: number // 1 a 5
  acessos: Access[]
}

export interface Zone {
  id: string
  nome: string
  descricao: string
  /** Percentual da FC maxima (limites inferior e superior). */
  fcPct: [number, number]
  /** Batimentos por minuto calculados para este atleta (Karvonen quando ha FC repouso). */
  fcBpm: [number, number] | null
  /** Percentual do FTP. */
  ftpPct: [number, number]
  /** Watts calculados quando o FTP e conhecido ou estimado. */
  watts: [number, number] | null
  /** Percepcao subjetiva de esforco (escala 1-10). */
  pse: [number, number]
  /** Como conversar/respirar nessa zona — o teste pratico sem equipamento. */
  falaTeste: string
}

export interface Assessment {
  level: Level
  /** 0-100. Score bruto que gerou o nivel — util para mostrar progresso. */
  score: number
  fcMax: number
  fcMaxEstimada: boolean
  ftp: number | null
  ftpEstimado: boolean
  wattsPorKg: number | null
  imc: number
  zonas: Zone[]
  /** Horas por semana com que o plano comeca. */
  horasSemanaInicial: number
  /** Teto de horas por semana no fim do plano. */
  horasSemanaMax: number
  /** Avisos de seguranca disparados pela anamnese. */
  alertas: string[]
  /** Explicacao de como o nivel foi calculado — transparencia para o atleta. */
  racional: string[]
}

/** Tipos de sessao que o motor sabe montar. */
export type SessionKind =
  | 'bike_recuperacao'
  | 'bike_base'
  | 'bike_tempo'
  | 'bike_limiar'
  | 'bike_vo2'
  | 'bike_sprint'
  | 'bike_tecnica'
  | 'bike_longo'
  | 'forca'
  | 'core_mobilidade'
  | 'descanso'
  | 'cross_training'

/** Um bloco dentro de uma sessao de bike (aquecimento, serie, intervalo, volta a calma). */
export interface IntervalBlock {
  rotulo: string
  minutos: number
  zonaId: string
  /** Cadencia alvo em rpm, quando relevante. */
  cadencia?: string
  repeticoes?: number
  observacao?: string
}

/** Uma serie de um exercicio de forca dentro da sessao de academia. */
export interface StrengthSet {
  exercicioId: string
  series: number
  repeticoes: string
  descansoSegundos: number
  cargaSugerida: string
  observacao?: string
}

export interface Session {
  id: string
  dia: number // 1 = segunda ... 7 = domingo
  kind: SessionKind
  titulo: string
  objetivo: string
  minutos: number
  zonaPrincipal: string | null
  blocos: IntervalBlock[]
  forca: StrengthSet[]
  dicas: string[]
}

export type WeekPhase = 'base' | 'construcao' | 'especifico' | 'pico' | 'recuperacao' | 'taper'

export const PHASE_LABEL: Record<WeekPhase, string> = {
  base: 'Base aerobica',
  construcao: 'Construcao',
  especifico: 'Especifico',
  pico: 'Pico',
  recuperacao: 'Recuperacao',
  taper: 'Polimento (taper)',
}

export interface WeekPlan {
  numero: number
  fase: WeekPhase
  foco: string
  horasAlvo: number
  /** Carga relativa da semana (0-100), util para desenhar o grafico de periodizacao. */
  carga: number
  sessoes: Session[]
}

export interface TrainingPlan {
  criadoEm: string
  horizonte: Horizon
  semanas: WeekPlan[]
  resumo: string[]
}

/** Registro do que foi de fato executado. */
export interface SessionLog {
  sessionId: string
  semana: number
  data: string
  concluido: boolean
  pse: number | null
  minutosReais: number | null
  notas: string
  /** Cargas usadas por exercicio de forca, para progredir na proxima vez. */
  cargas: Record<string, string>
}

export interface AppState {
  versao: number
  profile: Profile | null
  assessment: Assessment | null
  plan: TrainingPlan | null
  logs: SessionLog[]
}
