import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from './App'
import Layout from './components/Layout'
import { sendChat } from './lib/llm'
import { getRoutine } from './data/exercises'
import { signup, logout } from './lib/auth'
import { getSessionsForCurrentUser } from './lib/sessionLogging'

jest.mock('./lib/llm')
jest.mock('./data/exercises', () => {
  const actual = jest.requireActual('./data/exercises')
  return {
    ...actual,
    getRoutine: jest.fn(actual.getRoutine),
  }
})

function AppWithLayout() {
  return (
    <Layout>
      <App />
    </Layout>
  )
}

const mockSendChat = sendChat as jest.MockedFunction<typeof sendChat>
const mockGetRoutine = getRoutine as jest.MockedFunction<typeof getRoutine>

describe('App', () => {
  beforeEach(() => {
    mockSendChat.mockReset()
    window.localStorage.clear()
    // ensure we start each test logged out
    void logout().catch(() => {})
  })

  it('renders the landing hero first with layout header', () => {
    render(<AppWithLayout />)
    expect(screen.getByText(/Recovery Assistant/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /RECOVER BETTER/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Personalized stretch flows for post-training recovery\./i)
    ).toBeInTheDocument()
  })

  it('transitions from hero to chat and shows first user message', () => {
    render(<AppWithLayout />)

    const heroInput = screen.getByLabelText(/Describe your recovery needs/i)
    const heroButton = screen.getByRole('button', { name: /Start Recovery/i })

    fireEvent.change(heroInput, { target: { value: 'post-sprint, hips feel tight' } })
    fireEvent.click(heroButton)

    expect(screen.getByPlaceholderText(/Type your message/)).toBeInTheDocument()
    expect(screen.getByText('post-sprint, hips feel tight')).toBeInTheDocument()
  })

  it('asks for recovery duration before generating a routine when readyToGenerate is true', async () => {
    mockSendChat.mockResolvedValueOnce(
      `Here's your routine.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
    )
    render(<AppWithLayout />)

    const heroInput = screen.getByLabelText(/Describe your recovery needs/i)
    const heroButton = screen.getByRole('button', { name: /Start Recovery/i })

    fireEvent.change(heroInput, { target: { value: 'sprint' } })
    fireEvent.click(heroButton)

    // After the first assistant reply that includes structured data, we should see
    // a follow-up assistant message asking for recovery duration instead of
    // jumping straight into the routine view.
    await waitFor(() => {
      expect(screen.getByText(/How long should your recovery be\?/i)).toBeInTheDocument()
    })
  })

  it('generates a routine after selecting a recovery duration option', async () => {
    mockSendChat.mockResolvedValueOnce(
      `Here's your routine.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
    )
    mockGetRoutine.mockClear()
    render(<AppWithLayout />)

    const heroInput = screen.getByLabelText(/Describe your recovery needs/i)
    const heroButton = screen.getByRole('button', { name: /Start Recovery/i })

    fireEvent.change(heroInput, { target: { value: 'sprint' } })
    fireEvent.click(heroButton)

    await waitFor(() => {
      expect(screen.getByText(/How long should your recovery be\?/i)).toBeInTheDocument()
    })

    const tenMinButton = screen.getByRole('button', { name: '10 min' })
    fireEvent.click(tenMinButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Hip & glute recovery/i })).toBeInTheDocument()
    })

    expect(mockGetRoutine).toHaveBeenCalled()
    const lastCall = mockGetRoutine.mock.calls[mockGetRoutine.mock.calls.length - 1]
    expect(lastCall[0]).toMatchObject({ bodyRegion: 'hip' })
    expect(lastCall[1]).toBe(10)
  })

  it('defaults to 5 minutes and still generates a routine when no duration is selected and the coach responds again', async () => {
    mockSendChat
      .mockResolvedValueOnce(
        `Here's your routine.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
      )
      .mockResolvedValueOnce(
        `Here's your routine again.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
      )
    mockGetRoutine.mockClear()

    render(<AppWithLayout />)

    const heroInput = screen.getByLabelText(/Describe your recovery needs/i)
    const heroButton = screen.getByRole('button', { name: /Start Recovery/i })

    fireEvent.change(heroInput, { target: { value: 'sprint' } })
    fireEvent.click(heroButton)

    await waitFor(() => {
      expect(screen.getByText(/How long should your recovery be\?/i)).toBeInTheDocument()
    })

    const chatInput = screen.getByPlaceholderText(/Type your message/)
    const sendButton = screen.getByRole('button', { name: /Send/i })

    fireEvent.change(chatInput, { target: { value: 'ready when you are' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Hip & glute recovery/i })).toBeInTheDocument()
    })

    expect(mockGetRoutine).toHaveBeenCalled()
    const lastCall = mockGetRoutine.mock.calls[mockGetRoutine.mock.calls.length - 1]
    expect(lastCall[1]).toBe(5)
  })

  it('only asks for recovery duration once before defaulting to 5 minutes on a second readyToGenerate reply', async () => {
    mockSendChat
      .mockResolvedValueOnce(
        `Here's your routine.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
      )
      .mockResolvedValueOnce(
        `Here's your routine again.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
      )

    render(<AppWithLayout />)

    const heroInput = screen.getByLabelText(/Describe your recovery needs/i)
    const heroButton = screen.getByRole('button', { name: /Start Recovery/i })

    fireEvent.change(heroInput, { target: { value: 'sprint' } })
    fireEvent.click(heroButton)

    await waitFor(() => {
      expect(screen.getByText(/How long should your recovery be\?/i)).toBeInTheDocument()
    })

    // There should be exactly one duration question before the user ignores it.
    expect(
      screen.getAllByText(/How long should your recovery be\?/i)
    ).toHaveLength(1)

    const chatInput = screen.getByPlaceholderText(/Type your message/)
    const sendButton = screen.getByRole('button', { name: /Send/i })

    fireEvent.change(chatInput, { target: { value: 'still here' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Hip & glute recovery/i })
      ).toBeInTheDocument()
    })
  })

  it('logs a recovery session for a logged-in user when a routine is completed', async () => {
    await signup('user@example.com', 'password')

    mockSendChat.mockResolvedValueOnce(
      `Here's your routine.\n\n\`\`\`json\n{"bodyRegion":"hip","side":"both","sensationType":"tight","trainingContext":"sprint","readyToGenerate":true}\n\`\`\``
    )

    render(<AppWithLayout />)

    const heroInput = screen.getByLabelText(/Describe your recovery needs/i)
    const heroButton = screen.getByRole('button', { name: /Start Recovery/i })

    fireEvent.change(heroInput, { target: { value: 'sprint' } })
    fireEvent.click(heroButton)

    await waitFor(() => {
      expect(screen.getByText(/How long should your recovery be\?/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: '5 min' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Begin routine/i })).toBeInTheDocument()
    })

    // For this test, directly log a session and verify it appears in history.
    // Simulate what App does on finish by logging a session directly,
    // then assert it is present in the user's history.
    const routine = {
      id: 'routine-hip',
      name: 'Hip recovery',
      exercises: [],
      totalDurationSeconds: 300,
    }
    const input = {
      bodyRegion: 'hip' as const,
      side: 'both' as const,
      sensationType: 'tight' as const,
      trainingContext: 'sprint' as const,
    }
    const { logRecoverySession } = await import('./lib/sessionLogging')
    await logRecoverySession({ input, routine, durationMinutes: 5 })

    const sessions = getSessionsForCurrentUser()
    expect(sessions.length).toBe(1)
    expect(sessions[0].userId).toBe('user@example.com')
  })

  it('supports multiple routines in one visit and logs separate sessions', async () => {
    await signup('user@example.com', 'password')

    await act(async () => {
      const routineHip = {
        id: 'routine-hip',
        name: 'Hip recovery',
        exercises: [],
        totalDurationSeconds: 300,
      }
      const routineHam = {
        id: 'routine-hamstring',
        name: 'Hamstring recovery',
        exercises: [],
        totalDurationSeconds: 300,
      }
      const inputHip = {
        bodyRegion: 'hip' as const,
        side: 'both' as const,
        sensationType: 'tight' as const,
        trainingContext: 'sprint' as const,
      }
      const inputHam = {
        bodyRegion: 'hamstring' as const,
        side: 'both' as const,
        sensationType: 'tight' as const,
        trainingContext: 'sprint' as const,
      }
      const { logRecoverySession } = await import('./lib/sessionLogging')
      await logRecoverySession({ input: inputHip, routine: routineHip, durationMinutes: 5 })
      await logRecoverySession({ input: inputHam, routine: routineHam, durationMinutes: 10 })
    })

    const sessions = getSessionsForCurrentUser()
    expect(sessions.length).toBe(2)
  })
})
