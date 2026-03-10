import { useState, useCallback, useEffect } from 'react'
import ChatView from './components/ChatView'
import RoutineView from './components/RoutineView'
import BreathingExercise from './components/BreathingExercise'
import LandingHero from './components/LandingHero'
import { getRoutine } from './data/exercises'
import { sendChat } from './lib/llm'
import { logRecoverySession } from './lib/sessionLogging'
import { extractStructuredData } from './lib/extractStructuredData'
import type { ChatMessage, Routine, StructuredInput } from './types'

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! Quick check-in: what did you do today—match, sprint session, strength, conditioning, recovery day, or rest?",
}

type View = 'hero' | 'chat' | 'routine' | 'breathing' | 'done'

const FULL_BODY_INPUT = {
  bodyRegion: 'full-body' as const,
  side: 'both' as const,
  sensationType: 'tight' as const,
  trainingContext: 'rest' as const,
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<View>('hero')
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [routineContext, setRoutineContext] = useState<StructuredInput | null>(null)
  const [routineDurationMinutes, setRoutineDurationMinutes] = useState<number | null>(null)
  const [showGeneralRoutineOffer, setShowGeneralRoutineOffer] = useState(false)
  // Pending recovery duration (in minutes) for the next routine to be generated.
  const [pendingRecoveryDurationMinutes, setPendingRecoveryDurationMinutes] = useState<number | null>(null)
  const [isAwaitingRecoveryDuration, setIsAwaitingRecoveryDuration] = useState(false)
  const [pendingStructuredInput, setPendingStructuredInput] = useState<StructuredInput | null>(null)

  const handleSend = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }))
        const reply = await sendChat(history, content)
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.replace(/```json[\s\S]*?```/g, '').trim(),
        }
        setMessages((prev) => [...prev, assistantMsg])

        const { structured, readyToGenerate } = extractStructuredData(reply)
        if (readyToGenerate && structured) {
          setPendingStructuredInput(structured)

          if (pendingRecoveryDurationMinutes == null) {
            // No duration selected yet.
            if (!isAwaitingRecoveryDuration) {
              // First time we have enough info: ask for duration and pause routine generation.
              const durationQuestion: ChatMessage = {
                id: `assistant-duration-${Date.now()}`,
                role: 'assistant',
                content: 'How long should your recovery be?',
                actions: [
                  { label: '5 min', valueMinutes: 5 },
                  { label: '10 min', valueMinutes: 10 },
                  { label: '15 min', valueMinutes: 15 },
                ],
              }
              setMessages((prev) => [...prev, durationQuestion])
              setIsAwaitingRecoveryDuration(true)
            } else {
              // We were already waiting for a duration but the coach replied again
              // with enough info; treat this as "no user selection" and default to 5 minutes.
              const defaultMinutes = 5
              setPendingRecoveryDurationMinutes(defaultMinutes)
              const nextRoutine = getRoutine(structured, defaultMinutes)
              setRoutine(nextRoutine)
              setRoutineContext(structured)
              setRoutineDurationMinutes(defaultMinutes)
              setView('routine')
              setShowGeneralRoutineOffer(false)
              setIsAwaitingRecoveryDuration(false)
              setPendingRecoveryDurationMinutes(null)
              setPendingStructuredInput(null)
            }
          } else {
            // A duration is already set for this upcoming routine; generate immediately.
            const durationMinutes = pendingRecoveryDurationMinutes ?? 5
            const durationQuestion: ChatMessage = {
              id: `assistant-duration-used-${Date.now()}`,
              role: 'assistant',
              content: 'Got it — generating your recovery based on your selected duration.',
            }
            setMessages((prev) => [...prev, durationQuestion])
            const nextRoutine = getRoutine(structured, durationMinutes)
            setRoutine(nextRoutine)
            setRoutineContext(structured)
            setRoutineDurationMinutes(durationMinutes)
            setView('routine')
            setShowGeneralRoutineOffer(false)
            setIsAwaitingRecoveryDuration(false)
            setPendingRecoveryDurationMinutes(null)
            setPendingStructuredInput(null)
          }
        } else {
          setShowGeneralRoutineOffer(true)
        }
      } catch {
        const errMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "Something went wrong. You can try sending your message again.",
        }
        setMessages((prev) => [...prev, errMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isAwaitingRecoveryDuration, pendingRecoveryDurationMinutes]
  )

  const handleFinishRoutine = useCallback(() => {
    if (routine && routineContext) {
      const minutes =
        routineDurationMinutes ?? Math.max(1, Math.round(routine.totalDurationSeconds / 60))
      // Fire and forget; errors are handled inside logRecoverySession or ignored here.
      void logRecoverySession({ input: routineContext, routine, durationMinutes: minutes })
    }
    setView('done')
    setRoutineContext(null)
    setRoutineDurationMinutes(null)
  }, [routine, routineContext, routineDurationMinutes])

  const handleStartBreathing = useCallback(() => {
    setView('breathing')
  }, [])

  const handleFinishBreathing = useCallback(() => {
    setView('done')
  }, [])

  const handleStartOver = useCallback(() => {
    setView('hero')
    setRoutine(null)
    setShowGeneralRoutineOffer(false)
    setRoutineContext(null)
    setRoutineDurationMinutes(null)
  }, [])

  const handleGetGeneralRoutine = useCallback(() => {
    // General fallback routine defaults to a ~5-minute session.
    const minutes = 5
    setRoutine(getRoutine(FULL_BODY_INPUT, minutes))
    setRoutineContext(FULL_BODY_INPUT)
    setRoutineDurationMinutes(minutes)
    setView('routine')
    setShowGeneralRoutineOffer(false)
  }, [])

  const handleSelectRecoveryDuration = useCallback(
    (minutes: number) => {
      setPendingRecoveryDurationMinutes(minutes)

      // Visually mark the selected action on the latest duration question message, if present.
      setMessages((prev) =>
        prev.map((m) => {
          if (m.role !== 'assistant' || !m.actions || m.actions.length === 0) return m
          const hasDurationActions = m.actions.every(
            (a) => a.label === '5 min' || a.label === '10 min' || a.label === '15 min'
          )
          if (!hasDurationActions) return m
          return {
            ...m,
            actions: m.actions.map((a) => ({
              ...a,
              selected: a.valueMinutes === minutes,
            })),
          }
        })
      )

      if (pendingStructuredInput) {
        const nextRoutine = getRoutine(pendingStructuredInput, minutes)
        setRoutine(nextRoutine)
        setRoutineContext(pendingStructuredInput)
        setRoutineDurationMinutes(minutes)
        setView('routine')
        setShowGeneralRoutineOffer(false)
        setIsAwaitingRecoveryDuration(false)
        setPendingRecoveryDurationMinutes(null)
        setPendingStructuredInput(null)
      }
    },
    [pendingStructuredInput]
  )

  const handleStartFromHero = useCallback(
    (description: string) => {
      setView('chat')
      handleSend(description)
    },
    [handleSend]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleGoHome = () => {
      setView('hero')
      setRoutine(null)
      setShowGeneralRoutineOffer(false)
      setRoutineContext(null)
      setRoutineDurationMinutes(null)
      setPendingRecoveryDurationMinutes(null)
      setIsAwaitingRecoveryDuration(false)
      setPendingStructuredInput(null)
      setMessages([WELCOME_MESSAGE])
    }

    window.addEventListener('recovery-assistant:go-home', handleGoHome)
    return () => {
      window.removeEventListener('recovery-assistant:go-home', handleGoHome)
    }
  }, [])

  if (view === 'hero') {
    return <LandingHero onStart={handleStartFromHero} isSubmitting={isLoading} />
  }

  if (view === 'routine' && routine) {
    return (
      <RoutineView
        routine={routine}
        onFinishRoutine={handleFinishRoutine}
        onStartBreathing={handleStartBreathing}
        structuredInput={routineContext ?? undefined}
      />
    )
  }

  if (view === 'breathing') {
    return <BreathingExercise onFinish={handleFinishBreathing} />
  }

  if (view === 'done') {
    return (
      <section className="done-view" aria-label="Recovery complete">
        <h2>You&apos;re all set</h2>
        <p>Great work on your recovery.</p>
        <button
          type="button"
          className="done-view__btn"
          onClick={handleStartOver}
          aria-label="Start over and begin a new recovery session"
        >
          Start over
        </button>
      </section>
    )
  }

  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const showGeneralRoutineButton = showGeneralRoutineOffer && userMessageCount >= 2

  if (view === 'chat') {
    return (
      <ChatView
        messages={messages}
        onSend={handleSend}
        isLoading={isLoading}
        onSelectRecoveryDuration={handleSelectRecoveryDuration}
        onGetGeneralRoutine={showGeneralRoutineButton ? handleGetGeneralRoutine : undefined}
      />
    )
  }

  return null
}

export default App
