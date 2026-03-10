import { type FormEvent, useState } from 'react'

interface LandingHeroProps {
  onStart: (description: string) => void
  isSubmitting?: boolean
}

export default function LandingHero({ onStart, isSubmitting = false }: LandingHeroProps) {
  const [input, setInput] = useState('')
  const trimmed = input.trim()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!trimmed || isSubmitting) return
    onStart(trimmed)
  }

  return (
    <section className="landing-hero" aria-label="Recovery landing">
      <div className="landing-hero__background" aria-hidden="true" />
      <div className="landing-hero__content">
        <header className="landing-hero__header">
          <h2 className="landing-hero__headline">RECOVER BETTER</h2>
          <p className="landing-hero__subheading">
            Personalized stretch flows for post-training recovery.
          </p>
        </header>
        <form className="landing-hero__form" onSubmit={handleSubmit}>
          <label htmlFor="landing-hero-input" className="visually-hidden">
            Describe your recovery needs
          </label>
          <div className="landing-hero__field-row">
            <input
              id="landing-hero-input"
              type="text"
              className="landing-hero__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Describe what you did and where you feel it (e.g. 'post-sprint, hips feel tight')."
              autoComplete="off"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="landing-hero__button"
              disabled={!trimmed || isSubmitting}
              aria-label="Start recovery"
            >
              Start Recovery
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

