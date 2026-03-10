import type { Routine, StructuredInput } from '../types'
import { getImageUrl } from '../lib/exerciseImages'

interface RoutineOverviewProps {
  routine: Routine
  onBegin: () => void
  structuredInput?: StructuredInput
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`
  const min = Math.round(seconds / 60) || 1
  return `${min} min`
}

function getSideFocusMessage(input?: StructuredInput): string | null {
  if (!input || input.side === 'both') return null
  const sideLabel = input.side === 'left' ? 'left' : 'right'
  return `You mentioned more discomfort on your ${sideLabel} side — spend a bit more time there.`
}

export default function RoutineOverview({ routine, onBegin, structuredInput }: RoutineOverviewProps) {
  const totalMinutes = Math.round(routine.totalDurationSeconds / 60)
  const sideFocusMessage = getSideFocusMessage(structuredInput)

  return (
    <div className="routine-overview" aria-label={`Routine overview: ${routine.name}`}>
      <header className="routine-overview__header">
        <h2 className="routine-overview__title">{routine.name}</h2>
        <p className="routine-overview__total" aria-label={`Total time: about ${totalMinutes} minutes`}>
          Total: ~{totalMinutes} min
        </p>
        {sideFocusMessage && (
          <p className="routine-overview__side-note" aria-label={sideFocusMessage}>
            {sideFocusMessage}
          </p>
        )}
      </header>
      <ul className="routine-overview__list" aria-label="Exercises in this routine">
        {routine.exercises.map((exercise) => {
          const baseDuration = formatDuration(exercise.durationSeconds)
          const durationText = exercise.isUnilateral ? `${baseDuration} each side` : baseDuration
          const ariaDuration =
            exercise.isUnilateral ? `Duration: ${baseDuration} each side` : `Duration: ${baseDuration}`

          return (
            <li key={exercise.id} className="routine-overview__item">
              <img
                src={getImageUrl(exercise.id)}
                alt=""
                className="routine-overview__image"
                width={80}
                height={60}
              />
              <div className="routine-overview__item-body">
                <span className="routine-overview__name">{exercise.name}</span>
                <span className="routine-overview__duration" aria-label={ariaDuration}>
                  {durationText}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="routine-overview__actions">
        <button
          type="button"
          className="routine-overview__btn routine-overview__btn--primary"
          onClick={onBegin}
          aria-label="Begin routine"
        >
          Begin
        </button>
      </div>
    </div>
  )
}
