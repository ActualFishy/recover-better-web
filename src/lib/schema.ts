import type { BodyRegion, Side, SensationType, TrainingContext } from '../types'

/**
 * Schema for the AI coach's structured output (when it has enough info to generate a routine).
 * The AI may embed this in a JSON block in its message.
 */
export interface CoachStructuredResponse {
  /** Normalized body region. */
  bodyRegion: BodyRegion
  /** Which side (left, right, or both). */
  side: Side
  /** Sensation type the athlete described. */
  sensationType: SensationType
  /** Training context (what they did today). */
  trainingContext: TrainingContext
  /** When true, we have enough info to generate a routine. */
  readyToGenerate: boolean
  /** Optional: intensity (e.g. "light" | "moderate" | "strong") - not required for routine selection. */
  intensity?: string
  /** Optional: when discomfort started - not required for routine selection. */
  timing?: string
}

/** Valid body region strings (for parsing). */
export const BODY_REGIONS: BodyRegion[] = [
  'lower-back', 'hip', 'hamstring', 'glute', 'piriformis',
  'upper-back', 'quad', 'calf', 'full-body',
]

/** Valid sides. */
export const SIDES: Side[] = ['left', 'right', 'both']

/** Valid sensation types. */
export const SENSATION_TYPES: SensationType[] = [
  'tight', 'sore', 'stiff', 'fatigued', 'sharp',
]

/** Valid training contexts. */
export const TRAINING_CONTEXTS: TrainingContext[] = [
  'match', 'sprint', 'strength', 'conditioning', 'recovery', 'rest',
]
