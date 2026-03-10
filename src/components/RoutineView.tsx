import { useState, useEffect } from 'react'
import ExerciseCard from './ExerciseCard'
import RoutineOverview from './RoutineOverview'
import type { Routine, StructuredInput } from '../types'

const GET_READY_DURATION_SEC = 3
const CARD_BUFFER_SEC = 3

type TimerPhase = 'buffer' | 'countdown'

interface RoutineViewProps {
  routine: Routine
  onFinishRoutine: () => void
  onStartBreathing: () => void
  /** Optional structured input that produced this routine (for side-aware copy). */
  structuredInput?: StructuredInput
}

export default function RoutineView({
  routine,
  onFinishRoutine,
  onStartBreathing,
  structuredInput,
}: RoutineViewProps) {
  const [hasStartedRoutine, setHasStartedRoutine] = useState(false)
  const [showGetReady, setShowGetReady] = useState(false)
  const [getReadyCount, setGetReadyCount] = useState(GET_READY_DURATION_SEC)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showEndChoice, setShowEndChoice] = useState(false)
  const [timerPhase, setTimerPhase] = useState<TimerPhase>('buffer')
  const [timerSeconds, setTimerSeconds] = useState(CARD_BUFFER_SEC)
  const [currentSideIndex, setCurrentSideIndex] = useState<0 | 1 | null>(null)
  const current = routine.exercises[currentIndex]
  const isLast = currentIndex >= routine.exercises.length - 1

  // Reset card timer when moving to a new exercise
  useEffect(() => {
    if (!hasStartedRoutine || showGetReady || showEndChoice) return
    setTimerPhase('buffer')
    setTimerSeconds(CARD_BUFFER_SEC)
    if (current && current.isUnilateral) {
      setCurrentSideIndex(0)
    } else {
      setCurrentSideIndex(null)
    }
  }, [currentIndex, hasStartedRoutine, showGetReady, showEndChoice, current])

  // Card buffer (3s) then countdown (exercise duration); no auto-advance at 0
  useEffect(() => {
    if (!hasStartedRoutine || showGetReady || showEndChoice || !current) return
    if (timerPhase === 'buffer') {
      if (timerSeconds <= 0) {
        const perSideSeconds =
          current.isUnilateral && currentSideIndex != null
            ? Math.max(1, Math.round(current.durationSeconds / 2))
            : current.durationSeconds
        setTimerPhase('countdown')
        setTimerSeconds(perSideSeconds)
        return
      }
      const id = setInterval(() => setTimerSeconds((s) => s - 1), 1000)
      return () => clearInterval(id)
    }
    if (timerPhase === 'countdown' && timerSeconds > 0) {
      const id = setInterval(() => setTimerSeconds((s) => s - 1), 1000)
      return () => clearInterval(id)
    }
  }, [hasStartedRoutine, showGetReady, showEndChoice, current, timerPhase, timerSeconds, currentSideIndex])

  // For unilateral moves, when the first side's countdown reaches 0, automatically switch
  // to the second side with a fresh buffer, without advancing to the next exercise.
  useEffect(() => {
    if (!hasStartedRoutine || showGetReady || showEndChoice || !current) return
    if (!current.isUnilateral) return
    if (timerPhase !== 'countdown' || timerSeconds > 0) return
    if (currentSideIndex === 0) {
      setCurrentSideIndex(1)
      setTimerPhase('buffer')
      setTimerSeconds(CARD_BUFFER_SEC)
    }
  }, [hasStartedRoutine, showGetReady, showEndChoice, current, timerPhase, timerSeconds, currentSideIndex])

  useEffect(() => {
    if (!showGetReady) return
    if (getReadyCount <= 0) {
      setShowGetReady(false)
      setGetReadyCount(GET_READY_DURATION_SEC)
      return
    }
    const id = setInterval(() => setGetReadyCount((c) => c - 1), 1000)
    return () => clearInterval(id)
  }, [showGetReady, getReadyCount])

  const handleBegin = () => {
    setHasStartedRoutine(true)
    setShowGetReady(true)
    setGetReadyCount(GET_READY_DURATION_SEC)
  }

  const goNext = () => {
    if (isLast) {
      setShowEndChoice(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handleComplete = () => goNext()
  const handleSkip = () => goNext()

  if (routine.exercises.length === 0) {
    return (
      <div className="routine-view">
        <p>No exercises in this routine.</p>
        <button type="button" onClick={onFinishRoutine}>Finish</button>
      </div>
    )
  }

  if (!hasStartedRoutine) {
    return (
      <div className="routine-view" aria-label={`Routine: ${routine.name}`}>
        <RoutineOverview routine={routine} onBegin={handleBegin} structuredInput={structuredInput} />
      </div>
    )
  }

  if (showGetReady) {
    return (
      <div className="routine-view" aria-label={`Routine: ${routine.name}`}>
        <div className="routine-view__get-ready" aria-live="polite">
          <h2 className="routine-view__get-ready-title">Get ready</h2>
          <p className="routine-view__get-ready-count" aria-label={getReadyCount > 0 ? `${getReadyCount} seconds` : 'Go'}>
            {getReadyCount > 0 ? getReadyCount : 'Go'}
          </p>
        </div>
      </div>
    )
  }

  if (showEndChoice) {
    return (
      <div className="routine-view" aria-label={`Routine: ${routine.name}`}>
        <div className="routine-view__end">
          <h2>Routine complete</h2>
          <p>Add a 1-minute breathing exercise to downregulate?</p>
          <div className="routine-view__end-actions">
            <button
              type="button"
              className="routine-view__btn routine-view__btn--primary"
              onClick={onStartBreathing}
              aria-label="Add 1-minute breathing exercise"
            >
              Add 1-min breathing
            </button>
            <button
              type="button"
              className="routine-view__btn routine-view__btn--secondary"
              onClick={onFinishRoutine}
            >
              Finish without breathing
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isUnilateral = current?.isUnilateral
  const activeSide: 'left' | 'right' | undefined =
    isUnilateral && currentSideIndex != null
      ? currentSideIndex === 0
        ? 'right'
        : 'left'
      : undefined

  return (
    <div className="routine-view" aria-label={`Routine: ${routine.name}`}>
      <header className="routine-view__header">
        <h2>{routine.name}</h2>
        <p className="routine-view__meta">
          Exercise {currentIndex + 1} of {routine.exercises.length} · ~{Math.round(routine.totalDurationSeconds / 60)} min total
        </p>
      </header>
      <div className="routine-view__card">
        <ExerciseCard
          exercise={current}
          onComplete={handleComplete}
          onSkip={handleSkip}
          timerPhase={timerPhase}
          timerSeconds={timerSeconds}
          activeSide={activeSide}
        />
      </div>
    </div>
  )
}
