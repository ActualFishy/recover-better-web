import { render, screen, fireEvent } from '@testing-library/react'
import LibraryView from './LibraryView'
import { EXERCISES } from '../data/exercises'

describe('LibraryView', () => {
  it('renders header, subtitle, and stretch count', () => {
    const onClose = jest.fn()
    render(<LibraryView onClose={onClose} />)

    expect(screen.getByRole('heading', { name: /Stretch Library/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Browse all available stretches used in your recovery routines/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(`${EXERCISES.length} stretches available`))
    ).toBeInTheDocument()
  })

  it('calls onClose when the Close button is clicked', () => {
    const onClose = jest.fn()
    render(<LibraryView onClose={onClose} />)

    const closeButton = screen.getByRole('button', {
      name: /Close stretch library and return to the main view/i,
    })
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders all exercises as cards in region groups', () => {
    const onClose = jest.fn()
    const { container } = render(<LibraryView onClose={onClose} />)

    // Every exercise should appear as a card.
    const cards = container.querySelectorAll('.library-view__card')
    expect(cards.length).toBe(EXERCISES.length)

    // Check that some known region section labels appear at least once.
    const hipsHeadings = screen.getAllByRole('heading', { name: /Hips & Glutes/i })
    expect(hipsHeadings.length).toBeGreaterThanOrEqual(1)
    const hamstringsHeadings = screen.getAllByRole('heading', { name: /Hamstrings/i })
    expect(hamstringsHeadings.length).toBeGreaterThanOrEqual(1)

    expect(screen.getByText('Figure Four Stretch')).toBeInTheDocument()
    expect(screen.getByText('Standing Quad Stretch')).toBeInTheDocument()
  })

  it('opens and closes a detail dialog when a card is clicked', () => {
    const onClose = jest.fn()
    render(<LibraryView onClose={onClose} />)

    const figureFourCard = screen.getByLabelText(/Stretch: Figure Four Stretch/i)
    fireEvent.click(figureFourCard)

    expect(
      screen.getByRole('dialog', { name: /Details for Figure Four Stretch/i })
    ).toBeInTheDocument()
    const cueMatches = screen.getAllByText(
      /Cross one ankle over the opposite knee, then gently press the raised knee away/i
    )
    expect(cueMatches.length).toBeGreaterThanOrEqual(1)

    // Close via the dialog close button.
    fireEvent.click(screen.getByRole('button', { name: /Close stretch details/i }))
    expect(
      screen.queryByRole('dialog', { name: /Details for Figure Four Stretch/i })
    ).not.toBeInTheDocument()
  })
})

