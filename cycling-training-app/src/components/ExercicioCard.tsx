import { useState } from 'react'
import { ENFOQUE, EXECUCAO } from '../data/figuras'
import { imagem } from '../lib/imagens'
import { Figure } from '../illustrations/Figure'
import type { Exercicio } from '../data/exercises'

const FONTE: Record<Exercicio['fonte']['obra'], string> = {
  anatomia_ciclismo: 'Anatomia do Ciclismo',
  lbs: 'Primeiros passos para dominar a sua bike',
  complementar: 'Complementar (capitulo ainda nao incorporado)',
}

/** Card com a ilustracao passo a passo — a peca central da biblioteca. */
export function ExercicioCard({ e, aberto: abertoInicial = false }: { e: Exercicio; aberto?: boolean }) {
  const [aberto, setAberto] = useState(abertoInicial)
  const [passo, setPasso] = useState(0)
  const p = e.passos[Math.min(passo, e.passos.length - 1)]

  const figuraExecucao = EXECUCAO[e.id]
  const figuraEnfoque = ENFOQUE[e.id]
  const urlExecucao = imagem(figuraExecucao?.arquivo)
  const urlEnfoque = imagem(figuraEnfoque?.arquivo)

  // Com a ilustracao do material-fonte disponivel, ela abre por padrao; o passo
  // a passo em SVG continua a um toque de distancia (e e o unico modo quando a
  // imagem nao esta na maquina).
  const [modo, setModo] = useState<'livro' | 'passos'>(urlExecucao ? 'livro' : 'passos')

  return (
    <article className={`card exercicio ${aberto ? 'aberto' : ''}`}>
      <header onClick={() => setAberto((a) => !a)} role="button" tabIndex={0} onKeyDown={(ev) => ev.key === 'Enter' && setAberto((a) => !a)}>
        <div>
          <h3>{e.nome}</h3>
          <p className="sutil">{e.musculosPrimarios.join(' · ')}</p>
        </div>
        <span className="etiqueta">{e.grupo.replace('_', ' ')}</span>
      </header>

      {aberto && (
        <div className="corpo">
          <div className="ilustracao">
            {urlExecucao && (
              <div className="alternador">
                <button className={`chip pequeno ${modo === 'livro' ? 'ativo' : ''}`} onClick={() => setModo('livro')}>
                  Ilustracao
                </button>
                <button className={`chip pequeno ${modo === 'passos' ? 'ativo' : ''}`} onClick={() => setModo('passos')}>
                  Passo a passo
                </button>
              </div>
            )}

            {modo === 'livro' && urlExecucao ? (
              <figure className="figura-livro">
                <img src={urlExecucao} alt={figuraExecucao.legenda} loading="lazy" />
                <figcaption>{figuraExecucao.credito}</figcaption>
              </figure>
            ) : (
              <>
                <Figure
                  pose={p.pose}
                  destaque={p.destaque}
                  aparelho={p.aparelho}
                  legenda={p.legenda}
                  seta={p.seta ?? null}
                  setaDirecao={p.setaDirecao}
                  tamanho={210}
                />
                <div className="passos-nav">
                  {e.passos.map((_, i) => (
                    <button key={i} className={`chip pequeno ${i === passo ? 'ativo' : ''}`} onClick={() => setPasso(i)}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="detalhe">
            <ol className="lista-passos">
              {e.passos.map((passoDoExercicio, i) => (
                <li key={i} className={i === passo ? 'atual' : ''} onClick={() => setPasso(i)}>
                  {passoDoExercicio.texto}
                </li>
              ))}
            </ol>

            <h4>Enfoque no ciclismo</h4>
            {urlEnfoque && (
              <figure className="figura-livro enfoque">
                <img src={urlEnfoque} alt={figuraEnfoque.legenda} loading="lazy" />
                <figcaption>
                  {figuraEnfoque.legenda} · {figuraEnfoque.credito}
                </figcaption>
              </figure>
            )}
            <p>{e.enfoqueNoCiclismo}</p>

            <h4>Musculos</h4>
            <p className="sutil">
              <strong>Primarios:</strong> {e.musculosPrimarios.join(', ')}
              {e.musculosSecundarios.length > 0 && (
                <>
                  <br />
                  <strong>Secundarios:</strong> {e.musculosSecundarios.join(', ')}
                </>
              )}
            </p>

            {e.errosComuns.length > 0 && (
              <>
                <h4>Erros comuns</h4>
                <ul>
                  {e.errosComuns.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </>
            )}

            {e.variacoes && e.variacoes.length > 0 && (
              <>
                <h4>Variacoes</h4>
                <ul>
                  {e.variacoes.map((v) => (
                    <li key={v.nome}>
                      <strong>{v.nome}:</strong> {v.descricao}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="fonte">
              Fonte: {FONTE[e.fonte.obra]}
              {e.fonte.capitulo ? `, cap. ${e.fonte.capitulo}` : ''}
              {e.fonte.pagina ? `, p. ${e.fonte.pagina}` : ''}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}
