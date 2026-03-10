import { useState, useEffect, useRef } from 'react'

const BOX_PHASES = [
  { label: 'Breathe in', duration: 4 },
  { label: 'Hold', duration: 4 },
  { label: 'Breathe out', duration: 4 },
  { label: 'Hold', duration: 4 },
] as const

const TOTAL_SECONDS = 60
const TOTAL_MS = TOTAL_SECONDS * 1000

function getPhase(secondsElapsed: number): (typeof BOX_PHASES)[number] {
  const step = secondsElapsed % 16
  if (step < 4) return BOX_PHASES[0]
  if (step < 8) return BOX_PHASES[1]
  if (step < 12) return BOX_PHASES[2]
  return BOX_PHASES[3]
}

interface BreathingExerciseProps {
  onFinish: () => void
}

export default function BreathingExercise({ onFinish }: BreathingExerciseProps) {
  const [timeLeftMs, setTimeLeftMs] = useState(TOTAL_MS)
  const finishedRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeftMs((ms) => {
        if (ms <= 100) {
          if (!finishedRef.current) {
            finishedRef.current = true
            onFinish()
          }
          return 0
        }
        return ms - 100
      })
    }, 100)
    return () => clearInterval(interval)
  }, [onFinish])

  const secondsElapsed = (TOTAL_MS - timeLeftMs) / 1000
  const phase = getPhase(secondsElapsed)

  // Smoothly animate scale over the 4-4-4-4 box-breath cycle.
  const cyclePos = secondsElapsed % 16
  const minScale = 0.9
  const maxScale = 1.2
  let scale: number

  if (cyclePos < 4) {
    // 0–4s: inhale – grow from min to max
    const progress = Math.min(cyclePos / 4, 1)
    scale = minScale + (maxScale - minScale) * progress
  } else if (cyclePos < 8) {
    // 4–8s: hold full inhale
    scale = maxScale
  } else if (cyclePos < 12) {
    // 8–12s: exhale – shrink from max to min
    const progress = Math.min((cyclePos - 8) / 4, 1)
    scale = maxScale - (maxScale - minScale) * progress
  } else {
    // 12–16s: hold at the lower, relaxed size
    scale = minScale
  }
  const phaseClass =
    phase.label === 'Breathe in'
      ? 'breathing-exercise__circle--in'
      : phase.label === 'Breathe out'
      ? 'breathing-exercise__circle--out'
      : 'breathing-exercise__circle--hold'

  return (
    <div className="breathing-exercise" aria-label="Breathing exercise" aria-live="polite">
      <h2>Box breathing</h2>
      <p className="breathing-exercise__hint">1 minute · 4-4-4-4 pattern</p>
      <div
        className={`breathing-exercise__circle ${phaseClass}`}
        style={{ transform: `scale(${scale})` }}
        aria-hidden="true"
      />
      <p className="breathing-exercise__phase" aria-live="polite">
        {phase.label}
      </p>
      <p className="breathing-exercise__timer">{Math.ceil(timeLeftMs / 1000)}s left</p>
    </div>
  )
}
