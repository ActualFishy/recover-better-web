// Shared types for the Recovery Assistant app.

/** Body regions the user can report (and we match exercises to). */
export type BodyRegion =
  | 'lower-back'
  | 'hip'
  | 'hamstring'
  | 'glute'
  | 'piriformis'
  | 'upper-back'
  | 'quad'
  | 'calf'
  | 'full-body'

/** Side of body (for unilateral exercises). */
export type Side = 'left' | 'right' | 'both'

/** Sensation type the user describes. */
export type SensationType =
  | 'tight'
  | 'sore'
  | 'stiff'
  | 'fatigued'
  | 'sharp'

/** Training context (type of activity that caused the load). */
export type TrainingContext =
  | 'match'
  | 'sprint'
  | 'strength'
  | 'conditioning'
  | 'recovery'
  | 'rest'

/** Single exercise in the curated database. */
export interface Exercise {
  id: string
  name: string
  durationSeconds: number
  instructionCue: string
  /** Body regions this exercise targets (for matching). */
  bodyRegions: BodyRegion[]
  /** Sensation types this exercise is suitable for. */
  sensationTypes: SensationType[]
  /** Training contexts this exercise fits (e.g. post-sprint). */
  trainingContexts: TrainingContext[]
  /**
   * Whether this exercise is typically performed one side at a time (e.g. left/right leg).
   * When true, the UI can hint that both sides should be done.
   */
  isUnilateral?: boolean
}

/** A recovery routine: ordered list of exercises, ~5 min total. */
export interface Routine {
  id: string
  name: string
  exercises: Exercise[]
  /** Total duration in seconds (target ~300). */
  totalDurationSeconds: number
}

/** Structured input from the conversation (used to query for a routine). */
export interface StructuredInput {
  bodyRegion: BodyRegion
  side: Side
  sensationType: SensationType
  trainingContext: TrainingContext
}

/**
 * Inline action attached to an assistant message, typically rendered as a small button
 * inside the chat (e.g., 5/10/15 minute duration choices).
 */
export interface ChatAction {
  /** Human-readable label shown in the UI, e.g. "5 min". */
  label: string
  /** Numeric value in minutes or other units, used by the app logic. */
  valueMinutes: number
  /** Whether this action is currently selected/active in the UI. */
  selected?: boolean
}

/** One message in the chat (user or assistant). */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  /**
   * Optional inline actions associated with this message. When present on an assistant
   * message, the UI can render them as buttons (e.g., recovery duration choices).
   */
  actions?: ChatAction[]
}
