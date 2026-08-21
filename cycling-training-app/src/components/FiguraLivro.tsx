import type { FiguraDoLivro } from '../data/figuras'
import { imagem } from '../lib/imagens'

/**
 * Mostra uma ilustracao do material-fonte, se o arquivo existir nesta maquina.
 * Quando nao existe, nao renderiza nada — o app segue funcionando sem ela.
 */
export function FiguraLivro({ figura, legenda = true }: { figura?: FiguraDoLivro; legenda?: boolean }) {
  const url = imagem(figura?.arquivo)
  if (!url || !figura) return null
  return (
    <figure className="figura-livro">
      <img src={url} alt={figura.legenda} loading="lazy" />
      {legenda && (
        <figcaption>
          {figura.legenda} · {figura.credito}
        </figcaption>
      )}
    </figure>
  )
}
