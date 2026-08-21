import {
  ACCESS_LABEL,
  GOAL_LABEL,
  HEALTH_FLAG_LABEL,
  HORIZON_LABEL,
  MODALITY_LABEL,
  type Profile,
} from '../types'

/**
 * Questionario de anamnese e perfil.
 *
 * E declarativo de proposito: a tela de onboarding so renderiza o que estiver
 * aqui, e o motor de avaliacao le direto do Profile resultante.
 */

export type TipoCampo = 'texto' | 'numero' | 'unica' | 'multipla' | 'escala' | 'sim_nao'

export interface Campo {
  campo: keyof Profile
  rotulo: string
  tipo: TipoCampo
  /** Explicacao curta de por que a pergunta existe — transparencia com o atleta. */
  ajuda?: string
  opcoes?: { valor: string; rotulo: string }[]
  min?: number
  max?: number
  sufixo?: string
  /** Campo que pode ficar em branco (vira null). */
  opcional?: boolean
}

export interface Etapa {
  id: string
  titulo: string
  descricao: string
  campos: Campo[]
}

const opcoes = (mapa: Record<string, string>) =>
  Object.entries(mapa).map(([valor, rotulo]) => ({ valor, rotulo }))

export const ETAPAS: Etapa[] = [
  {
    id: 'perfil',
    titulo: 'Quem e voce',
    descricao: 'O basico para calcular zonas de treino e ajustar a carga.',
    campos: [
      { campo: 'nome', rotulo: 'Nome', tipo: 'texto' },
      { campo: 'idade', rotulo: 'Idade', tipo: 'numero', min: 12, max: 90, sufixo: 'anos', ajuda: 'Entra no calculo da frequencia cardiaca maxima estimada.' },
      {
        campo: 'sexo',
        rotulo: 'Sexo',
        tipo: 'unica',
        opcoes: [
          { valor: 'masculino', rotulo: 'Masculino' },
          { valor: 'feminino', rotulo: 'Feminino' },
          { valor: 'outro', rotulo: 'Prefiro nao informar' },
        ],
      },
      { campo: 'pesoKg', rotulo: 'Peso', tipo: 'numero', min: 35, max: 200, sufixo: 'kg' },
      { campo: 'alturaCm', rotulo: 'Altura', tipo: 'numero', min: 130, max: 220, sufixo: 'cm' },
    ],
  },
  {
    id: 'modalidade',
    titulo: 'Modalidade e objetivo',
    descricao: 'Define o tipo de sessao, o terreno e a duracao do plano.',
    campos: [
      { campo: 'modalidade', rotulo: 'Modalidade principal', tipo: 'unica', opcoes: opcoes(MODALITY_LABEL) },
      { campo: 'modalidadesSecundarias', rotulo: 'Tambem pratico', tipo: 'multipla', opcoes: opcoes(MODALITY_LABEL), opcional: true },
      { campo: 'objetivo', rotulo: 'Objetivo principal', tipo: 'unica', opcoes: opcoes(GOAL_LABEL) },
      { campo: 'horizonte', rotulo: 'Horizonte do plano', tipo: 'unica', opcoes: opcoes(HORIZON_LABEL) },
      { campo: 'eventoAlvo', rotulo: 'Evento ou desafio alvo', tipo: 'texto', opcional: true, ajuda: 'Opcional. Ex.: "Desafio 100 km em novembro".' },
    ],
  },
  {
    id: 'historico',
    titulo: 'Historico de atleta',
    descricao: 'Quanto tempo de estrada voce ja tem — no ciclismo e fora dele.',
    campos: [
      { campo: 'anosCiclismo', rotulo: 'Ha quantos anos pedala', tipo: 'numero', min: 0, max: 60, sufixo: 'anos' },
      { campo: 'outrosEsportesAnos', rotulo: 'Anos de outros esportes', tipo: 'numero', min: 0, max: 60, sufixo: 'anos', ajuda: 'Base atletica de outros esportes conta para o nivel.' },
      { campo: 'treinoEstruturadoAntes', rotulo: 'Ja seguiu plano de treino estruturado?', tipo: 'sim_nao' },
      { campo: 'competiuAntes', rotulo: 'Ja competiu?', tipo: 'sim_nao' },
    ],
  },
  {
    id: 'condicionamento',
    titulo: 'Condicionamento atual',
    descricao: 'De onde o plano parte. Nao tem resposta certa — tem resposta honesta.',
    campos: [
      { campo: 'horasSemanaAtual', rotulo: 'Horas de bike por semana hoje', tipo: 'numero', min: 0, max: 30, sufixo: 'h' },
      { campo: 'kmSemanaAtual', rotulo: 'Km por semana hoje', tipo: 'numero', min: 0, max: 800, sufixo: 'km' },
      { campo: 'maiorPedalRecenteKm', rotulo: 'Maior pedal nos ultimos 2 meses', tipo: 'numero', min: 0, max: 400, sufixo: 'km' },
      { campo: 'fazForcaHoje', rotulo: 'Faz musculacao hoje?', tipo: 'sim_nao' },
      {
        campo: 'autoavaliacaoCondicionamento',
        rotulo: 'Como voce avalia seu condicionamento',
        tipo: 'escala',
        min: 1,
        max: 5,
        ajuda: '1 = sem folego para subir escada; 5 = aguento pedal forte de 3 horas.',
      },
      { campo: 'fcRepouso', rotulo: 'FC de repouso', tipo: 'numero', min: 30, max: 110, sufixo: 'bpm', opcional: true, ajuda: 'Opcional. Se souber, as zonas ficam mais precisas (metodo Karvonen).' },
      { campo: 'fcMaxConhecida', rotulo: 'FC maxima conhecida', tipo: 'numero', min: 120, max: 220, sufixo: 'bpm', opcional: true, ajuda: 'Opcional. Se nao souber, estimamos pela idade.' },
      { campo: 'ftpWatts', rotulo: 'FTP', tipo: 'numero', min: 60, max: 500, sufixo: 'W', opcional: true, ajuda: 'Opcional. Se voce tem medidor de potencia.' },
    ],
  },
  {
    id: 'saude',
    titulo: 'Anamnese',
    descricao: 'Isso muda quais exercicios entram no plano e ate onde a intensidade sobe.',
    campos: [
      { campo: 'flagsSaude', rotulo: 'Marque o que se aplica', tipo: 'multipla', opcoes: opcoes(HEALTH_FLAG_LABEL), opcional: true },
      { campo: 'liberacaoMedica', rotulo: 'Tem liberacao medica recente para atividade fisica?', tipo: 'sim_nao' },
      { campo: 'medicacaoContinua', rotulo: 'Usa medicacao continua?', tipo: 'sim_nao' },
      { campo: 'observacoesSaude', rotulo: 'Algo mais que devemos saber', tipo: 'texto', opcional: true },
    ],
  },
  {
    id: 'rotina',
    titulo: 'Rotina de vida',
    descricao: 'O plano precisa caber na sua semana real, nao na semana ideal.',
    campos: [
      { campo: 'diasDisponiveis', rotulo: 'Dias por semana disponiveis para treinar', tipo: 'numero', min: 1, max: 7, sufixo: 'dias' },
      { campo: 'minutosDiaUtil', rotulo: 'Minutos por treino em dia util', tipo: 'numero', min: 20, max: 240, sufixo: 'min' },
      { campo: 'minutosFimDeSemana', rotulo: 'Minutos por treino no fim de semana', tipo: 'numero', min: 20, max: 480, sufixo: 'min' },
      { campo: 'acessos', rotulo: 'A que voce tem acesso', tipo: 'multipla', opcoes: opcoes(ACCESS_LABEL) },
      { campo: 'horasSono', rotulo: 'Horas de sono por noite', tipo: 'numero', min: 3, max: 12, sufixo: 'h' },
      { campo: 'nivelEstresse', rotulo: 'Nivel de estresse na vida hoje', tipo: 'escala', min: 1, max: 5, ajuda: '1 = tranquilo; 5 = no limite. Estresse alto reduz a carga do plano.' },
    ],
  },
]

/** Perfil inicial usado pelo formulario. */
export const PERFIL_VAZIO: Profile = {
  nome: '',
  idade: 40,
  sexo: 'masculino',
  pesoKg: 78,
  alturaCm: 175,
  modalidade: 'mtb',
  modalidadesSecundarias: [],
  objetivo: 'performance',
  horizonte: 'medio',
  eventoAlvo: '',
  anosCiclismo: 3,
  outrosEsportesAnos: 0,
  treinoEstruturadoAntes: false,
  competiuAntes: false,
  horasSemanaAtual: 3,
  kmSemanaAtual: 50,
  maiorPedalRecenteKm: 40,
  fcRepouso: null,
  fcMaxConhecida: null,
  ftpWatts: null,
  fazForcaHoje: false,
  autoavaliacaoCondicionamento: 3,
  flagsSaude: [],
  liberacaoMedica: false,
  medicacaoContinua: false,
  observacoesSaude: '',
  diasDisponiveis: 4,
  minutosDiaUtil: 60,
  minutosFimDeSemana: 150,
  horasSono: 7,
  nivelEstresse: 3,
  acessos: ['rua', 'academia'],
}
