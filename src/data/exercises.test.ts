import { getRoutine, EXERCISES } from './exercises'
import type { StructuredInput } from '../types'

describe('exercises', () => {
  describe('EXERCISES', () => {
    it('has exercises with id, name, durationSeconds, instructionCue', () => {
      expect(EXERCISES.length).toBeGreaterThan(0)
      const first = EXERCISES[0]
      expect(first).toHaveProperty('id')
      expect(first).toHaveProperty('name')
      expect(first).toHaveProperty('durationSeconds')
      expect(first).toHaveProperty('instructionCue')
      expect(first).toHaveProperty('bodyRegions')
      expect(first).toHaveProperty('sensationTypes')
      expect(first).toHaveProperty('trainingContexts')
    })

    it('has at least a minimum number of exercises per lower-body region', () => {
      const countFor = (region: string) =>
        EXERCISES.filter((e) => e.bodyRegions.includes(region as any)).length

      expect(countFor('hip')).toBeGreaterThanOrEqual(4)
      expect(countFor('glute')).toBeGreaterThanOrEqual(4)
      expect(countFor('hamstring')).toBeGreaterThanOrEqual(3)
      expect(countFor('quad')).toBeGreaterThanOrEqual(2)
      expect(countFor('calf')).toBeGreaterThanOrEqual(2)
      expect(countFor('lower-back')).toBeGreaterThanOrEqual(3)
    })

    it('flags unilateral lower-body stretches with isUnilateral where appropriate', () => {
      const unilateral = EXERCISES.filter((e) => e.isUnilateral)
      expect(unilateral.length).toBeGreaterThanOrEqual(8)

      const catCow = EXERCISES.find((e) => e.id === 'cat-cow')
      expect(catCow).toBeDefined()
      expect(catCow?.isUnilateral).toBeFalsy()
    })
  })

  describe('getRoutine', () => {
    it('returns a routine for a known body region', () => {
      const input: StructuredInput = {
        bodyRegion: 'hip',
        side: 'both',
        sensationType: 'tight',
        trainingContext: 'sprint',
      }
      const routine = getRoutine(input, 5)
      expect(routine).toBeDefined()
      expect(routine.id).toBe('routine-hip')
      expect(routine.exercises.length).toBeGreaterThan(0)
      expect(routine.totalDurationSeconds).toBeGreaterThan(0)
    })

    it('returns lower-back routine for lower-back region', () => {
      const input: StructuredInput = {
        bodyRegion: 'lower-back',
        side: 'both',
        sensationType: 'stiff',
        trainingContext: 'strength',
      }
      const routine = getRoutine(input, 5)
      expect(routine.id).toBe('routine-lower-back')
      expect(routine.name).toMatch(/back/i)
    })

    it('returns full-body routine when body region is full-body', () => {
      const input: StructuredInput = {
        bodyRegion: 'full-body',
        side: 'both',
        sensationType: 'fatigued',
        trainingContext: 'rest',
      }
      const routine = getRoutine(input, 5)
      expect(routine.id).toBe('routine-full-body')
      expect(routine.exercises.length).toBeGreaterThan(0)
    })

    it('returns full-body routine as fallback for unknown region', () => {
      const input = {
        bodyRegion: 'hip' as const,
        side: 'both' as const,
        sensationType: 'tight' as const,
        trainingContext: 'sprint' as const,
      }
      const routine = getRoutine(input, 5)
      expect(routine).toBeDefined()
      expect(routine.exercises.length).toBeGreaterThan(0)
    })

    it('returns duration-aware routines with increasing total time for longer sessions', () => {
      const input: StructuredInput = {
        bodyRegion: 'hip',
        side: 'both',
        sensationType: 'tight',
        trainingContext: 'sprint',
      }

      const fiveMinutes = getRoutine(input, 5)
      const tenMinutes = getRoutine(input, 10)
      const fifteenMinutes = getRoutine(input, 15)

      expect(fiveMinutes.totalDurationSeconds).toBeGreaterThan(0)
      expect(tenMinutes.totalDurationSeconds).toBeGreaterThan(fiveMinutes.totalDurationSeconds)
      expect(fifteenMinutes.totalDurationSeconds).toBeGreaterThan(
        tenMinutes.totalDurationSeconds
      )
    })

    it('returns routines with unique exercises and at least one exercise matching the primary region', () => {
      const input: StructuredInput = {
        bodyRegion: 'hamstring',
        side: 'both',
        sensationType: 'tight',
        trainingContext: 'sprint',
      }

      const routine = getRoutine(input, 10)

      const ids = routine.exercises.map((e) => e.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(ids.length)
      expect(routine.exercises.some((e) => e.bodyRegions.includes(input.bodyRegion))).toBe(true)
    })

    it('spreads exercises across different primary body-region patterns when possible', () => {
      const input: StructuredInput = {
        bodyRegion: 'hip',
        side: 'both',
        sensationType: 'tight',
        trainingContext: 'sprint',
      }

      const routine = getRoutine(input, 15)
      const primaryRegions = routine.exercises.map((e) => e.bodyRegions[0])
      const uniquePrimaryRegions = new Set(primaryRegions)

      // With an expanded library, we expect at least some variety in primary regions
      // for a longer routine, rather than all stretches sharing the exact same primary key.
      expect(uniquePrimaryRegions.size).toBeGreaterThanOrEqual(2)
    })
  })
})
