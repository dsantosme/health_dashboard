import { PHASE_LABEL, type TrainingPlan } from '../types'

/** Visao macro: a periodizacao inteira, com o grafico de carga por semana. */
export function PlanoView({
  plano,
  semanaAtiva,
  aoSelecionar,
}: {
  plano: TrainingPlan
  semanaAtiva: number
  aoSelecionar: (semana: number) => void
}) {
  const max = Math.max(...plano.semanas.map((s) => s.carga))

  return (
    <div className="plano">
      <section className="card">
        <h2>Seu plano</h2>
        <ul className="resumo">
          {plano.resumo.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Periodizacao</h3>
        <div className="grafico" role="img" aria-label="Carga por semana">
          {plano.semanas.map((s) => (
            <button
              key={s.numero}
              className={`barra fase-${s.fase} ${s.numero === semanaAtiva ? 'ativa' : ''}`}
              style={{ height: `${(s.carga / max) * 100}%` }}
              onClick={() => aoSelecionar(s.numero)}
              title={`Semana ${s.numero} — ${PHASE_LABEL[s.fase]} — ${s.horasAlvo} h`}
            >
              <span>{s.numero}</span>
            </button>
          ))}
        </div>
        <div className="legenda-fases">
          {(['base', 'construcao', 'especifico', 'pico', 'recuperacao', 'taper'] as const).map((f) => (
            <span key={f} className={`chip pequeno fase-${f}`}>
              {PHASE_LABEL[f]}
            </span>
          ))}
        </div>
      </section>

      {plano.semanas.map((s) => (
        <section key={s.numero} className={`card semana ${s.numero === semanaAtiva ? 'ativa' : ''}`}>
          <header>
            <h3>
              Semana {s.numero} — {PHASE_LABEL[s.fase]}
            </h3>
            <span className="etiqueta">{s.horasAlvo} h</span>
          </header>
          <p className="sutil">{s.foco}</p>
          <ul className="lista-sessoes compacta">
            {s.sessoes.map((sessao) => (
              <li key={sessao.id}>
                <span className="dia">{['', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'][sessao.dia]}</span>
                <span className="titulo-sessao">{sessao.titulo}</span>
                <span className="min">{sessao.minutos} min</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
