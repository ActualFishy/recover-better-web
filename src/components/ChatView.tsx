import { type FormEvent, useState, useRef, useEffect } from 'react'
import type { ChatMessage } from '../types'

interface ChatViewProps {
  messages: ChatMessage[]
  onSend: (content: string) => void
  isLoading?: boolean
  onGetGeneralRoutine?: () => void
  onSelectRecoveryDuration?: (minutes: number) => void
}

export default function ChatView({
  messages,
  onSend,
  isLoading = false,
  onGetGeneralRoutine,
  onSelectRecoveryDuration,
}: ChatViewProps) {
  const [input, setInput] = useState('')
  const listEnd = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const wasLoading = useRef(false)

  useEffect(() => {
    if (typeof listEnd.current?.scrollIntoView === 'function') {
      listEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // When the assistant finishes responding (loading goes false), put focus back in the input
  useEffect(() => {
    if (wasLoading.current && !isLoading) {
      inputRef.current?.focus()
    }
    wasLoading.current = isLoading
  }, [isLoading])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setInput('')
  }

  return (
    <div className="chat-view" aria-label="Recovery coach chat">
      <ul className="chat-messages" aria-label="Chat messages">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`chat-message chat-message--${m.role}`}
            aria-label={m.role === 'user' ? 'Your message' : 'Coach message'}
          >
            <span className="chat-message__content">{m.content}</span>
            {m.role === 'assistant' && m.actions && m.actions.length > 0 && onSelectRecoveryDuration && (
              <div className="chat-actions" aria-label="Recovery duration options">
                {m.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className={
                      action.selected
                        ? 'chat-actions__button chat-actions__button--selected'
                        : 'chat-actions__button'
                    }
                    onClick={() => onSelectRecoveryDuration(action.valueMinutes)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
        {isLoading && (
          <li className="chat-message chat-message--assistant" aria-busy="true">
            <span className="chat-message__content">Thinking...</span>
          </li>
        )}
        <li className="chat-messages__end" aria-hidden="true">
          <div ref={listEnd} />
        </li>
      </ul>
      <div className="chat-composer" aria-label="Chat composer">
        <form onSubmit={handleSubmit} className="chat-form" aria-label="Send a message">
          <label htmlFor="chat-input" className="visually-hidden">
            Your message
          </label>
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            autoComplete="off"
          />
          <button type="submit" className="chat-send" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
        {onGetGeneralRoutine && (
          <p className="chat-fallback">
            <button
              type="button"
              className="chat-fallback__btn"
              onClick={onGetGeneralRoutine}
              aria-label="Use a general recovery routine instead"
            >
              Use a general recovery routine instead
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
