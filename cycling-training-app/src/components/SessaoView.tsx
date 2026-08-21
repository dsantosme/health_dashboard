import { useState } from 'react'
import { exercicio } from '../data/exercises'
import type { Session, SessionLog } from '../types'
import { ExercicioCard } from './ExercicioCard'
import { Timer } from './Timer'

/**
 * Modo treino: e a tela que fica aberta no celular durante a sessao.
 * Mostra os blocos, o passo a passo ilustrado e registra o que foi feito.
 */
export function SessaoView({
  sessao,
  semana,
  log,
  aoRegistrar,
  aoVoltar,
}: {
  sessao: Session
  semana: number
  log?: SessionLog
  aoRegistrar: (l: SessionLog) => void
  aoVoltar: () => void
}) {
  const [pse, setPse] = useState<number | null>(log?.pse ?? null)
  const [notas, setNotas] = useState(log?.notas ?? '')
  const [cargas, setCargas] = useState<Record<string, string>>(log?.cargas ?? {})
  const [salvo, setSalvo] = useState(false)

  const descanso = sessao.forca[0]?.descansoSegundos ?? 60
  const totalGrafico = sessao.blocos.reduce((s, b) => s + b.minutos, 0) || 1

  return (
    <div className="sessao">
      <button className="btn secundario pequeno" onClick={aoVoltar}>
        ← Voltar
      </button>

      <section className="card destaque">
        <h2>{sessao.titulo}</h2>
        <p className="sutil">{sessao.objetivo}</p>
        <p className="sutil">
          {sessao.minutos} min{sessao.zonaPrincipal ? ` · zona principal ${sessao.zonaPrincipal}` : ''}
        </p>
      </section>

      {sessao.blocos.length > 0 && (
        <section className="card">
          <h3>Estrutura</h3>
          <div className="barra-esforco" role="img" aria-label="Distribuicao de esforco da sessao">
            {sessao.blocos.map((b, i) => (
              <span
                key={i}
                className={`fatia zona-${b.zonaId}`}
                style={{ flexGrow: b.minutos / totalGrafico }}
                title={`${b.rotulo} — ${b.minutos} min em ${b.zonaId}`}
              />
            ))}
          </div>
          <ol className="blocos">
            {sessao.blocos.map((b, i) => (
              <li key={i}>
                <div>
                  <strong>{b.rotulo}</strong>
                  <span className="etiqueta pequena">{b.zonaId}</span>
                  {b.repeticoes && <span className="etiqueta pequena">{b.repeticoes}x</span>}
                  {b.cadencia && <span className="etiqueta pequena">{b.cadencia}</span>}
                </div>
                <p className="sutil">{b.minutos} min. {b.observacao ?? ''}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {sessao.forca.length > 0 && (
        <section className="card">
          <h3>Exercicios</h3>
          <Timer segundos={descanso} rotulo="Descanso entre series" />
          <div className="exercicios">
            {sessao.forca.map((s) => {
              const e = exercicio(s.exercicioId)
              if (!e) return null
              return (
                <div key={s.exercicioId} className="item-forca">
                  <div className="prescricao">
                    <strong>
                      {s.series} x {s.repeticoes}
                    </strong>
                    <span className="sutil">descanso {s.descansoSegundos}s · {s.cargaSugerida}</span>
                    <label className="carga">
                      Carga usada:
                      <input
                        type="text"
                        value={cargas[s.exercicioId] ?? ''}
                        placeholder="ex.: 20 kg"
                        onChange={(ev) => setCargas((c) => ({ ...c, [s.exercicioId]: ev.target.value }))}
                      />
                    </label>
                  </div>
                  <ExercicioCard e={e} />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {sessao.dicas.length > 0 && (
        <section className="card">
          <h3>Dicas</h3>
          <ul>
            {sessao.dicas.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <h3>Registrar treino</h3>
        <label className="campo">
          <span className="rotulo">Percepcao de esforco (1 a 10)</span>
          <span className="entrada-escala">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`chip ${pse === n ? 'ativo' : ''}`} onClick={() => setPse(n)}>
                {n}
              </button>
            ))}
          </span>
        </label>
        <label className="campo">
          <span className="rotulo">Notas</span>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} placeholder="Como foi? Alguma dor?" />
        </label>
        <button
          className="btn"
          onClick={() => {
            aoRegistrar({
              sessionId: sessao.id,
              semana,
              data: new Date().toISOString(),
              concluido: true,
              pse,
              minutosReais: sessao.minutos,
              notas,
              cargas,
            })
            setSalvo(true)
          }}
        >
          {salvo || log ? 'Treino registrado ✓' : 'Marcar como concluido'}
        </button>
      </section>
    </div>
  )
}
