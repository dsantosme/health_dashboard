import { useMemo, useState } from 'react'
import { Biblioteca } from './components/Biblioteca'
import { Conhecimento } from './components/Conhecimento'
import { Onboarding } from './components/Onboarding'
import { Painel } from './components/Painel'
import { PlanoView } from './components/PlanoView'
import { SessaoView } from './components/SessaoView'
import { useApp } from './lib/store'

type Aba = 'hoje' | 'plano' | 'biblioteca' | 'base' | 'ajustes'

const ABAS: { id: Aba; rotulo: string; icone: string }[] = [
  { id: 'hoje', rotulo: 'Hoje', icone: '◉' },
  { id: 'plano', rotulo: 'Plano', icone: '▤' },
  { id: 'biblioteca', rotulo: 'Exercicios', icone: '⚉' },
  { id: 'base', rotulo: 'Base', icone: '❏' },
  { id: 'ajustes', rotulo: 'Ajustes', icone: '⚙' },
]

export default function App() {
  const { estado, concluirOnboarding, registrar, logDe, refazer, exportar, importar } = useApp()
  const [aba, setAba] = useState<Aba>('hoje')
  const [semanaAtiva, setSemanaAtiva] = useState(1)
  const [sessaoAberta, setSessaoAberta] = useState<string | null>(null)

  const semana = useMemo(
    () => estado.plan?.semanas?.find((s) => s.numero === semanaAtiva) ?? estado.plan?.semanas?.[0],
    [estado.plan, semanaAtiva],
  )

  const sessao = useMemo(
    () => semana?.sessoes?.find((s) => s.id === sessaoAberta) ?? null,
    [semana, sessaoAberta],
  )

  if (!estado.profile || !estado.assessment || !estado.plan || !semana) {
    return (
      <Layout aba={aba} setAba={setAba} mostrarAbas={false}>
        <header className="cabecalho">
          <h1>Ciclo Coach</h1>
          <p className="sutil">
            Responda o questionario uma vez e receba um plano de treino de curto, medio ou longo prazo, com as sessoes
            ilustradas passo a passo.
          </p>
        </header>
        <Onboarding aoConcluir={concluirOnboarding} />
      </Layout>
    )
  }

  return (
    <Layout aba={aba} setAba={setAba} mostrarAbas>
      {sessao ? (
        <SessaoView
          sessao={sessao}
          semana={semana.numero}
          log={logDe(sessao.id, semana.numero)}
          aoRegistrar={registrar}
          aoVoltar={() => setSessaoAberta(null)}
        />
      ) : (
        <>
          {aba === 'hoje' && (
            <>
              <SeletorSemana
                total={estado.plan.semanas.length}
                atual={semanaAtiva}
                aoTrocar={setSemanaAtiva}
              />
              <Painel
                perfil={estado.profile}
                avaliacao={estado.assessment}
                semana={semana}
                aoAbrirSessao={setSessaoAberta}
              />
            </>
          )}
          {aba === 'plano' && (
            <PlanoView plano={estado.plan} semanaAtiva={semanaAtiva} aoSelecionar={setSemanaAtiva} />
          )}
          {aba === 'biblioteca' && <Biblioteca />}
          {aba === 'base' && <Conhecimento />}
          {aba === 'ajustes' && <Ajustes refazer={refazer} exportar={exportar} importar={importar} />}
        </>
      )}
    </Layout>
  )
}

function Layout({
  children,
  aba,
  setAba,
  mostrarAbas,
}: {
  children: React.ReactNode
  aba: Aba
  setAba: (a: Aba) => void
  mostrarAbas: boolean
}) {
  return (
    <div className="app">
      <main>{children}</main>
      {mostrarAbas && (
        <nav className="abas">
          {ABAS.map((a) => (
            <button key={a.id} className={aba === a.id ? 'ativo' : ''} onClick={() => setAba(a.id)}>
              <span aria-hidden>{a.icone}</span>
              {a.rotulo}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}

function SeletorSemana({ total, atual, aoTrocar }: { total: number; atual: number; aoTrocar: (n: number) => void }) {
  return (
    <div className="seletor-semana">
      <button className="btn pequeno secundario" onClick={() => aoTrocar(Math.max(1, atual - 1))} disabled={atual === 1}>
        ←
      </button>
      <span>
        Semana {atual} de {total}
      </span>
      <button
        className="btn pequeno secundario"
        onClick={() => aoTrocar(Math.min(total, atual + 1))}
        disabled={atual === total}
      >
        →
      </button>
    </div>
  )
}

function Ajustes({
  refazer,
  exportar,
  importar,
}: {
  refazer: () => void
  exportar: () => string
  importar: (json: string) => boolean
}) {
  const [texto, setTexto] = useState('')
  const [mensagem, setMensagem] = useState('')

  return (
    <div className="ajustes">
      <section className="card">
        <h2>Ajustes</h2>
        <p className="sutil">
          Tudo fica salvo apenas neste navegador. Nenhum dado sai do seu aparelho — exporte o JSON se quiser levar para
          outro celular ou guardar um backup.
        </p>
        <div className="acoes">
          <button className="btn secundario" onClick={() => setTexto(exportar())}>
            Exportar dados
          </button>
          <button
            className="btn secundario"
            onClick={() => {
              if (confirm('Isso apaga o perfil, o plano e os registros deste navegador. Continuar?')) refazer()
            }}
          >
            Refazer questionario
          </button>
        </div>
        <textarea
          rows={8}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole aqui um backup para importar"
        />
        <button
          className="btn"
          onClick={() => setMensagem(importar(texto) ? 'Importado.' : 'JSON invalido.')}
          disabled={texto.trim() === ''}
        >
          Importar
        </button>
        {mensagem && <p className="sutil">{mensagem}</p>}
      </section>

      <section className="card">
        <h3>Aviso</h3>
        <p className="sutil">
          Este app organiza treino, nao substitui avaliacao medica nem acompanhamento de profissional de educacao fisica.
          Dor persistente, dormencia ou formigamento sao motivo para procurar um profissional antes de continuar treinando.
        </p>
      </section>
    </div>
  )
}
