import type { Exercise, Routine, StructuredInput } from '../types'

/** Curated list of exercises. */
export const EXERCISES: Exercise[] = [
  // Hip / glute openers
  {
    id: 'figure-four',
    name: 'Figure Four Stretch',
    durationSeconds: 45,
    instructionCue:
      'Cross one ankle over the opposite knee, then gently press the raised knee away. Keep your back flat.',
    bodyRegions: ['hip', 'glute', 'piriformis'],
    sensationTypes: ['tight', 'stiff', 'sore'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning'],
    isUnilateral: true,
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    durationSeconds: 45,
    instructionCue:
      'Feet flat, drive through heels to lift hips. Squeeze glutes at the top, then lower with control.',
    bodyRegions: ['glute', 'hip', 'lower-back'],
    sensationTypes: ['tight', 'fatigued', 'sore'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning'],
  },
  {
    id: 'hip-rotations',
    name: 'Hip Circles',
    durationSeconds: 30,
    instructionCue:
      'Stand on one leg, make slow circles with the other knee. Do 5 each direction, then switch sides.',
    bodyRegions: ['hip', 'glute'],
    sensationTypes: ['tight', 'stiff'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning', 'recovery'],
    isUnilateral: true,
  },
  {
    id: 'pigeon-elevated',
    name: 'Elevated Pigeon Pose',
    durationSeconds: 45,
    instructionCue:
      'Front shin across a bench or box, back leg long. Square hips to the front and lean forward until you feel a deep but tolerable stretch.',
    bodyRegions: ['hip', 'glute'],
    sensationTypes: ['tight', 'stiff'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning', 'recovery'],
  },
  {
    id: 'half-kneeling-hip-flexor',
    name: 'Half-Kneeling Hip Flexor',
    durationSeconds: 40,
    instructionCue:
      'Half-kneeling lunge, back knee down. Tuck pelvis slightly, shift weight forward until you feel the front of the hip on the back leg.',
    bodyRegions: ['hip'],
    sensationTypes: ['tight', 'stiff', 'fatigued'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning'],
    isUnilateral: true,
  },
  {
    id: '90-90-hip-rotation',
    name: '90/90 Hip Rotation',
    durationSeconds: 40,
    instructionCue:
      'Sit with front and back legs in 90/90. Gently rotate between sides, keeping chest tall and hips controlled.',
    bodyRegions: ['hip', 'glute'],
    sensationTypes: ['stiff', 'tight'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning', 'recovery'],
    isUnilateral: true,
  },

  // Hamstrings / posterior chain
  {
    id: 'hamstring-stretch',
    name: 'Seated Hamstring Stretch',
    durationSeconds: 45,
    instructionCue:
      'Sit with one leg extended. Hinge at the hip and reach toward your foot. Keep the leg gently straight.',
    bodyRegions: ['hamstring', 'hip'],
    sensationTypes: ['tight', 'stiff', 'sore'],
    trainingContexts: ['match', 'sprint', 'conditioning'],
    isUnilateral: true,
  },
  {
    id: 'supine-hamstring-floss',
    name: 'Supine Hamstring Floss',
    durationSeconds: 40,
    instructionCue:
      'On your back, hold behind the thigh and gently straighten the knee towards the ceiling. Slowly flex and point the ankle to tension and release the back of the leg.',
    bodyRegions: ['hamstring', 'calf'],
    sensationTypes: ['tight', 'stiff'],
    trainingContexts: ['match', 'sprint', 'conditioning', 'recovery'],
    isUnilateral: true,
  },
  {
    id: 'runners-hinge',
    name: "Runner's Hinge",
    durationSeconds: 30,
    instructionCue:
      'Stand in a staggered stance, front leg long. Hinge from the hips over the front leg, keeping spine long and weight in the heel.',
    bodyRegions: ['hamstring', 'hip'],
    sensationTypes: ['tight', 'stiff'],
    trainingContexts: ['match', 'sprint', 'conditioning'],
    isUnilateral: true,
  },
  {
    id: 'worlds-greatest',
    name: "World's Greatest Stretch",
    durationSeconds: 45,
    instructionCue:
      'Lunge with back knee down, rotate torso toward front leg, then reach arm up. Alternate sides.',
    bodyRegions: ['hip', 'lower-back', 'hamstring'],
    sensationTypes: ['tight', 'stiff'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning', 'recovery'],
    isUnilateral: true,
  },

  // Quads
  {
    id: 'quad-stretch',
    name: 'Standing Quad Stretch',
    durationSeconds: 40,
    instructionCue:
      'Stand on one leg, pull the other heel toward your glute. Keep knees close and stand tall.',
    bodyRegions: ['quad', 'hip'],
    sensationTypes: ['tight', 'sore'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning'],
    isUnilateral: true,
  },
  {
    id: 'half-kneeling-quad-hip-flexor',
    name: 'Half-Kneeling Quad + Hip Flexor',
    durationSeconds: 45,
    instructionCue:
      'From a half-kneeling lunge, grab the back foot with the same-side hand or strap. Gently draw heel toward glute while keeping pelvis tucked.',
    bodyRegions: ['quad', 'hip'],
    sensationTypes: ['tight', 'stiff'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning'],
    isUnilateral: true,
  },

  // Calves
  {
    id: 'calf-stretch',
    name: 'Wall Calf Stretch',
    durationSeconds: 40,
    instructionCue: 'Lean into a wall with one leg back, heel down. Hold, then switch sides.',
    bodyRegions: ['calf'],
    sensationTypes: ['tight', 'sore', 'stiff'],
    trainingContexts: ['match', 'sprint', 'conditioning'],
    isUnilateral: true,
  },
  {
    id: 'bent-knee-calf-stretch',
    name: 'Bent-Knee Calf Stretch',
    durationSeconds: 35,
    instructionCue:
      'From a staggered stance at the wall, bend the back knee slightly while keeping the heel down to bias the lower calf.',
    bodyRegions: ['calf'],
    sensationTypes: ['tight', 'stiff'],
    trainingContexts: ['match', 'sprint', 'conditioning', 'recovery'],
    isUnilateral: true,
  },

  // Lower-back / trunk
  {
    id: 'cat-cow',
    name: 'Cat-Cow',
    durationSeconds: 60,
    instructionCue:
      'On all fours, alternate between rounding your spine (cat) and arching it (cow). Move with your breath.',
    bodyRegions: ['lower-back', 'upper-back'],
    sensationTypes: ['tight', 'stiff', 'sore'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning', 'recovery', 'rest'],
  },
  {
    id: 'childs-pose',
    name: "Child's Pose",
    durationSeconds: 60,
    instructionCue:
      'Knees wide, sit hips back to heels, arms extended. Breathe and let the lower back relax.',
    bodyRegions: ['lower-back', 'upper-back', 'hip'],
    sensationTypes: ['tight', 'stiff', 'sore', 'fatigued'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning', 'recovery', 'rest'],
  },
  {
    id: 'supine-knees-to-chest',
    name: 'Supine Knees-to-Chest',
    durationSeconds: 40,
    instructionCue:
      'On your back, gently hug both knees toward the chest and let the low back relax into the floor.',
    bodyRegions: ['lower-back'],
    sensationTypes: ['tight', 'stiff', 'fatigued'],
    trainingContexts: ['match', 'sprint', 'strength', 'conditioning', 'recovery', 'rest'],
  },
]

/** Predefined routines keyed by focus (used for matching + fallback). */
const ROUTINES: Record<string, Routine> = (() => {
  const byId = (id: string) => EXERCISES.find((e) => e.id === id)!
  return {
    hip: {
      id: 'routine-hip',
      name: 'Hip & glute recovery',
      exercises: [byId('figure-four'), byId('glute-bridge'), byId('hip-rotations'), byId('childs-pose')],
      totalDurationSeconds: 240,
    },
    'lower-back': {
      id: 'routine-lower-back',
      name: 'Lower back recovery',
      exercises: [byId('cat-cow'), byId('childs-pose'), byId('glute-bridge')],
      totalDurationSeconds: 210,
    },
    hamstring: {
      id: 'routine-hamstring',
      name: 'Hamstring recovery',
      exercises: [byId('hamstring-stretch'), byId('worlds-greatest'), byId('childs-pose')],
      totalDurationSeconds: 210,
    },
    glute: {
      id: 'routine-glute',
      name: 'Glute recovery',
      exercises: [byId('figure-four'), byId('glute-bridge'), byId('hip-rotations')],
      totalDurationSeconds: 120,
    },
    piriformis: {
      id: 'routine-piriformis',
      name: 'Hip & piriformis recovery',
      exercises: [byId('figure-four'), byId('glute-bridge'), byId('childs-pose')],
      totalDurationSeconds: 210,
    },
    quad: {
      id: 'routine-quad',
      name: 'Quad & hip recovery',
      exercises: [byId('quad-stretch'), byId('hip-rotations'), byId('worlds-greatest')],
      totalDurationSeconds: 175,
    },
    calf: {
      id: 'routine-calf',
      name: 'Calf recovery',
      exercises: [byId('calf-stretch'), byId('hamstring-stretch'), byId('childs-pose')],
      totalDurationSeconds: 205,
    },
    'upper-back': {
      id: 'routine-upper-back',
      name: 'Upper back recovery',
      exercises: [byId('cat-cow'), byId('childs-pose')],
      totalDurationSeconds: 120,
    },
    'full-body': {
      id: 'routine-full-body',
      name: 'General recovery',
      exercises: [byId('childs-pose'), byId('cat-cow'), byId('worlds-greatest'), byId('glute-bridge')],
      totalDurationSeconds: 270,
    },
  }
})()

/**
 * Get a recovery routine for the given structured input and target duration.
 * Matches by body region and uses durationMinutes to influence how many stretches are included.
 * Falls back to a general routine when no specific routine exists for the region.
 */
export function getRoutine(input: StructuredInput, durationMinutes: number): Routine {
  const key = input.bodyRegion === 'full-body' ? 'full-body' : input.bodyRegion
  const template = ROUTINES[key] ?? ROUTINES['full-body']

  // Simple mapping from requested minutes to an approximate exercise count.
  const minutes = Math.max(1, durationMinutes || 0)
  const desiredCount = minutes <= 6 ? 4 : minutes <= 11 ? 6 : 8

  // Start from the template's exercises as anchors, if present.
  const selected: Exercise[] = template.exercises ? [...template.exercises] : []
  const usedIds = new Set(selected.map((e) => e.id))

  // Prefer exercises that match the primary body region; fall back to all exercises if needed.
  const regionMatches = EXERCISES.filter((e) => e.bodyRegions.includes(input.bodyRegion))
  const primaryPool = regionMatches.length > 0 ? regionMatches : EXERCISES

  // Helper to derive a simple “primary pattern” key for diversity checks.
  const primaryKey = (exercise: Exercise) => exercise.bodyRegions[0] ?? 'unknown'

  // First pass: prefer spreading out primary patterns when possible.
  for (const exercise of primaryPool) {
    if (selected.length >= desiredCount) break
    if (usedIds.has(exercise.id)) continue

    const last = selected[selected.length - 1]
    const samePrimaryAsLast = last && primaryKey(last) === primaryKey(exercise)

    if (samePrimaryAsLast) {
      // Check whether there exists an unused candidate with a different primary key.
      const hasAlternative = primaryPool.some(
        (candidate) =>
          !usedIds.has(candidate.id) && primaryKey(candidate) !== primaryKey(last)
      )
      if (hasAlternative) {
        continue
      }
    }

    selected.push(exercise)
    usedIds.add(exercise.id)
  }

  // Second pass: if we still need more to hit the desired count, fill from remaining pool
  // without the diversity constraint (still respecting uniqueness).
  if (selected.length < desiredCount) {
    for (const exercise of primaryPool) {
      if (selected.length >= desiredCount) break
      if (usedIds.has(exercise.id)) continue
      selected.push(exercise)
      usedIds.add(exercise.id)
    }
  }

  // Guarantee at least one exercise even in edge cases.
  const finalExercises =
    selected.length > 0
      ? selected
      : primaryPool.slice(0, Math.min(desiredCount, primaryPool.length))

  const totalDurationSeconds = finalExercises.reduce(
    (sum, exercise) => sum + exercise.durationSeconds,
    0
  )

  return {
    id: template.id,
    name: template.name,
    exercises: finalExercises,
    totalDurationSeconds,
  }
}
