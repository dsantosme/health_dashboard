import { resolver, type Aparelho, type Esqueleto, type GrupoDestaque, type Pose, type Vec } from './pose'

interface Props {
  pose: Pose
  destaque?: GrupoDestaque[]
  aparelho?: Aparelho
  /** Legenda curta desenhada no rodape do quadro. */
  legenda?: string
  /** Seta indicando a direcao do movimento, do primeiro ao segundo ponto. */
  seta?: 'mao' | 'quadril' | 'joelho' | 'pe' | null
  setaDirecao?: 'cima' | 'baixo' | 'frente' | 'tras'
  tamanho?: number
}

const p = ([x, y]: Vec) => `${x.toFixed(1)},${y.toFixed(1)}`

/** Desloca um segmento lateralmente, para o musculo destacado nao cobrir o osso. */
function paralelo(a: Vec, b: Vec, offset: number): [Vec, Vec] {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  const nx = (-dy / len) * offset
  const ny = (dx / len) * offset
  return [
    [a[0] + nx, a[1] + ny],
    [b[0] + nx, b[1] + ny],
  ]
}

function musculo(e: Esqueleto, grupo: GrupoDestaque): [Vec, Vec] | null {
  switch (grupo) {
    case 'quadriceps':
      return paralelo(e.quadril, e.joelho, 2.4)
    case 'isquiotibiais':
      return paralelo(e.quadril, e.joelho, -2.4)
    case 'gluteo':
      return paralelo(e.quadril, [(e.quadril[0] + e.joelho[0]) / 2, (e.quadril[1] + e.joelho[1]) / 2], -3.2)
    case 'panturrilha':
      return paralelo(e.joelho, e.tornozelo, -2.4)
    case 'triceps':
      return paralelo(e.ombro, e.cotovelo, -2.2)
    case 'biceps':
      return paralelo(e.ombro, e.cotovelo, 2.2)
    case 'antebraco':
      return paralelo(e.cotovelo, e.mao, 2.2)
    case 'peitoral':
      return paralelo(e.ombro, [(e.ombro[0] + e.quadril[0]) / 2, (e.ombro[1] + e.quadril[1]) / 2], 3)
    case 'dorso':
      return paralelo(e.ombro, e.quadril, -3)
    case 'abdome':
      return paralelo(e.ombro, e.quadril, 3)
    case 'ombro':
      return null
    default:
      return null
  }
}

function Aparelhos({ tipo, e }: { tipo: Aparelho; e: Esqueleto }) {
  const mao = e.mao
  switch (tipo) {
    case 'barra':
      return (
        <g className="fig-equip">
          <line x1={mao[0] - 13} y1={mao[1]} x2={mao[0] + 13} y2={mao[1]} />
          <circle cx={mao[0] - 13} cy={mao[1]} r="3.4" className="fig-disco" />
          <circle cx={mao[0] + 13} cy={mao[1]} r="3.4" className="fig-disco" />
        </g>
      )
    case 'halter':
      return (
        <g className="fig-equip">
          <line x1={mao[0] - 4.5} y1={mao[1]} x2={mao[0] + 4.5} y2={mao[1]} />
          <rect x={mao[0] - 6.5} y={mao[1] - 2.6} width="2.6" height="5.2" className="fig-disco" />
          <rect x={mao[0] + 3.9} y={mao[1] - 2.6} width="2.6" height="5.2" className="fig-disco" />
        </g>
      )
    case 'polia_alta':
      return (
        <g className="fig-equip">
          <line x1={mao[0]} y1="4" x2={mao[0]} y2={mao[1]} strokeDasharray="3 2" />
          <rect x={mao[0] - 9} y="2" width="18" height="3" className="fig-disco" />
        </g>
      )
    case 'polia_baixa':
      return (
        <g className="fig-equip">
          <line x1={mao[0]} y1="94" x2={mao[0]} y2={mao[1]} strokeDasharray="3 2" />
          <rect x={mao[0] - 9} y="92" width="18" height="3" className="fig-disco" />
        </g>
      )
    case 'banco':
      return <rect className="fig-apoio" x="18" y={e.quadril[1] + 4} width="64" height="4.5" rx="1.5" />
    case 'parede':
      return <line className="fig-apoio" x1="94" y1="6" x2="94" y2="94" />
    case 'degrau':
      return <rect className="fig-apoio" x={e.ponta[0] - 12} y={e.tornozelo[1] + 2} width="24" height="10" rx="1" />
    case 'cadeira':
      return (
        <g className="fig-apoio">
          <rect x={e.quadril[0] - 14} y={e.quadril[1] + 3} width="30" height="4" rx="1" />
          <line x1={e.quadril[0] - 12} y1={e.quadril[1] + 7} x2={e.quadril[0] - 12} y2="94" />
          <line x1={e.quadril[0] + 14} y1={e.quadril[1] + 7} x2={e.quadril[0] + 14} y2="94" />
        </g>
      )
    case 'faixa':
      return (
        <g className="fig-equip">
          <line x1={mao[0]} y1={mao[1]} x2={e.ponta[0]} y2={e.ponta[1]} strokeDasharray="4 2" />
        </g>
      )
    case 'bolinha':
      return <circle className="fig-apoio" cx={e.ponta[0] - 3} cy="90" r="4" />
    case 'bike':
      return (
        <g className="fig-equip">
          <circle cx={e.ponta[0] + 22} cy="80" r="13" fill="none" />
          <circle cx={e.ponta[0] - 24} cy="80" r="13" fill="none" />
          <path d={`M${e.ponta[0] - 24} 80 L${e.ponta[0]} 62 L${e.mao[0]} ${e.mao[1] + 3} L${e.ponta[0] + 22} 80`} fill="none" />
          <path d={`M${e.ponta[0] - 24} 80 L${e.ponta[0] - 2} 80 L${e.ponta[0]} 62`} fill="none" />
        </g>
      )
    default:
      return null
  }
}

