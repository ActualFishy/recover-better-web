import { useState, type FormEvent } from 'react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (email: string) => void
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const trimmedEmail = email.trim()
  const isDisabled = !trimmedEmail || !password || isSubmitting

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (isDisabled) return
    setIsSubmitting(true)
    setError(null)
    // For now, just pass email back up; actual auth is handled by caller.
    try {
      onAuthSuccess(trimmedEmail)
      setIsSubmitting(false)
      setEmail('')
      setPassword('')
      onClose()
    } catch (err) {
      setIsSubmitting(false)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="auth-modal__backdrop" role="dialog" aria-modal="true" aria-label="Sign in to save your recovery history">
      <div className="auth-modal">
        <header className="auth-modal__header">
          <h2 className="auth-modal__title">
            {mode === 'login' ? 'Log in to your recovery history' : 'Create your recovery account'}
          </h2>
          <button
            type="button"
            className="auth-modal__close"
            onClick={onClose}
            aria-label="Close login"
          >
            Close
          </button>
        </header>
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <label className="auth-modal__label">
            Email
            <input
              type="email"
              className="auth-modal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              required
            />
          </label>
          <label className="auth-modal__label">
            Password
            <input
              type="password"
              className="auth-modal__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              disabled={isSubmitting}
              required
            />
          </label>
          {error && <p className="auth-modal__error">{error}</p>}
          <button
            type="submit"
            className="auth-modal__submit"
            disabled={isDisabled}
          >
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>
        <footer className="auth-modal__footer">
          {mode === 'login' ? (
            <button
              type="button"
              className="auth-modal__toggle"
              onClick={() => setMode('signup')}
            >
              Need an account? Sign up
            </button>
          ) : (
            <button
              type="button"
              className="auth-modal__toggle"
              onClick={() => setMode('login')}
            >
              Already have an account? Log in
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}

