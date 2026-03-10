import { render, screen, fireEvent, act } from '@testing-library/react'
import RoutineView from './RoutineView'
import type { Routine } from '../types'

const mockRoutine: Routine = {
  id: 'r1',
  name: 'Hip recovery',
  totalDurationSeconds: 120,
  exercises: [
    {
      id: 'e1',
      name: 'Figure Four',
      durationSeconds: 60,
      instructionCue: 'Cross ankle over knee.',
      bodyRegions: ['hip'],
      sensationTypes: ['tight'],
      trainingContexts: ['sprint'],
      isUnilateral: true,
    },
    {
      id: 'e2',
      name: 'Glute Bridge',
      durationSeconds: 45,
      instructionCue: 'Lift hips.',
      bodyRegions: ['glute'],
      sensationTypes: ['sore'],
      trainingContexts: ['sprint'],
    },
  ],
}

const mockStructuredInput = {
  bodyRegion: 'hip' as const,
  side: 'right' as const,
  sensationType: 'tight' as const,
  trainingContext: 'sprint' as const,
}

/** Advance past overview (click Begin) and get-ready (3s). Use with jest.useFakeTimers(). */
function advanceToFirstCard() {
  fireEvent.click(screen.getByRole('button', { name: /Begin routine/i }))
  expect(screen.getByText('Get ready')).toBeInTheDocument()
  act(() => { jest.advanceTimersByTime(1000) })
  act(() => { jest.advanceTimersByTime(1000) })
  act(() => { jest.advanceTimersByTime(1000) })
  act(() => { jest.advanceTimersByTime(100) })
}

