import { logRecoverySession, getSessionsForCurrentUser } from './sessionLogging'
import { signup, logout } from './auth'
import type { StructuredInput, Routine } from '../types'

describe('sessionLogging', () => {
  const input: StructuredInput = {
    bodyRegion: 'hip',
    side: 'left',
    sensationType: 'tight',
    trainingContext: 'sprint',
  }

  const routine: Routine = {
    id: 'routine-hip',
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
      },
    ],
  }

  beforeEach(async () => {
    window.localStorage.clear()
    await logout().catch(() => {})
  })

  it('does nothing when no user is logged in', async () => {
    await logRecoverySession({ input, routine, durationMinutes: 5 })
    expect(getSessionsForCurrentUser()).toHaveLength(0)
  })

  it('saves a session for the current user', async () => {
    await signup('user@example.com', 'password')
    await logRecoverySession({ input, routine, durationMinutes: 5 })

    const sessions = getSessionsForCurrentUser()
    expect(sessions).toHaveLength(1)
    const s = sessions[0]
    expect(s.userId).toBe('user@example.com')
    expect(s.bodyRegion).toBe('hip')
    expect(s.trainingContext).toBe('sprint')
    expect(s.routineId).toBe('routine-hip')
    expect(s.exerciseIds).toEqual(['figure-four'])
  })

  it('appends multiple sessions for the same user', async () => {
    await signup('user@example.com', 'password')
    await logRecoverySession({ input, routine, durationMinutes: 5 })
    await logRecoverySession({ input, routine, durationMinutes: 10 })

    const sessions = getSessionsForCurrentUser()
    expect(sessions).toHaveLength(2)
    expect(new Set(sessions.map((s) => s.sessionId)).size).toBe(2)
  })

  it('swallows storage errors so UX can continue', async () => {
    await signup('user@example.com', 'password')
    const originalSetItem = window.localStorage.setItem
    window.localStorage.setItem = jest.fn(() => {
      throw new Error('quota exceeded')
    }) as unknown as typeof originalSetItem

    await expect(
      logRecoverySession({ input, routine, durationMinutes: 5 })
    ).resolves.toBeUndefined()

    // Restore original implementation; the important part is that no error escaped.
    window.localStorage.setItem = originalSetItem
  })
})

