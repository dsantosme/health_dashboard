import { useMemo, useState } from 'react'
import { EXERCICIOS, type GrupoExercicio } from '../data/exercises'
import { ExercicioCard } from './ExercicioCard'

const GRUPOS: { id: GrupoExercicio | 'todos'; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'membros_inferiores', rotulo: 'Membros inferiores' },
  { id: 'core', rotulo: 'Core' },
  { id: 'ombro', rotulo: 'Ombros' },
  { id: 'membros_superiores', rotulo: 'Membros superiores' },
  { id: 'dorso', rotulo: 'Dorso' },
  { id: 'peitoral', rotulo: 'Torax' },
  { id: 'mobilidade', rotulo: 'Mobilidade' },
  { id: 'tecnica', rotulo: 'Tecnica' },
]

/** Biblioteca completa, com busca por nome e por musculo. */
export function Biblioteca() {
  const [grupo, setGrupo] = useState<GrupoExercicio | 'todos'>('todos')
  const [busca, setBusca] = useState('')

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return EXERCICIOS.filter((e) => grupo === 'todos' || e.grupo === grupo).filter(
      (e) =>
        termo === '' ||
        e.nome.toLowerCase().includes(termo) ||
        [...e.musculosPrimarios, ...e.musculosSecundarios].some((m) => m.toLowerCase().includes(termo)),
    )
  }, [grupo, busca])

  return (
    <div className="biblioteca">
      <section className="card">
        <h2>Biblioteca de exercicios</h2>
        <p className="sutil">
          {EXERCICIOS.length} exercicios ilustrados passo a passo. As figuras sao desenhos proprios gerados a partir de
          angulos articulares.
        </p>
        <input
          className="busca"
          type="search"
          placeholder="Buscar por exercicio ou musculo (ex.: triceps, gluteo)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="opcoes">
          {GRUPOS.map((g) => (
            <button key={g.id} className={`chip ${grupo === g.id ? 'ativo' : ''}`} onClick={() => setGrupo(g.id)}>
              {g.rotulo}
            </button>
          ))}
        </div>
      </section>

      {lista.length === 0 && <p className="sutil">Nada encontrado para essa busca.</p>}
      {lista.map((e) => (
        <ExercicioCard key={e.id} e={e} />
      ))}
    </div>
  )
}
