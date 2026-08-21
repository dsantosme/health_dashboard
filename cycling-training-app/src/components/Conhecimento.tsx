import { AQUECIMENTOS, BIKE_FIT_CHECKLIST, CAPITULOS, PRINCIPIOS, REGIOES } from '../data/livro'
import { BIKE_SETUP, EFICIENCIA_PEDALADA, POSTURA_ATAQUE, SINDROME_CRUZADA_SUPERIOR } from '../data/mtb'

/**
 * A base teorica do app, aberta: de onde vem cada regra do plano e
 * quanto do material ja foi incorporado.
 */
export function Conhecimento() {
  const lidos = CAPITULOS.filter((c) => c.status === 'lido').length

  return (
    <div className="conhecimento">
      <section className="card destaque">
        <h2>De onde vem o plano</h2>
        <p>
          Duas fontes alimentam o motor deste app: <strong>Anatomia do Ciclismo</strong>, de Shannon Sovndal (Manole), e o
          e-book <strong>Primeiros passos para dominar a sua bike</strong>, da Ludolf Bike School. O que esta aqui sao
          anotacoes e principios resumidos com nossas palavras, nao o texto das obras.
        </p>
        <div className="progresso">
          <div className="barra-progresso">
            <span style={{ width: `${(lidos / CAPITULOS.length) * 100}%` }} />
          </div>
          <span className="sutil">
            {lidos} de {CAPITULOS.length} capitulos incorporados
          </span>
        </div>
        <ul className="capitulos">
          {CAPITULOS.map((c) => (
            <li key={c.numero} className={c.status}>
              <span className="etiqueta">{c.status === 'lido' ? 'incorporado' : 'a fazer'}</span>
              <strong>
                Cap. {c.numero} — {c.titulo}
              </strong>
              <span className="sutil"> (p. {c.paginaInicial})</span>
              <p className="sutil">{c.aplicacaoNoApp}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Principios que o motor aplica</h3>
        {PRINCIPIOS.map((p) => (
          <details key={p.id}>
            <summary>
              {p.titulo} <span className="etiqueta pequena">cap. {p.capitulo}</span>
            </summary>
            <p>{p.texto}</p>
            <p className="sutil">
              <strong>No app:</strong> {p.ondeAplica}
            </p>
          </details>
        ))}
      </section>

      <section className="card">
        <h3>Anatomia do ciclista</h3>
        {REGIOES.map((r) => (
          <details key={r.id}>
            <summary>
              {r.nome} <span className="etiqueta pequena">cap. {r.capitulo}</span>
            </summary>
            <p className="sutil">{r.musculos.join(' · ')}</p>
            <p>{r.papelNoCiclismo}</p>
          </details>
        ))}
      </section>

      <section className="card">
        <h3>Aquecimento</h3>
        {AQUECIMENTOS.map((a) => (
          <details key={a.regiao}>
            <summary>
              {a.regiao} <span className="etiqueta pequena">{a.minutos} min</span>
            </summary>
            <ul>
              {a.itens.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </details>
        ))}
      </section>

      <section className="card">
        <h3>Bike setup</h3>
        {BIKE_SETUP.map((b) => (
          <details key={b.id}>
            <summary>{b.titulo}</summary>
            <ol>
              {b.passos.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
            <p className="sutil">Resolve: {b.resolve.join(', ')}</p>
          </details>
        ))}
        <details>
          <summary>Checklist rapido de posicao</summary>
          <ul>
            {BIKE_FIT_CHECKLIST.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </details>
      </section>

      <section className="card">
        <h3>Tecnica</h3>
        <details>
          <summary>Postura de ataque</summary>
          <ol>
            {POSTURA_ATAQUE.passos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <p className="sutil">
            <strong>Sinais de que esta errado:</strong> {POSTURA_ATAQUE.sinaisDeQueEstaErrado.join('; ')}.
          </p>
          <p>{POSTURA_ATAQUE.observacao}</p>
        </details>
        <details>
          <summary>Educativo de pedalada unilateral</summary>
          <ol>
            {EFICIENCIA_PEDALADA.educativoUnilateral.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <p>{EFICIENCIA_PEDALADA.observacao}</p>
        </details>
        <details>
          <summary>Sindrome cruzada superior</summary>
          <p>{SINDROME_CRUZADA_SUPERIOR.explicacao}</p>
          <p className="sutil">
            <strong>Rigidez:</strong> {SINDROME_CRUZADA_SUPERIOR.rigidez.join(', ')}.<br />
            <strong>Fraqueza:</strong> {SINDROME_CRUZADA_SUPERIOR.fraqueza.join(', ')}.
          </p>
          <p className="alerta-texto">{SINDROME_CRUZADA_SUPERIOR.aviso}</p>
        </details>
      </section>
    </div>
  )
}
