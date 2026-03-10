import { useState, useRef, useEffect } from 'react'
import { getImageUrl } from '../lib/exerciseImages'

interface ExerciseImageViewerProps {
  exerciseId: string
  exerciseName: string
  /** How to do the stretch (e.g. instruction cue). Shown in expanded view. */
  description: string
}

export default function ExerciseImageViewer({
  exerciseId,
  exerciseName,
  description,
}: ExerciseImageViewerProps) {
  const [imageError, setImageError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const imageUrl = getImageUrl(exerciseId)

  useEffect(() => {
    if (isExpanded && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isExpanded])

  function handleClose() {
    setIsExpanded(false)
    expandButtonRef.current?.focus()
  }

  const showPlaceholder = imageError

  return (
    <div className="exercise-image-viewer">
      <div className="exercise-image-viewer__thumbnail-wrap">
        {showPlaceholder ? (
          <div
            className="exercise-image-viewer__placeholder"
            aria-hidden
          >
            <span className="exercise-image-viewer__placeholder-text">No image</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${exerciseName} stretch`}
            className="exercise-image-viewer__thumbnail"
            onError={() => setImageError(true)}
          />
        )}
        <button
          ref={expandButtonRef}
          type="button"
          className="exercise-image-viewer__expand"
          onClick={() => setIsExpanded(true)}
          aria-label="Expand image"
        >
          Expand
        </button>
      </div>

      {isExpanded && (
        <div
          className="exercise-image-viewer__overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Exercise image and description"
        >
          <div className="exercise-image-viewer__modal">
            {showPlaceholder ? (
              <div className="exercise-image-viewer__modal-placeholder">
                <span>No image</span>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={`${exerciseName} stretch`}
                className="exercise-image-viewer__modal-image"
              />
            )}
            <p className="exercise-image-viewer__description">{description}</p>
            <button
              ref={closeButtonRef}
              type="button"
              className="exercise-image-viewer__close"
              onClick={handleClose}
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
