import { render, screen, fireEvent } from '@testing-library/react'
import AuthModal from './AuthModal'

describe('AuthModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={() => {}} onAuthSuccess={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('submits email and closes on success in login mode', () => {
    const handleClose = jest.fn()
    const handleSuccess = jest.fn()

    render(<AuthModal isOpen onClose={handleClose} onAuthSuccess={handleSuccess} />)

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password' },
    })

    const submitButton = screen.getByRole('button', { name: /Log in/i })
    expect(submitButton).toBeEnabled()
    fireEvent.click(submitButton)

    expect(handleSuccess).toHaveBeenCalledWith('user@example.com')
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('switches between login and signup modes', () => {
    render(<AuthModal isOpen onClose={() => {}} onAuthSuccess={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /Need an account\? Sign up/i }))
    expect(
      screen.getByRole('button', { name: /Already have an account\? Log in/i })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Already have an account\? Log in/i }))
    expect(
      screen.getByRole('button', { name: /Need an account\? Sign up/i })
    ).toBeInTheDocument()
  })
})

