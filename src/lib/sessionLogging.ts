import type { StructuredInput, Routine } from '../types'
import { getCurrentUser } from './auth'

export interface RecoverySession {
  userId: string
  sessionId: string
  dateTime: string
  trainingContext: StructuredInput['trainingContext']
  bodyRegion: StructuredInput['bodyRegion']
  side: StructuredInput['side']
  sensationType: StructuredInput['sensationType']
  routineId: string
  routineName: string
  durationMinutes: number
  totalDurationSeconds: number
  exerciseIds: string[]
}

const STORAGE_KEY = 'recovery-assistant:sessions'

function loadAllSessions(): Record<string, RecoverySession[]> {
  if (typeof window === 'undefined') return {}
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, RecoverySession[]>
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function persistAllSessions(map: Record<string, RecoverySession[]>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Best-effort persistence; swallow errors so UX is not blocked.
  }
}

export async function logRecoverySession(options: {
  input: StructuredInput
  routine: Routine
  durationMinutes: number
}): Promise<void> {
  const user = getCurrentUser()
  if (!user) return

  const { input, routine } = options
  const durationMinutes = Math.max(1, options.durationMinutes || 1)

  const all = loadAllSessions()
  const existing = all[user.id] ?? []

  const session: RecoverySession = {
    userId: user.id,
    sessionId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    dateTime: new Date().toISOString(),
    trainingContext: input.trainingContext,
    bodyRegion: input.bodyRegion,
    side: input.side,
    sensationType: input.sensationType,
    routineId: routine.id,
    routineName: routine.name,
    durationMinutes,
    totalDurationSeconds: routine.totalDurationSeconds,
    exerciseIds: routine.exercises.map((e) => e.id),
  }

  all[user.id] = [...existing, session]
  persistAllSessions(all)
}

export function getSessionsForCurrentUser(): RecoverySession[] {
  const user = getCurrentUser()
  if (!user) return []
  const all = loadAllSessions()
  return all[user.id] ?? []
}

