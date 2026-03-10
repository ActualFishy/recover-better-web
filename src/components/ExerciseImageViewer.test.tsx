import { render, screen, fireEvent } from '@testing-library/react'
import { EXERCISES } from '../data/exercises'
import ExerciseImageViewer from './ExerciseImageViewer'

describe('ExerciseImageViewer', () => {
  const exercise = EXERCISES[0]
  const defaultProps = {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    description: exercise.instructionCue,
  }

  it('renders thumbnail area (image or placeholder)', () => {
    render(<ExerciseImageViewer {...defaultProps} />)
    const thumbnail = document.querySelector('.exercise-image-viewer__thumbnail')
    const placeholder = document.querySelector('.exercise-image-viewer__placeholder')
    expect(thumbnail ?? placeholder).toBeInTheDocument()
  })

  it('renders an Expand button', () => {
    render(<ExerciseImageViewer {...defaultProps} />)
    expect(screen.getByRole('button', { name: /Expand image/i })).toBeInTheDocument()
  })

  it('opens expanded view when Expand is clicked', () => {
    render(<ExerciseImageViewer {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /Expand image/i }))
    expect(screen.getByRole('dialog', { name: /Exercise image and description/i })).toBeInTheDocument()
  })

  it('shows description in expanded view', () => {
    render(<ExerciseImageViewer {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /Expand image/i }))
    expect(screen.getByText(exercise.instructionCue)).toBeInTheDocument()
  })

  it('closes expanded view when Close is clicked', () => {
    render(<ExerciseImageViewer {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /Expand image/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders without throwing for every exercise in the database', () => {
    EXERCISES.forEach((ex) => {
      expect(() =>
        render(
          <ExerciseImageViewer
            exerciseId={ex.id}
            exerciseName={ex.name}
            description={ex.instructionCue}
          />
        )
      ).not.toThrow()
    })
  })
})
