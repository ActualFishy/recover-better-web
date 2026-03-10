import type { StructuredInput } from '../types'
import {
  BODY_REGIONS,
  SIDES,
  SENSATION_TYPES,
  TRAINING_CONTEXTS,
} from './schema'

export interface ExtractionResult {
/** Parsed and validated structured input, or null if missing/invalid.
 * For routine generation we treat a valid bodyRegion as the key requirement and
 * default other fields when missing.
 */
  structured: StructuredInput | null
  /** Whether the coach indicated we have enough info to generate a routine. */
  readyToGenerate: boolean
}

/**
 * Try to find a JSON object in the text (e.g. inside ```json ... ``` or raw {...}).
 */
function extractJsonBlock(text: string): object | null {
  const jsonBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonBlock) {
    try {
      return JSON.parse(jsonBlock[1].trim()) as object
    } catch {
      return null
    }
  }
  const raw = text.match(/\{[\s\S]*\}/)
  if (raw) {
    try {
      return JSON.parse(raw[0]) as object
    } catch {
      return null
    }
  }
  return null
}

/**
 * Validate and normalize a parsed object into CoachStructuredResponse fields.
 */
function validateAndNormalize(obj: Record<string, unknown>): ExtractionResult {
  const bodyRegion =
    typeof obj.bodyRegion === 'string' && BODY_REGIONS.includes(obj.bodyRegion as never)
      ? (obj.bodyRegion as StructuredInput['bodyRegion'])
      : null
  const side = typeof obj.side === 'string' && SIDES.includes(obj.side as never)
    ? (obj.side as StructuredInput['side'])
    : 'both'
  const sensationTypeValid =
    typeof obj.sensationType === 'string' &&
    SENSATION_TYPES.includes(obj.sensationType as never)
  const sensationType: StructuredInput['sensationType'] = sensationTypeValid
    ? (obj.sensationType as StructuredInput['sensationType'])
    : 'tight'
  const trainingContextValid =
    typeof obj.trainingContext === 'string' &&
    TRAINING_CONTEXTS.includes(obj.trainingContext as never)
  const trainingContext: StructuredInput['trainingContext'] = trainingContextValid
    ? (obj.trainingContext as StructuredInput['trainingContext'])
    : 'recovery'

  if (bodyRegion) {
    const readyToGenerate = obj.readyToGenerate === true || !!bodyRegion
    return {
      structured: {
        bodyRegion,
        side,
        sensationType,
        trainingContext,
      },
      readyToGenerate,
    }
  }
  return { structured: null, readyToGenerate: false }
}

/**
 * Extract structured data from an AI coach response.
 * Looks for a JSON block with bodyRegion, side, sensationType, trainingContext, readyToGenerate.
 */
export function extractStructuredData(responseText: string): ExtractionResult {
  const obj = extractJsonBlock(responseText)
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { structured: null, readyToGenerate: false }
  }
  return validateAndNormalize(obj as Record<string, unknown>)
}
