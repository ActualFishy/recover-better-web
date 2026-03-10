import { sessionsToCsv } from './sessionsExport'
import type { RecoverySession } from './sessionLogging'

describe('sessionsExport', () => {
  const base: RecoverySession = {
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

  it('includes a header row and session rows in CSV', () => {
    const csv = sessionsToCsv([base])
    const lines = csv.split('\n')
    expect(lines[0]).toContain('userId,sessionId,dateTime')
    expect(lines[1]).toContain('"user@example.com"')
    expect(lines[1]).toContain('"s1"')
    expect(lines[1]).toContain('"hamstring"')
  })

  it('escapes quotes in routineName', () => {
    const withQuotes: RecoverySession = {
      ...base,
      routineId: 'r2',
      routineName: 'Hip "recovery" plus',
      sessionId: 's2',
    }
    const csv = sessionsToCsv([withQuotes])
    expect(csv).toContain('"Hip ""recovery"" plus"')
  })
})

