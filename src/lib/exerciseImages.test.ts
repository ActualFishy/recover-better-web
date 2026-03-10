import { getImageUrl, KNOWN_EXERCISE_IDS } from './exerciseImages'

describe('exerciseImages', () => {
  it('returns a .png path for figure-four', () => {
    expect(getImageUrl('figure-four')).toBe('/images/figure-four.png')
  })

  it('returns a .jpg path for a known non-png exercise id', () => {
    // Pick a known exercise id that is not in the PNG-only set.
    expect(KNOWN_EXERCISE_IDS).toContain('pigeon-elevated')
    expect(getImageUrl('pigeon-elevated')).toBe('/images/pigeon-elevated.jpg')
  })

  it('falls back to a generic image for unknown exercise ids', () => {
    expect(getImageUrl('unknown-exercise-id')).toBe('/images/fallback.jpg')
  })
})

import { EXERCISES } from '../data/exercises'
import { getImageUrl, KNOWN_EXERCISE_IDS } from './exerciseImages'

describe('exerciseImages', () => {
  describe('getImageUrl', () => {
    it('returns /images/{id}.{ext} for every known exercise id', () => {
      EXERCISES.forEach((exercise) => {
        const url = getImageUrl(exercise.id)
        expect(url).toMatch(new RegExp(`^/images/${exercise.id}\\.(jpg|png)$`))
        expect(url.startsWith('/images/')).toBe(true)
      })
      expect(getImageUrl('figure-four')).toBe('/images/figure-four.png')
    })

    it('returns /images/fallback.jpg for unknown exercise id', () => {
      expect(getImageUrl('unknown-exercise-id')).toBe('/images/fallback.jpg')
    })

    it('returns fallback for empty string', () => {
      expect(getImageUrl('')).toBe('/images/fallback.jpg')
    })
  })

  describe('KNOWN_EXERCISE_IDS', () => {
    it('includes all exercise ids from the database', () => {
      expect(KNOWN_EXERCISE_IDS).toHaveLength(EXERCISES.length)
      EXERCISES.forEach((e) => {
        expect(KNOWN_EXERCISE_IDS).toContain(e.id)
      })
    })
  })
})
