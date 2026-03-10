import { render, screen, fireEvent } from '@testing-library/react'
import ExerciseCard from './ExerciseCard'
import type { Exercise } from '../types'

const mockExercise: Exercise = {
  id: 'test-1',
  name: 'Figure Four Stretch',
  durationSeconds: 45,
  instructionCue: 'Cross one ankle over the opposite knee.',
  bodyRegions: ['hip'],
  sensationTypes: ['tight'],
  trainingContexts: ['sprint'],
  isUnilateral: true,
}

describe('ExerciseCard', () => {
  it('renders the image viewer (thumbnail or placeholder)', () => {
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={() => {}}
      />
    )
    const thumbnail = document.querySelector('.exercise-image-viewer__thumbnail')
    const placeholder = document.querySelector('.exercise-image-viewer__placeholder')
    expect(thumbnail ?? placeholder).toBeInTheDocument()
  })

  it('displays exercise name, duration, and instruction cue', () => {
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={() => {}}
      />
    )
    expect(screen.getByText('Figure Four Stretch')).toBeInTheDocument()
    expect(screen.getByText(/45 sec/)).toBeInTheDocument()
    expect(
      screen.getByText(/You’ll do both sides · start on right/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Cross one ankle over the opposite knee/)).toBeInTheDocument()
  })

  it('calls onComplete when Done is clicked', () => {
    const onComplete = jest.fn()
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={onComplete}
        onSkip={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Mark .* complete/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('calls onSkip when Skip is clicked', () => {
    const onSkip = jest.fn()
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={onSkip}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Skip .*/i }))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })

  it('shows buffer "Get in position" and count when timerPhase is buffer', () => {
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={() => {}}
        timerPhase="buffer"
        timerSeconds={3}
      />
    )
    expect(screen.getByText('Get in position')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows countdown in 0:00 format when timerPhase is countdown', () => {
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={() => {}}
        timerPhase="countdown"
        timerSeconds={45}
      />
    )
    expect(screen.getByText('0:45')).toBeInTheDocument()
  })

  it('timer region has aria-live and aria-label for accessibility', () => {
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={() => {}}
        timerPhase="countdown"
        timerSeconds={30}
      />
    )
    const timer = document.querySelector('.exercise-card__timer')
    expect(timer).toHaveAttribute('aria-live', 'polite')
    expect(timer).toHaveAttribute('aria-label', '0:30 remaining')
  })

  it('shows side-specific hints when activeSide is provided', () => {
    const { rerender } = render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={() => {}}
        activeSide="right"
      />
    )
    expect(
      screen.getByText(/Right side · you’ll switch to the left next/i)
    ).toBeInTheDocument()

    rerender(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={() => {}}
        onSkip={() => {}}
        activeSide="left"
      />
    )
    expect(
      screen.getByText(/Left side · finish this side/i)
    ).toBeInTheDocument()
  })

  it('Done and Skip work when the image viewer is present', () => {
    const onComplete = jest.fn()
    const onSkip = jest.fn()
    render(
      <ExerciseCard
        exercise={mockExercise}
        onComplete={onComplete}
        onSkip={onSkip}
      />
    )
    const thumbnail = document.querySelector('.exercise-image-viewer__thumbnail')
    const placeholder = document.querySelector('.exercise-image-viewer__placeholder')
    expect(thumbnail ?? placeholder).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Mark .* complete/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: /Skip .*/i }))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