describe('RoutineView', () => {
  it('shows overview first with routine name, total time, and Begin button', () => {
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    expect(screen.getByText('Hip recovery')).toBeInTheDocument()
    expect(screen.getByText(/Total: ~2 min/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Begin routine/i })).toBeInTheDocument()
    expect(screen.getByText('Figure Four')).toBeInTheDocument()
    expect(screen.getByText('Glute Bridge')).toBeInTheDocument()
  })

  it('passes structured input into RoutineOverview and shows side-focus note', () => {
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
        structuredInput={mockStructuredInput}
      />
    )
    expect(
      screen.getByText(/You mentioned more discomfort on your right side/i)
    ).toBeInTheDocument()
  })

  it('automatically restarts countdown for second side on unilateral exercises', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
        structuredInput={mockStructuredInput}
      />
    )
    advanceToFirstCard()

    // First side hint should mention "Right side".
    expect(
      screen.getByText(/Right side · you’ll switch to the left next/i)
    ).toBeInTheDocument()

    // Let the card buffer (3s) and first-side countdown (30s) elapse.
    act(() => { jest.advanceTimersByTime(3000) })
    act(() => { jest.advanceTimersByTime(30000) })

    // After first side completes, we should still be on the same exercise,
    // but now showing the second side hint.
    expect(screen.getByText('Figure Four')).toBeInTheDocument()
    expect(
      screen.getByText(/Left side · finish this side/i)
    ).toBeInTheDocument()

    jest.useRealTimers()
  })

  it('shows get-ready step after Begin, then first exercise card', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Begin routine/i }))
    expect(screen.getByText('Get ready')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1000) })
    expect(screen.getByText('2')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1000) })
    expect(screen.getByText('1')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1000) })
    expect(screen.getByText('Figure Four')).toBeInTheDocument()
    expect(screen.getByText(/Exercise 1 of 2/)).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('renders routine name and first exercise after get-ready', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    expect(screen.getByText('Hip recovery')).toBeInTheDocument()
    expect(screen.getByText('Figure Four')).toBeInTheDocument()
    expect(screen.getByText(/Exercise 1 of 2/)).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('advances to next exercise on Done', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    fireEvent.click(screen.getByRole('button', { name: /Mark Figure Four complete/i }))
    expect(screen.getByText('Glute Bridge')).toBeInTheDocument()
    expect(screen.getByText(/Exercise 2 of 2/)).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('shows end choice after last exercise Done', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    fireEvent.click(screen.getByRole('button', { name: /Mark Figure Four complete/i }))
    fireEvent.click(screen.getByRole('button', { name: /Mark Glute Bridge complete/i }))
    expect(screen.getByText('Routine complete')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add 1-minute breathing/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Finish without breathing/ })).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('calls onStartBreathing when Add 1-min breathing is clicked', () => {
    jest.useFakeTimers()
    const onStartBreathing = jest.fn()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={onStartBreathing}
      />
    )
    advanceToFirstCard()
    fireEvent.click(screen.getByRole('button', { name: /Mark Figure Four complete/i }))
    fireEvent.click(screen.getByRole('button', { name: /Mark Glute Bridge complete/i }))
    fireEvent.click(screen.getByRole('button', { name: /Add 1-minute breathing/ }))
    expect(onStartBreathing).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })

  it('calls onFinishRoutine when Finish without breathing is clicked', () => {
    jest.useFakeTimers()
    const onFinishRoutine = jest.fn()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={onFinishRoutine}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    fireEvent.click(screen.getByRole('button', { name: /Mark Figure Four complete/i }))
    fireEvent.click(screen.getByRole('button', { name: /Mark Glute Bridge complete/i }))
    fireEvent.click(screen.getByRole('button', { name: /Finish without breathing/ }))
    expect(onFinishRoutine).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })

  it('each exercise card shows image viewer; Done and Skip advance routine', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    const thumbnail = document.querySelector('.exercise-image-viewer__thumbnail')
    const placeholder = document.querySelector('.exercise-image-viewer__placeholder')
    expect(thumbnail ?? placeholder).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Mark Figure Four complete/i }))
    expect(screen.getByText('Glute Bridge')).toBeInTheDocument()
    expect(document.querySelector('.exercise-image-viewer__thumbnail') ?? document.querySelector('.exercise-image-viewer__placeholder')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Skip Glute Bridge/i }))
    expect(screen.getByText('Routine complete')).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('shows buffer "Get in position" and 3-2-1 then countdown on first card', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    expect(screen.getByText('Get in position')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1000) })
    expect(screen.getByText('2')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1000) })
    expect(screen.getByText('1')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1000) })
    expect(screen.getByText('0:30')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1000) })
    expect(screen.getByText('0:29')).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('does not auto-advance when countdown reaches 0; Done advances', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    act(() => { jest.advanceTimersByTime(3000) })
    expect(screen.getByText('0:30')).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(30000) })
    expect(screen.getByText('Figure Four')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Mark Figure Four complete/i }))
    expect(screen.getByText('Glute Bridge')).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('Done during buffer advances to next card', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    expect(screen.getByText('Get in position')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Mark Figure Four complete/i }))
    expect(screen.getByText('Glute Bridge')).toBeInTheDocument()
    expect(screen.getByText(/Exercise 2 of 2/)).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('Skip during countdown advances to next card', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    act(() => { jest.advanceTimersByTime(3000) })
    expect(screen.getByText('0:30')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Skip Figure Four/i }))
    expect(screen.getByText('Glute Bridge')).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('shows empty routine message and Finish when routine has no exercises', () => {
    const emptyRoutine: Routine = {
      id: 'empty',
      name: 'Empty',
      totalDurationSeconds: 0,
      exercises: [],
    }
    const onFinishRoutine = jest.fn()
    render(
      <RoutineView
        routine={emptyRoutine}
        onFinishRoutine={onFinishRoutine}
        onStartBreathing={() => {}}
      />
    )
    expect(screen.getByText(/No exercises in this routine/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Finish/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Finish/i }))
    expect(onFinishRoutine).toHaveBeenCalledTimes(1)
  })

  it('shows overview first (not first card) when routine has exercises', () => {
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /Begin routine/i })).toBeInTheDocument()
    expect(screen.getByText('Figure Four')).toBeInTheDocument()
    expect(screen.queryByText(/Exercise 1 of 2/)).not.toBeInTheDocument()
  })

  it('get-ready step has aria-live for screen reader announcements', () => {
    jest.useFakeTimers()
    render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Begin routine/i }))
    const getReady = document.querySelector('.routine-view__get-ready')
    expect(getReady).toHaveAttribute('aria-live', 'polite')
    jest.useRealTimers()
  })

  it('clears timer when unmounting so no interval runs after unmount', () => {
    jest.useFakeTimers()
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
    const { unmount } = render(
      <RoutineView
        routine={mockRoutine}
        onFinishRoutine={() => {}}
        onStartBreathing={() => {}}
      />
    )
    advanceToFirstCard()
    expect(screen.getByText('Get in position')).toBeInTheDocument()
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
    act(() => { jest.advanceTimersByTime(60000) })
    clearIntervalSpy.mockRestore()
    jest.useRealTimers()
  })
})
