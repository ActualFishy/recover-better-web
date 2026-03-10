import type { Exercise, Routine, StructuredInput, ChatMessage } from './types'

describe('types', () => {
  it('Exercise type has required fields', () => {
    const ex: Exercise = {
      id: 'test',
      name: 'Test',
      durationSeconds: 30,
      instructionCue: 'Do this.',
      bodyRegions: ['hip'],
      sensationTypes: ['tight'],
      trainingContexts: ['sprint'],
      isUnilateral: true,
    }
    expect(ex.name).toBe('Test')
    expect(ex.durationSeconds).toBe(30)
    expect(ex.isUnilateral).toBe(true)
  })

  it('Routine type has exercises and totalDurationSeconds', () => {
    const r: Routine = {
      id: 'r1',
      name: 'R1',
      exercises: [],
      totalDurationSeconds: 300,
    }
    expect(r.exercises).toEqual([])
    expect(r.totalDurationSeconds).toBe(300)
  })

  it('StructuredInput type has bodyRegion, side, sensationType, trainingContext', () => {
    const input: StructuredInput = {
      bodyRegion: 'lower-back',
      side: 'both',
      sensationType: 'tight',
      trainingContext: 'strength',
    }
    expect(input.bodyRegion).toBe('lower-back')
    expect(input.side).toBe('both')
  })

  it('ChatMessage can include optional inline actions', () => {
    const msg: ChatMessage = {
      id: 'm1',
      role: 'assistant',
      content: 'How long should your recovery be?',
      actions: [
        { label: '5 min', valueMinutes: 5 },
        { label: '10 min', valueMinutes: 10, selected: true },
      ],
    }

    expect(msg.actions).toHaveLength(2)
    expect(msg.actions?.[1].label).toBe('10 min')
    expect(msg.actions?.[1].selected).toBe(true)
  })
})
