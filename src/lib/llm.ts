const SYSTEM_PROMPT = `You are a supportive recovery coach for athletes. Your job is to have a short conversation to understand where they feel tight or sore (this is most important), plus a bit of training context, then output structured data when you have enough info.

Follow this flow:
1. Start by asking where they feel discomfort or tightness (e.g. lower back, hip, hamstring, glute, left piriformis). Accept natural language and map it to one of: lower-back, hip, hamstring, glute, piriformis, upper-back, quad, calf, or full-body.
2. Optionally, also ask what kind of training they did today (match, sprint session, strength training, conditioning, recovery day, or rest day) and how it feels (tight, sore, stiff, fatigued, or sharp), but do NOT delay the JSON output forever waiting for these details.
3. As soon as you confidently know the bodyRegion, reply with a short supportive message AND include a JSON block with exactly this structure (use these exact keys):
\`\`\`json
{
  "bodyRegion": "hip",
  "side": "left",
  "sensationType": "tight",
  "trainingContext": "sprint",
  "readyToGenerate": true
}
\`\`\`
Use the actual values you inferred. Set readyToGenerate to true as soon as you have a valid bodyRegion (you can infer or default side, sensationType, and trainingContext if the user hasn’t explicitly given them yet). bodyRegion must be one of: lower-back, hip, hamstring, glute, piriformis, upper-back, quad, calf, full-body. side: left, right, or both. sensationType: tight, sore, stiff, fatigued, sharp. trainingContext: match, sprint, strength, conditioning, recovery, rest.

Keep your messages concise and coach-like. Do not diagnose injuries; only gather info for a recovery routine.`

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Send conversation + new user message to the LLM and return the assistant reply.
 * Uses OpenAI API if VITE_OPENAI_API_KEY is set; on API errors (e.g. 429 quota) falls back to mock so the app still works.
 */
export async function sendChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.VITE_OPENAI_API_KEY
  if (apiKey) {
    try {
      return await sendOpenAI(messages, userMessage, apiKey)
    } catch {
      return mockSendChat(messages, userMessage)
    }
  }
  return mockSendChat(messages, userMessage)
}

async function sendOpenAI(
  messages: { role: 'user' | 'assistant'; content: string }[],
  userMessage: string,
  apiKey: string
): Promise<string> {
  const allMessages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content } as Message)),
    { role: 'user', content: userMessage },
  ]
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: allMessages,
      max_tokens: 500,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM API error: ${res.status} ${err}`)
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('Empty response from LLM')
  return content
}

/** Mock implementation: returns canned responses so the app works without an API key. */
function mockSendChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  userMessage: string
): Promise<string> {
  const lastUser = userMessage.toLowerCase()
  const turn = messages.filter((m) => m.role === 'user').length

  if (turn === 0) {
    if (/match|sprint|strength|conditioning|recovery|rest/.test(lastUser)) {
      const ctx = lastUser.includes('sprint') ? 'sprint' : lastUser.includes('strength') ? 'strength' : lastUser.includes('match') ? 'match' : lastUser.includes('conditioning') ? 'conditioning' : lastUser.includes('recovery') ? 'recovery' : 'rest'
      return Promise.resolve(
        `Got it. Where are you feeling it most—lower back, hip, hamstring, glute, or somewhere else?\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"${ctx}","readyToGenerate":false}\n\`\`\``
      )
    }
    return Promise.resolve(
      "What did you do today—match, sprint session, strength, conditioning, recovery day, or rest? That'll help me pick the right routine."
    )
  }

  if (turn === 1) {
    const region = lastUser.includes('back') ? 'lower-back' : lastUser.includes('hip') ? 'hip' : lastUser.includes('hamstring') ? 'hamstring' : lastUser.includes('glute') ? 'glute' : lastUser.includes('quad') ? 'quad' : lastUser.includes('calf') ? 'calf' : 'full-body'
    return Promise.resolve(
      `Which side—left, right, or both? And how does it feel: tight, sore, stiff, or sharp?\n\n\`\`\`json\n{"bodyRegion":"${region}","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":false}\n\`\`\``
    )
  }

  const side = lastUser.includes('left') ? 'left' : lastUser.includes('right') ? 'right' : 'both'
  const sensation = lastUser.includes('sharp') ? 'sharp' : lastUser.includes('sore') ? 'sore' : lastUser.includes('stiff') ? 'stiff' : lastUser.includes('fatigued') ? 'fatigued' : 'tight'
  return Promise.resolve(
    `Here’s a quick routine that should help. Tap below to see your exercises.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"${side}","sensationType":"${sensation}","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
  )
}
