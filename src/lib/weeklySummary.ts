import type { RecoverySession } from './sessionLogging'

export interface WeeklySummary {
  totalSessions: number
  totalRecoverySeconds: number
  topBodyRegions: { region: string; count: number }[]
  trainingContextCounts: Record<string, number>
  sessionsByDay: Record<string, number>
}

export interface WeekRange {
  start: Date
  end: Date
}

/**
 * Define "current week" as a rolling last-7-days window ending now.
 * This keeps the summary simple and avoids calendar-week edge cases.
 */
export function getCurrentWeekRange(now: Date = new Date()): WeekRange {
  const end = new Date(now)
  const start = new Date(now)
  start.setDate(start.getDate() - 6)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export function filterSessionsToRange(
  sessions: RecoverySession[],
  range: WeekRange
): RecoverySession[] {
  return sessions.filter((s) => {
    const d = new Date(s.dateTime)
    return d >= range.start && d <= range.end
  })
}

export function computeWeeklySummary(
  sessions: RecoverySession[],
  range: WeekRange
): WeeklySummary {
  const filtered = filterSessionsToRange(sessions, range)
  const totalSessions = filtered.length
  const totalRecoverySeconds = filtered.reduce(
    (sum, s) => sum + (s.totalDurationSeconds || s.durationMinutes * 60),
    0
  )

  const regionCounts: Record<string, number> = {}
  const trainingContextCounts: Record<string, number> = {}
  const sessionsByDay: Record<string, number> = {}

  const dayKey = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toISOString().slice(0, 10) // YYYY-MM-DD
  }

  filtered.forEach((s) => {
    regionCounts[s.bodyRegion] = (regionCounts[s.bodyRegion] ?? 0) + 1
    trainingContextCounts[s.trainingContext] =
      (trainingContextCounts[s.trainingContext] ?? 0) + 1

    const key = dayKey(s.dateTime)
    sessionsByDay[key] = (sessionsByDay[key] ?? 0) + 1
  })

  const topBodyRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([region, count]) => ({ region, count }))

  return {
    totalSessions,
    totalRecoverySeconds,
    topBodyRegions,
    trainingContextCounts,
    sessionsByDay,
  }
}

