import { EXERCISES } from '../data/exercises'

/** Exercise ids that have images in public/images (same as exercise database ids). */
export const KNOWN_EXERCISE_IDS: string[] = EXERCISES.map((e) => e.id)

/** Base path for exercise images (served from public folder). */
const IMAGES_BASE = '/images'

/** Exercise ids that use .png instead of .jpg (e.g. custom assets). */
const PNG_IDS = new Set(['figure-four'])

/**
 * Returns the URL for an exercise image. Place images in public/images/{exerciseId}.jpg
 * (or .png for ids in PNG_IDS). Use the same exercise id as in the database (e.g. cat-cow, figure-four).
 */
export function getImageUrl(exerciseId: string): string {
  const id = KNOWN_EXERCISE_IDS.includes(exerciseId) ? exerciseId : 'fallback'
  const ext = PNG_IDS.has(id) ? 'png' : 'jpg'
  return `${IMAGES_BASE}/${id}.${ext}`
}
