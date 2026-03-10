import { getSessionsForCurrentUser, type RecoverySession } from './sessionLogging'

const CSV_HEADER = [
  'userId',
  'sessionId',
  'dateTime',
  'trainingContext',
  'bodyRegion',
  'side',
  'sensationType',
  'routineId',
  'routineName',
  'durationMinutes',
  'totalDurationSeconds',
  'exerciseIds',
]

export function sessionsToCsv(sessions: RecoverySession[]): string {
  const lines = [CSV_HEADER.join(',')]

  sessions.forEach((s) => {
    const row = [
      s.userId,
      s.sessionId,
      s.dateTime,
      s.trainingContext,
      s.bodyRegion,
      s.side,
      s.sensationType,
      s.routineId,
      s.routineName.replace(/"/g, '""'),
      String(s.durationMinutes),
      String(s.totalDurationSeconds),
      s.exerciseIds.join(';'),
    ]
    lines.push(row.map((value) => `"${value}"`).join(','))
  })

  return lines.join('\n')
}

export function buildCsvForCurrentUser(): string {
  const sessions = getSessionsForCurrentUser()
  return sessionsToCsv(sessions)
}

