import { render, screen, fireEvent } from '@testing-library/react'
import ChatView from './ChatView'

describe('ChatView', () => {
  it('renders messages', () => {
    const messages = [
      { id: '1', role: 'assistant' as const, content: 'What did you do today?' },
      { id: '2', role: 'user' as const, content: 'Sprint session' },
    ]
    render(<ChatView messages={messages} onSend={() => {}} />)
    expect(screen.getByText('What did you do today?')).toBeInTheDocument()
    expect(screen.getByText('Sprint session')).toBeInTheDocument()
  })

  it('calls onSend when user submits a message', () => {
    const onSend = jest.fn()
    render(<ChatView messages={[]} onSend={onSend} />)
    const input = screen.getByPlaceholderText(/Type your message/)
    const send = screen.getByRole('button', { name: /Send/i })
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(send)
    expect(onSend).toHaveBeenCalledWith('Hello')
  })

  it('clears input after send', () => {
    const onSend = jest.fn()
    render(<ChatView messages={[]} onSend={onSend} />)
    const input = screen.getByPlaceholderText(/Type your message/) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.submit(input.closest('form')!)
    expect(input.value).toBe('')
  })

  it('does not call onSend when input is empty', () => {
    const onSend = jest.fn()
    render(<ChatView messages={[]} onSend={onSend} />)
    const send = screen.getByRole('button', { name: /Send/i })
    fireEvent.click(send)
    expect(onSend).not.toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<ChatView messages={[]} onSend={() => {}} isLoading />)
    expect(screen.getByText(/Thinking/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send/i })).toBeDisabled()
  })

  it('renders a dedicated bottom composer region', () => {
    render(<ChatView messages={[]} onSend={() => {}} />)
    expect(screen.getByLabelText(/Chat composer/i)).toBeInTheDocument()
    expect(screen.getByRole('form', { name: /Send a message/i })).toBeInTheDocument()
  })

  it('shows general routine fallback button when onGetGeneralRoutine is provided', () => {
    const onGetGeneralRoutine = jest.fn()
    render(
      <ChatView messages={[]} onSend={() => {}} onGetGeneralRoutine={onGetGeneralRoutine} />
    )
    const btn = screen.getByRole('button', { name: /Use a general recovery routine instead/i })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(onGetGeneralRoutine).toHaveBeenCalledTimes(1)
  })

  it('renders recovery duration actions and calls callback when a button is clicked', () => {
    const onSelectRecoveryDuration = jest.fn()
    const messages = [
      {
        id: '1',
        role: 'assistant' as const,
        content: 'How long should your recovery be?',
        actions: [
          { label: '5 min', valueMinutes: 5 },
          { label: '10 min', valueMinutes: 10 },
          { label: '15 min', valueMinutes: 15 },
        ],
      },
    ]

    render(
      <ChatView
        messages={messages}
        onSend={() => {}}
        onSelectRecoveryDuration={onSelectRecoveryDuration}
      />
    )

    const fiveBtn = screen.getByRole('button', { name: '5 min' })
    const tenBtn = screen.getByRole('button', { name: '10 min' })
    const fifteenBtn = screen.getByRole('button', { name: '15 min' })

    expect(fiveBtn).toBeInTheDocument()
    expect(tenBtn).toBeInTheDocument()
    expect(fifteenBtn).toBeInTheDocument()

    fireEvent.click(tenBtn)
    expect(onSelectRecoveryDuration).toHaveBeenCalledWith(10)
  })

  it('applies selected styling class to the chosen recovery duration action', () => {
    const onSelectRecoveryDuration = jest.fn()
    const messages = [
      {
        id: '1',
        role: 'assistant' as const,
        content: 'How long should your recovery be?',
        actions: [
          { label: '5 min', valueMinutes: 5 },
          { label: '10 min', valueMinutes: 10, selected: true },
          { label: '15 min', valueMinutes: 15 },
        ],
      },
    ]

    render(
      <ChatView
        messages={messages}
        onSend={() => {}}
        onSelectRecoveryDuration={onSelectRecoveryDuration}
      />
    )

    const tenBtn = screen.getByRole('button', { name: '10 min' })
    expect(tenBtn.className).toContain('chat-actions__button--selected')
  })
})
