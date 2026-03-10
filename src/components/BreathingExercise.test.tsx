import { render, screen, act } from '@testing-library/react'
import BreathingExercise from './BreathingExercise'

describe('BreathingExercise', () => {
  it('renders title and phase', () => {
    render(<BreathingExercise onFinish={() => {}} />)
    expect(screen.getByText('Box breathing')).toBeInTheDocument()
    expect(screen.getByText(/1 minute · 4-4-4-4/)).toBeInTheDocument()
    expect(screen.getByText('Breathe in')).toBeInTheDocument()
    expect(screen.getByText(/s left/)).toBeInTheDocument()
  })

  it('calls onFinish after timer ends', () => {
    jest.useFakeTimers()
    const onFinish = jest.fn()
    render(<BreathingExercise onFinish={onFinish} />)
    expect(onFinish).not.toHaveBeenCalled()
    act(() => {
      jest.advanceTimersByTime(61_000)
    })
    expect(onFinish).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })
})
