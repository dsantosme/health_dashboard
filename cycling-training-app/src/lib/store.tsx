import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { avaliar } from '../engine/assessment'
import { gerarPlano } from '../engine/plan'
import type { AppState, Profile, SessionLog } from '../types'

const CHAVE = 'ciclo-coach:v1'
const VERSAO = 1

const VAZIO: AppState = { versao: VERSAO, profile: null, assessment: null, plan: null, logs: [] }

/**
 * Confere a forma do backup antes de aceitar.
 *
 * Um arquivo truncado que passasse daqui viraria tela branca: o app leria
 * plan.semanas de um objeto sem semanas. Melhor recusar a importacao.
 */
function ehEstadoValido(dados: unknown): dados is Partial<AppState> {
  if (typeof dados !== 'object' || dados === null) return false
  const e = dados as Partial<AppState>
  if (!('versao' in e)) return false
  if (e.plan !== null && e.plan !== undefined) {
    if (typeof e.plan !== 'object' || !Array.isArray(e.plan.semanas)) return false
    const semanaQuebrada = e.plan.semanas.some((s) => !s || !Array.isArray(s.sessoes))
    if (semanaQuebrada) return false
  }
  if (e.logs !== undefined && !Array.isArray(e.logs)) return false
  if (e.profile !== null && e.profile !== undefined && typeof e.profile !== 'object') return false
  return true
}

function carregar(): AppState {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return VAZIO
    const dados = JSON.parse(bruto) as AppState
    if (dados?.versao !== VERSAO || !ehEstadoValido(dados)) return VAZIO
    return dados
  } catch {
    // Aba anonima, storage bloqueado, JSON corrompido: comeca limpo.
    return VAZIO
  }
}

function salvar(estado: AppState) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado))
  } catch {
    // Sem storage o app continua funcionando, so nao lembra entre sessoes.
  }
}

interface Contexto {
  estado: AppState
  /** Roda a avaliacao e gera o plano a partir do questionario. */
  concluirOnboarding: (p: Profile) => void
  registrar: (log: SessionLog) => void
  logDe: (sessionId: string, semana: number) => SessionLog | undefined
  refazer: () => void
  exportar: () => string
  importar: (json: string) => boolean
}

const Ctx = createContext<Contexto | null>(null)

export function Provedor({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<AppState>(() => carregar())

  useEffect(() => {
    salvar(estado)
  }, [estado])

  const concluirOnboarding = useCallback((profile: Profile) => {
    const { assessment, restricoes } = avaliar(profile)
    const plan = gerarPlano(profile, assessment, restricoes)
    setEstado({ versao: VERSAO, profile, assessment, plan, logs: [] })
  }, [])

  const registrar = useCallback((log: SessionLog) => {
    setEstado((e) => ({
      ...e,
      logs: [...e.logs.filter((l) => !(l.sessionId === log.sessionId && l.semana === log.semana)), log],
    }))
  }, [])

  const logDe = useCallback(
    (sessionId: string, semana: number) => estado.logs.find((l) => l.sessionId === sessionId && l.semana === semana),
    [estado.logs],
  )

  const refazer = useCallback(() => setEstado(VAZIO), [])

  const exportar = useCallback(() => JSON.stringify(estado, null, 2), [estado])

  const importar = useCallback((json: string) => {
    try {
      const dados = JSON.parse(json) as unknown
      if (!ehEstadoValido(dados)) return false
      setEstado({ ...VAZIO, ...dados, versao: VERSAO })
      return true
    } catch {
      return false
    }
  }, [])

  const valor = useMemo(
    () => ({ estado, concluirOnboarding, registrar, logDe, refazer, exportar, importar }),
    [estado, concluirOnboarding, registrar, logDe, refazer, exportar, importar],
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useApp(): Contexto {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp precisa estar dentro do Provedor')
  return ctx
}
