import { LEVEL_LABEL, MODALITY_LABEL, PHASE_LABEL, type Assessment, type Profile, type WeekPlan } from '../types'

/** Tela inicial: quem voce e, onde o plano comeca e o que fazer hoje. */
export function Painel({
  perfil,
  avaliacao,
  semana,
  aoAbrirSessao,
}: {
  perfil: Profile
  avaliacao: Assessment
  semana: WeekPlan
  aoAbrirSessao: (id: string) => void
}) {
  return (
    <div className="painel">
      <section className="card destaque">
        <h2>
          {perfil.nome || 'Atleta'} · {LEVEL_LABEL[avaliacao.level]}
        </h2>
        <p className="sutil">
          {MODALITY_LABEL[perfil.modalidade]} · score {avaliacao.score}/100 · IMC {avaliacao.imc}
        </p>
        <div className="medidores">
          <Medidor titulo="FC maxima" valor={`${avaliacao.fcMax} bpm`} nota={avaliacao.fcMaxEstimada ? 'estimada pela idade' : 'informada'} />
          <Medidor
            titulo="FTP"
            valor={avaliacao.ftp ? `${avaliacao.ftp} W` : '—'}
            nota={avaliacao.ftp ? `${avaliacao.wattsPorKg} W/kg${avaliacao.ftpEstimado ? ' (estimado)' : ''}` : ''}
          />
          <Medidor titulo="Volume inicial" valor={`${avaliacao.horasSemanaInicial} h`} nota={`teto ${avaliacao.horasSemanaMax} h/semana`} />
        </div>
      </section>

      {avaliacao.alertas.length > 0 && (
        <section className="card alerta">
          <h3>Antes de comecar</h3>
          <ul>
            {avaliacao.alertas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <h3>
          Semana {semana.numero} — {PHASE_LABEL[semana.fase]}
        </h3>
        <p className="sutil">{semana.foco}</p>
        <p className="sutil">Alvo: {semana.horasAlvo} h</p>
        <ul className="lista-sessoes">
          {semana.sessoes.map((s) => (
            <li key={s.id}>
              <button className="linha-sessao" onClick={() => aoAbrirSessao(s.id)}>
                <span className="dia">{['', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'][s.dia]}</span>
                <span className="titulo-sessao">{s.titulo}</span>
                <span className="min">{s.minutos} min</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Suas zonas</h3>
        <table className="tabela-zonas">
          <thead>
            <tr>
              <th>Zona</th>
              <th>FC (bpm)</th>
              <th>Potencia (W)</th>
              <th>PSE</th>
            </tr>
          </thead>
          <tbody>
            {avaliacao.zonas.map((z) => (
              <tr key={z.id}>
                <td>
                  <strong>{z.nome}</strong>
                  <br />
                  <span className="sutil">{z.falaTeste}</span>
                </td>
                <td>{z.fcBpm ? `${z.fcBpm[0]}–${z.fcBpm[1]}` : '—'}</td>
                <td>{z.watts ? `${z.watts[0]}–${z.watts[1]}` : '—'}</td>
                <td>
                  {z.pse[0]}
                  {z.pse[1] !== z.pse[0] ? `–${z.pse[1]}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <details className="card">
        <summary>Como chegamos no seu nivel</summary>
        <ul className="racional">
          {avaliacao.racional.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}

function Medidor({ titulo, valor, nota }: { titulo: string; valor: string; nota?: string }) {
  return (
    <div className="medidor">
      <span className="medidor-titulo">{titulo}</span>
      <strong>{valor}</strong>
      {nota && <span className="sutil">{nota}</span>}
    </div>
  )
}
