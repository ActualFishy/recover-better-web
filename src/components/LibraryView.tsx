import { useState, useRef, useEffect, type KeyboardEventHandler } from 'react'
import { EXERCISES } from '../data/exercises'
import { getImageUrl } from '../lib/exerciseImages'
import type { Exercise } from '../types'

interface LibraryViewProps {
  onClose: () => void
}

const REGION_LABELS: Record<string, string> = {
  hip: 'Hips & Glutes',
  glute: 'Hips & Glutes',
  hamstring: 'Hamstrings',
  quad: 'Quads',
  calf: 'Calves',
  'lower-back': 'Lower back',
  'upper-back': 'Upper back',
  piriformis: 'Hips & Glutes',
}

function getRegionKey(exercise: Exercise): string {
  return exercise.bodyRegions[0] ?? 'other'
}

function getRegionLabel(key: string): string {
  return REGION_LABELS[key] ?? 'Other'
}

function groupExercisesByRegion(exercises: Exercise[]) {
  const groups: Record<string, Exercise[]> = {}

  exercises.forEach((exercise) => {
    const key = getRegionKey(exercise)
    if (!groups[key]) groups[key] = []
    groups[key].push(exercise)
  })

  return Object.entries(groups).map(([key, items]) => ({
    key,
    label: getRegionLabel(key),
    exercises: items,
  }))
}

export default function LibraryView({ onClose }: LibraryViewProps) {
  const groups = groupExercisesByRegion(EXERCISES)
  const [selected, setSelected] = useState<Exercise | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (selected && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [selected])

  const handleCardClick = (exercise: Exercise) => {
    setSelected(exercise)
  }

  const handleDialogClose = () => {
    setSelected(null)
  }

  const handleDialogKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      handleDialogClose()
    }
  }

  return (
    <section
      className="library-view"
      aria-label="Stretch Library"
    >
      <header className="library-view__header">
        <h2 className="library-view__title">Stretch Library</h2>
        <p className="library-view__subtitle">
          Browse all available stretches used in your recovery routines.
        </p>
        <button
          type="button"
          className="library-view__close"
          onClick={onClose}
          aria-label="Close stretch library and return to the main view"
        >
          Close
        </button>
      </header>
      <p className="library-view__summary" aria-label="Total number of stretches available">
        {EXERCISES.length} stretches available
      </p>

      <div className="library-view__groups">
        {groups.map((group) => (
          <section
            key={group.key}
            className="library-view__group"
            aria-label={`${group.label} stretches`}
          >
            <h3 className="library-view__group-title">{group.label}</h3>
            <div className="library-view__grid">
              {group.exercises.map((exercise) => {
                const durationMin = Math.round(exercise.durationSeconds / 60) || 1
                const durationLabel =
                  exercise.durationSeconds < 60
                    ? `${exercise.durationSeconds} sec`
                    : `${durationMin} min`

                return (
                  <article
                    key={exercise.id}
                    className="library-view__card"
                    aria-label={`Stretch: ${exercise.name}, ${durationLabel}`}
                    onClick={() => handleCardClick(exercise)}
                    tabIndex={0}
                  >
                    <img
                      src={getImageUrl(exercise.id)}
                      alt=""
                      className="library-view__card-image"
                      width={96}
                      height={72}
                    />
                    <div className="library-view__card-body">
                      <h4 className="library-view__card-name">{exercise.name}</h4>
                      <p className="library-view__card-duration">{durationLabel}</p>
                      <p className="library-view__card-cue">{exercise.instructionCue}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <div className="library-view__dialog-backdrop">
          <div
            ref={dialogRef}
            className="library-view__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${selected.name}`}
            tabIndex={-1}
            onKeyDown={handleDialogKeyDown}
          >
            <header className="library-view__dialog-header">
              <h3 className="library-view__dialog-title">{selected.name}</h3>
              <button
                type="button"
                className="library-view__dialog-close"
                onClick={handleDialogClose}
                aria-label="Close stretch details"
              >
                Close
              </button>
            </header>
            <div className="library-view__dialog-body">
              <img
                src={getImageUrl(selected.id)}
                alt=""
                className="library-view__dialog-image"
                width={160}
                height={120}
              />
              <p className="library-view__dialog-cue">{selected.instructionCue}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

