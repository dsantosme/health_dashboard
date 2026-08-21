import { useState } from 'react'
import { ETAPAS, PERFIL_VAZIO, type Campo } from '../data/questions'
import type { Profile } from '../types'

/**
 * Questionario em etapas. Renderiza o que estiver declarado em data/questions.ts,
 * entao adicionar pergunta nova nao exige mexer aqui.
 */
export function Onboarding({ aoConcluir }: { aoConcluir: (p: Profile) => void }) {
  const [etapa, setEtapa] = useState(0)
  const [perfil, setPerfil] = useState<Profile>(PERFIL_VAZIO)

  const atual = ETAPAS[etapa]
  const ultima = etapa === ETAPAS.length - 1

  const definir = (campo: keyof Profile, valor: unknown) =>
    setPerfil((p) => ({ ...p, [campo]: valor }) as Profile)

  return (
    <div className="onboarding">
      <div className="passos" aria-label={`Etapa ${etapa + 1} de ${ETAPAS.length}`}>
        {ETAPAS.map((e, i) => (
          <span key={e.id} className={`passo ${i === etapa ? 'ativo' : i < etapa ? 'feito' : ''}`} />
        ))}
      </div>

      <h2>{atual.titulo}</h2>
      <p className="sutil">{atual.descricao}</p>

      <div className="campos">
        {atual.campos.map((c) => (
          <CampoForm key={String(c.campo)} campo={c} perfil={perfil} definir={definir} />
        ))}
      </div>

      <div className="acoes">
        {etapa > 0 && (
          <button className="btn secundario" onClick={() => setEtapa((e) => e - 1)}>
            Voltar
          </button>
        )}
        <button
          className="btn"
          onClick={() => (ultima ? aoConcluir(perfil) : setEtapa((e) => e + 1))}
          disabled={etapa === 0 && perfil.nome.trim() === ''}
        >
          {ultima ? 'Gerar meu plano' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}

function CampoForm({
  campo,
  perfil,
  definir,
}: {
  campo: Campo
  perfil: Profile
  definir: (c: keyof Profile, v: unknown) => void
}) {
  const valor = perfil[campo.campo]

  return (
    <label className="campo">
      <span className="rotulo">
        {campo.rotulo}
        {campo.opcional && <em> (opcional)</em>}
      </span>

      {campo.tipo === 'texto' && (
        <input
          type="text"
          value={String(valor ?? '')}
          onChange={(e) => definir(campo.campo, e.target.value)}
          placeholder={campo.opcional ? 'Pode deixar em branco' : ''}
        />
      )}

      {campo.tipo === 'numero' && (
        <span className="entrada-numero">
          <input
            type="number"
            min={campo.min}
            max={campo.max}
            value={valor === null || valor === undefined ? '' : Number(valor)}
            onChange={(e) => definir(campo.campo, e.target.value === '' ? null : Number(e.target.value))}
          />
          {campo.sufixo && <em>{campo.sufixo}</em>}
        </span>
      )}

      {campo.tipo === 'sim_nao' && (
        <span className="opcoes">
          {[
            { v: true, r: 'Sim' },
            { v: false, r: 'Nao' },
          ].map((o) => (
            <button
              key={String(o.v)}
              type="button"
              className={`chip ${valor === o.v ? 'ativo' : ''}`}
              onClick={() => definir(campo.campo, o.v)}
            >
              {o.r}
            </button>
          ))}
        </span>
      )}

      {campo.tipo === 'escala' && (
        <span className="entrada-escala">
          {Array.from({ length: (campo.max ?? 5) - (campo.min ?? 1) + 1 }, (_, i) => (campo.min ?? 1) + i).map((n) => (
            <button
              key={n}
              type="button"
              className={`chip ${valor === n ? 'ativo' : ''}`}
              onClick={() => definir(campo.campo, n)}
            >
              {n}
            </button>
          ))}
        </span>
      )}

      {campo.tipo === 'unica' && (
        <span className="opcoes">
          {campo.opcoes?.map((o) => (
            <button
              key={o.valor}
              type="button"
              className={`chip ${valor === o.valor ? 'ativo' : ''}`}
              onClick={() => definir(campo.campo, o.valor)}
            >
              {o.rotulo}
            </button>
          ))}
        </span>
      )}

      {campo.tipo === 'multipla' && (
        <span className="opcoes">
          {campo.opcoes?.map((o) => {
            const lista = (valor as string[]) ?? []
            const marcado = lista.includes(o.valor)
            return (
              <button
                key={o.valor}
                type="button"
                className={`chip ${marcado ? 'ativo' : ''}`}
                onClick={() =>
                  definir(campo.campo, marcado ? lista.filter((x) => x !== o.valor) : [...lista, o.valor])
                }
              >
                {o.rotulo}
              </button>
            )
          })}
        </span>
      )}

      {campo.ajuda && <span className="ajuda">{campo.ajuda}</span>}
    </label>
  )
}
