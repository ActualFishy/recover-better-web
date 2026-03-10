import { render, screen } from '@testing-library/react'
import SessionHistoryList from './SessionHistoryList'
import type { RecoverySession } from '../lib/sessionLogging'

const baseSession: RecoverySession = {
  userId: 'user@example.com',
  sessionId: 's1',
  dateTime: '2026-03-08T10:00:00.000Z',
  trainingContext: 'sprint',
  bodyRegion: 'hamstring',
  side: 'both',
  sensationType: 'tight',
  routineId: 'routine-hip',
  routineName: 'Hip recovery',
  durationMinutes: 5,
  totalDurationSeconds: 300,
  exerciseIds: ['figure-four'],
}

describe('SessionHistoryList', () => {
  it('renders empty state when there are no sessions', () => {
    render(<SessionHistoryList sessions={[]} />)
    expect(
      screen.getByText(/No recovery sessions logged yet for this week/i)
    ).toBeInTheDocument()
  })

  it('renders a list of sessions when provided', () => {
    const sessions: RecoverySession[] = [
      baseSession,
      {
        ...baseSession,
        sessionId: 's2',
        dateTime: '2026-03-09T11:00:00.000Z',
        trainingContext: 'match',
        bodyRegion: 'hip',
        routineName: 'Hip & glute recovery',
        durationMinutes: 10,
      },
    ]

    render(<SessionHistoryList sessions={sessions} />)

    expect(screen.getByRole('heading', { name: /This week's sessions/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})

