import type { Exercise } from '../types'
import ExerciseImageViewer from './ExerciseImageViewer'

type TimerPhase = 'buffer' | 'countdown'

interface ExerciseCardProps {
  exercise: Exercise
  onComplete: () => void
  onSkip: () => void
  /** When provided, show buffer then countdown timer. */
  timerPhase?: TimerPhase
  timerSeconds?: number
  /** Optional side label for unilateral exercises ('left' or 'right'). */
  activeSide?: 'left' | 'right'
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ExerciseCard({
  exercise,
  onComplete,
  onSkip,
  timerPhase,
  timerSeconds = 0,
  activeSide,
}: ExerciseCardProps) {
  const durationMin = Math.round(exercise.durationSeconds / 60) || 1
  const durationLabel = exercise.durationSeconds < 60
    ? `${exercise.durationSeconds} sec`
    : `${durationMin} min`
  let perSideHint: string | null = null
  if (exercise.isUnilateral) {
    if (activeSide === 'right') {
      perSideHint = 'Right side · you’ll switch to the left next'
    } else if (activeSide === 'left') {
      perSideHint = 'Left side · finish this side'
    } else {
      perSideHint = 'You’ll do both sides · start on right'
    }
  }

  const showTimer = timerPhase != null
  const isBuffer = timerPhase === 'buffer'
  const isCountdown = timerPhase === 'countdown'
  const timerLabel = isBuffer
    ? (timerSeconds > 0 ? `${timerSeconds} seconds to get in position` : 'Go')
    : isCountdown
      ? `${formatCountdown(timerSeconds)} remaining`
      : durationLabel

  return (
    <article
      className="exercise-card"
      aria-label={`Exercise: ${exercise.name}, ${durationLabel}`}
    >
      <h3 className="exercise-card__name">{exercise.name}</h3>
      {perSideHint && (
        <p className="exercise-card__side-hint" aria-label="This stretch is done on both sides, starting on the right">
          {perSideHint}
        </p>
      )}
      {showTimer ? (
        <div className="exercise-card__timer" aria-live="polite" aria-label={timerLabel}>
          {isBuffer && (
            <>
              <p className="exercise-card__timer-buffer">Get in position</p>
              <p className="exercise-card__timer-value">{timerSeconds > 0 ? timerSeconds : 'Go'}</p>
            </>
          )}
          {isCountdown && (
            <p className="exercise-card__timer-value exercise-card__timer-value--countdown">
              {formatCountdown(timerSeconds)}
            </p>
          )}
        </div>
      ) : (
        <p className="exercise-card__duration" aria-label={`Duration: ${durationLabel}`}>
          {durationLabel}
        </p>
      )}
      <ExerciseImageViewer
        exerciseId={exercise.id}
        exerciseName={exercise.name}
        description={exercise.instructionCue}
      />
      <p className="exercise-card__cue">{exercise.instructionCue}</p>
      <div className="exercise-card__actions">
        <button
          type="button"
          className="exercise-card__btn exercise-card__btn--complete"
          onClick={onComplete}
          aria-label={`Mark ${exercise.name} complete`}
        >
          Done
        </button>
        <button
          type="button"
          className="exercise-card__btn exercise-card__btn--skip"
          onClick={onSkip}
          aria-label={`Skip ${exercise.name}`}
        >
          Skip
        </button>
      </div>
    </article>
  )
}