function Seta({ de, direcao }: { de: Vec; direcao: 'cima' | 'baixo' | 'frente' | 'tras' }) {
  const d = { cima: [0, -14], baixo: [0, 14], frente: [15, 0], tras: [-15, 0] }[direcao] as [number, number]
  const fim: Vec = [de[0] + d[0], de[1] + d[1]]
  return (
    <g className="fig-seta">
      <line x1={de[0]} y1={de[1]} x2={fim[0]} y2={fim[1]} markerEnd="url(#pontaSeta)" />
    </g>
  )
}

/**
 * Figura de perfil desenhada a partir de angulos articulares.
 * Usada em todos os passos de exercicio da biblioteca.
 */
export function Figure({ pose, destaque = [], aparelho = 'nenhum', legenda, seta, setaDirecao = 'cima', tamanho = 150 }: Props) {
  const e = resolver(pose)
  const ancoras: Record<string, Vec> = {
    mao: e.mao,
    quadril: e.quadril,
    joelho: e.joelho,
    pe: e.ponta,
  }

  return (
    <svg className="figura" viewBox="0 0 100 100" width={tamanho} height={tamanho} role="img" aria-label={legenda ?? 'Ilustracao do exercicio'}>
      <defs>
        <marker id="pontaSeta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <line className="fig-chao" x1="4" y1="94" x2="96" y2="94" />
      <Aparelhos tipo={aparelho} e={e} />

      {/* membros do lado oposto ficam atras, em traco mais leve */}
      <g className="fig-tras">
        {e.joelhoTras && e.tornozeloTras && e.pontaTras && (
          <polyline points={`${p(e.quadril)} ${p(e.joelhoTras)} ${p(e.tornozeloTras)} ${p(e.pontaTras)}`} />
        )}
        {e.cotoveloTras && e.maoTras && <polyline points={`${p(e.ombro)} ${p(e.cotoveloTras)} ${p(e.maoTras)}`} />}
      </g>

      <g className="fig-corpo">
        <line x1={e.quadril[0]} y1={e.quadril[1]} x2={e.ombro[0]} y2={e.ombro[1]} />
        <line x1={e.ombro[0]} y1={e.ombro[1]} x2={e.pescoco[0]} y2={e.pescoco[1]} />
        <polyline points={`${p(e.ombro)} ${p(e.cotovelo)} ${p(e.mao)}`} />
        <polyline points={`${p(e.quadril)} ${p(e.joelho)} ${p(e.tornozelo)} ${p(e.ponta)}`} />
        <circle cx={e.cabeca[0]} cy={e.cabeca[1]} r="6" className="fig-cabeca" />
      </g>

      <g className="fig-musculo">
        {destaque.map((grupo) => {
          if (grupo === 'ombro') return <circle key={grupo} cx={e.ombro[0]} cy={e.ombro[1]} r="4.5" />
          const seg = musculo(e, grupo)
          if (!seg) return null
          return <line key={grupo} x1={seg[0][0]} y1={seg[0][1]} x2={seg[1][0]} y2={seg[1][1]} />
        })}
      </g>

      {seta && <Seta de={ancoras[seta]} direcao={setaDirecao} />}
      {legenda && (
        <text className="fig-legenda" x="50" y="99" textAnchor="middle">
          {legenda}
        </text>
      )}
    </svg>
  )
}
