import { render, screen, fireEvent } from '@testing-library/react'
import RoutineOverview from './RoutineOverview'
import type { Routine, StructuredInput } from '../types'

const mockRoutine: Routine = {
  id: 'r1',
  name: 'Hip recovery',
  totalDurationSeconds: 300,
  exercises: [
    {
      id: 'figure-four',
      name: 'Figure Four Stretch',
      durationSeconds: 45,
      instructionCue: 'Cross ankle over knee.',
      bodyRegions: ['hip'],
      sensationTypes: ['tight'],
      trainingContexts: ['sprint'],
      isUnilateral: true,
    },
    {
      id: 'glute-bridge',
      name: 'Glute Bridge',
      durationSeconds: 60,
      instructionCue: 'Lift hips.',
      bodyRegions: ['glute'],
      sensationTypes: ['sore'],
      trainingContexts: ['sprint'],
    },
  ],
}

const mockStructuredInput: StructuredInput = {
  bodyRegion: 'hip',
  side: 'left',
  sensationType: 'tight',
  trainingContext: 'sprint',
}

describe('RoutineOverview', () => {
  it('renders routine name and total time', () => {
    render(<RoutineOverview routine={mockRoutine} onBegin={() => {}} />)
    expect(screen.getByText('Hip recovery')).toBeInTheDocument()
    expect(screen.getByText(/Total: ~5 min/)).toBeInTheDocument()
  })

  it('shows a side-focus note when StructuredInput.side is left or right', () => {
    render(
      <RoutineOverview
        routine={mockRoutine}
        onBegin={() => {}}
        structuredInput={mockStructuredInput}
      />
    )
    expect(
      screen.getByText(/You mentioned more discomfort on your left side/i)
    ).toBeInTheDocument()
  })

  it('renders each exercise with image, name, and duration', () => {
    const { container } = render(<RoutineOverview routine={mockRoutine} onBegin={() => {}} />)
    expect(screen.getByText('Figure Four Stretch')).toBeInTheDocument()
    expect(screen.getByText('45 sec each side')).toBeInTheDocument()
    expect(screen.getByText('Glute Bridge')).toBeInTheDocument()
    expect(screen.getByText('1 min')).toBeInTheDocument()
    const images = container.querySelectorAll('.routine-overview__image')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', '/images/figure-four.png')
    expect(images[1]).toHaveAttribute('src', '/images/glute-bridge.jpg')
  })

  it('calls onBegin when Begin button is clicked', () => {
    const onBegin = jest.fn()
    render(<RoutineOverview routine={mockRoutine} onBegin={onBegin} />)
    fireEvent.click(screen.getByRole('button', { name: /Begin routine/i }))
    expect(onBegin).toHaveBeenCalledTimes(1)
  })

  it('renders Begin button with accessible label', () => {
    render(<RoutineOverview routine={mockRoutine} onBegin={() => {}} />)
    const btn = screen.getByRole('button', { name: /Begin routine/i })
    expect(btn).toHaveAttribute('aria-label', 'Begin routine')
  })
})
