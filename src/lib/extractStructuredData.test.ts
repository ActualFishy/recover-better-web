import { extractStructuredData } from './extractStructuredData'

describe('extractStructuredData', () => {
  it('returns readyToGenerate true and structured data when valid JSON block is present', () => {
    const text = `Here's your routine.
\`\`\`json
{
  "bodyRegion": "hip",
  "side": "left",
  "sensationType": "tight",
  "trainingContext": "sprint",
  "readyToGenerate": true
}
\`\`\``
    const result = extractStructuredData(text)
    expect(result.readyToGenerate).toBe(true)
    expect(result.structured).toEqual({
      bodyRegion: 'hip',
      side: 'left',
      sensationType: 'tight',
      trainingContext: 'sprint',
    })
  })

  it('still treats input as ready to generate when bodyRegion is present even if readyToGenerate is false', () => {
    const text = `\`\`\`json
{"bodyRegion":"lower-back","side":"both","sensationType":"stiff","trainingContext":"strength","readyToGenerate":false}
\`\`\``
    const result = extractStructuredData(text)
    expect(result.readyToGenerate).toBe(true)
    expect(result.structured).toEqual({
      bodyRegion: 'lower-back',
      side: 'both',
      sensationType: 'stiff',
      trainingContext: 'strength',
    })
  })

  it('normalizes missing side to both', () => {
    const text = `\`\`\`json
{"bodyRegion":"hamstring","sensationType":"sore","trainingContext":"match","readyToGenerate":true}
\`\`\``
    const result = extractStructuredData(text)
    expect(result.structured?.side).toBe('both')
  })

  it('returns structured null and readyToGenerate false when JSON is invalid', () => {
    const text = `No JSON here, just text.`
    const result = extractStructuredData(text)
    expect(result.structured).toBeNull()
    expect(result.readyToGenerate).toBe(false)
  })

  it('returns structured null when bodyRegion is invalid', () => {
    const text = `\`\`\`json
{"bodyRegion":"shoulder","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}
\`\`\``
    const result = extractStructuredData(text)
    expect(result.structured).toBeNull()
    expect(result.readyToGenerate).toBe(false)
  })

  it('parses raw JSON object without markdown code fence', () => {
    const text = `Done. {"bodyRegion":"glute","side":"right","sensationType":"sore","trainingContext":"strength","readyToGenerate":true}`
    const result = extractStructuredData(text)
    expect(result.structured?.bodyRegion).toBe('glute')
    expect(result.structured?.side).toBe('right')
    expect(result.readyToGenerate).toBe(true)
  })
})
