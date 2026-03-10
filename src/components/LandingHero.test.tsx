import { render, screen, fireEvent } from '@testing-library/react'
import LandingHero from './LandingHero'

describe('LandingHero', () => {
  it('renders headline and subheading', () => {
    render(<LandingHero onStart={() => {}} />)
    expect(screen.getByRole('heading', { name: /RECOVER BETTER/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Personalized stretch flows for post-training recovery\./i)
    ).toBeInTheDocument()
  })

  it('renders input with guiding placeholder and accessible label', () => {
    render(<LandingHero onStart={() => {}} />)
    const input = screen.getByLabelText(/Describe your recovery needs/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute(
      'placeholder',
      expect.stringContaining('Describe what you did and where you feel it')
    )
  })

  it('disables Start Recovery button when input is empty and enables when filled', () => {
    render(<LandingHero onStart={() => {}} />)
    const button = screen.getByRole('button', { name: /Start Recovery/i })
    const input = screen.getByLabelText(/Describe your recovery needs/i)

    expect(button).toBeDisabled()

    fireEvent.change(input, { target: { value: 'post-sprint, hips feel tight' } })
    expect(button).not.toBeDisabled()
  })

  it('calls onStart with trimmed text when submitted', () => {
    const handleStart = jest.fn()
    render(<LandingHero onStart={handleStart} />)

    const input = screen.getByLabelText(/Describe your recovery needs/i)
    const button = screen.getByRole('button', { name: /Start Recovery/i })

    fireEvent.change(input, { target: { value: '  tight hamstrings  ' } })
    fireEvent.click(button)

    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleStart).toHaveBeenCalledWith('tight hamstrings')
  })

  it('renders key elements in expected order', () => {
    const { container } = render(<LandingHero onStart={() => {}} />)

    const section = container.querySelector('.landing-hero')
    expect(section).not.toBeNull()

    const headline = container.querySelector('.landing-hero__headline')
    const subheading = container.querySelector('.landing-hero__subheading')
    const form = container.querySelector('.landing-hero__form')
    const input = screen.getByLabelText(/Describe your recovery needs/i)
    const button = screen.getByRole('button', { name: /Start Recovery/i })

    expect(headline).toBeInTheDocument()
    expect(subheading).toBeInTheDocument()
    expect(form).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()

    // Ensure header (headline + subheading) appears before the form in the DOM
    const header = container.querySelector('.landing-hero__header')
    expect(header && form && header.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('provides accessible label for input and name for button', () => {
    const { container } = render(<LandingHero onStart={() => {}} />)

    const input = screen.getByLabelText(/Describe your recovery needs/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'landing-hero-input')

    const label = container.querySelector('label[for="landing-hero-input"]')
    expect(label).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /Start Recovery/i })
    expect(button).toBeInTheDocument()
  })

  it('renders decorative background without impacting accessibility', () => {
    const { container } = render(<LandingHero onStart={() => {}} />)
    const bg = container.querySelector('.landing-hero__background')
    expect(bg).toBeInTheDocument()
    expect(bg).toHaveAttribute('aria-hidden', 'true')

    // Core interactive elements are still present
    expect(screen.getByRole('heading', { name: /RECOVER BETTER/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Describe your recovery needs/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Recovery/i })).toBeInTheDocument()
  })

  it('does not submit when disabled due to empty text', () => {
    const handleStart = jest.fn()
    render(<LandingHero onStart={handleStart} />)

    const button = screen.getByRole('button', { name: /Start Recovery/i })
    fireEvent.click(button)

    expect(handleStart).not.toHaveBeenCalled()
  })
})

