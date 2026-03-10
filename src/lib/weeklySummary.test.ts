import type { RecoverySession } from './sessionLogging'
import { getCurrentWeekRange, filterSessionsToRange, computeWeeklySummary } from './weeklySummary'

function makeSession(overrides: Partial<RecoverySession>): RecoverySession {
  const base: RecoverySession = {
    userId: 'user@example.com',
    sessionId: 's1',
    dateTime: new Date().toISOString(),
    trainingContext: 'sprint',
    bodyRegion: 'hip',
    side: 'both',
    sensationType: 'tight',
    routineId: 'routine-hip',
    routineName: 'Hip recovery',
    durationMinutes: 5,
    totalDurationSeconds: 300,
    exerciseIds: ['figure-four'],
  }
  return { ...base, ...overrides }
}

describe('weeklySummary', () => {
  it('defines a rolling 7-day current week range', () => {
    const now = new Date('2026-03-10T12:00:00.000Z')
    const { start, end } = getCurrentWeekRange(now)
    expect(end.getUTCDate()).toBe(11)
    expect(start.getUTCDate()).toBe(4)
  })

  it('filters sessions to the provided range', () => {
    const now = new Date('2026-03-10T12:00:00.000Z')
    const range = getCurrentWeekRange(now)

    const inside = makeSession({ sessionId: 'inside', dateTime: '2026-03-08T10:00:00.000Z' })
    const before = makeSession({ sessionId: 'before', dateTime: '2026-03-01T10:00:00.000Z' })
    const after = makeSession({ sessionId: 'after', dateTime: '2026-03-20T10:00:00.000Z' })

    const filtered = filterSessionsToRange([inside, before, after], range)
    expect(filtered.map((s) => s.sessionId)).toEqual(['inside'])
  })

  it('computes weekly summary metrics from sessions', () => {
    const now = new Date('2026-03-10T12:00:00.000Z')
    const range = getCurrentWeekRange(now)

    const sessions: RecoverySession[] = [
      makeSession({
        sessionId: 's1',
        dateTime: '2026-03-08T10:00:00.000Z',
        bodyRegion: 'hamstring',
        trainingContext: 'sprint',
        totalDurationSeconds: 300,
      }),
      makeSession({
        sessionId: 's2',
        dateTime: '2026-03-09T10:00:00.000Z',
        bodyRegion: 'hamstring',
        trainingContext: 'match',
        totalDurationSeconds: 180,
      }),
      makeSession({
        sessionId: 's3',
        dateTime: '2026-03-09T18:00:00.000Z',
        bodyRegion: 'hip',
        trainingContext: 'sprint',
        totalDurationSeconds: 240,
      }),
    ]

    const summary = computeWeeklySummary(sessions, range)

    expect(summary.totalSessions).toBe(3)
    expect(summary.totalRecoverySeconds).toBe(300 + 180 + 240)

    // hamstring should be the top region
    expect(summary.topBodyRegions[0]).toEqual({ region: 'hamstring', count: 2 })

    // training contexts
    expect(summary.trainingContextCounts['sprint']).toBe(2)
    expect(summary.trainingContextCounts['match']).toBe(1)

    // sessions by day (2 sessions on the 9th)
    expect(summary.sessionsByDay['2026-03-08']).toBe(1)
    expect(summary.sessionsByDay['2026-03-09']).toBe(2)
  })
})

