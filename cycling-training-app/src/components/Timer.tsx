import { useEffect, useRef, useState } from 'react'

/**
 * Cronometro de intervalo para usar na academia: conta o descanso e apita.
 * O apito e sintetizado no proprio navegador, sem arquivo de audio.
 */
export function Timer({ segundos, rotulo }: { segundos: number; rotulo: string }) {
  const [restante, setRestante] = useState(segundos)
  const [rodando, setRodando] = useState(false)
  const intervalo = useRef<number | null>(null)

  useEffect(() => {
    setRestante(segundos)
    setRodando(false)
  }, [segundos])

  useEffect(() => {
    if (!rodando) return
    intervalo.current = window.setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          apitar()
          setRodando(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (intervalo.current) window.clearInterval(intervalo.current)
    }
  }, [rodando])

  const mm = String(Math.floor(restante / 60)).padStart(2, '0')
  const ss = String(restante % 60).padStart(2, '0')

  return (
    <div className={`timer ${restante === 0 ? 'zerado' : ''}`}>
      <span className="timer-rotulo">{rotulo}</span>
      <strong className="timer-visor">
        {mm}:{ss}
      </strong>
      <div className="timer-acoes">
        <button className="btn pequeno" onClick={() => setRodando((r) => !r)}>
          {rodando ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          className="btn pequeno secundario"
          onClick={() => {
            setRodando(false)
            setRestante(segundos)
          }}
        >
          Zerar
        </button>
      </div>
    </div>
  )
}

function apitar() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const ganho = ctx.createGain()
    osc.frequency.value = 880
    ganho.gain.setValueAtTime(0.15, ctx.currentTime)
    ganho.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.connect(ganho).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.6)
    osc.onended = () => ctx.close()
  } catch {
    // Navegador sem permissao de audio: o visor ja mostra 00:00.
  }
}
