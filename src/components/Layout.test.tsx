import { render, screen, fireEvent } from '@testing-library/react'
import Layout from './Layout'

describe('Layout', () => {
  it('renders header with app name', () => {
    render(<Layout><div>Test content</div></Layout>)
    expect(screen.getByRole('button', { name: /Recovery Assistant/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log in \/ Start/i })).toBeInTheDocument()
  })

  it('renders children inside main', () => {
    render(<Layout><div>Test content</div></Layout>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveTextContent('Test content')
  })

  it('shows the stretch library when the Library button is clicked, and can be closed', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    )

    // Initially, the main content should be visible.
    expect(screen.getByText('Test content')).toBeInTheDocument()

    // Click the Library button in the header.
    fireEvent.click(screen.getByRole('button', { name: /Library/i }))

    // The library view should now be visible.
    expect(screen.getByRole('heading', { name: /Stretch Library/i })).toBeInTheDocument()

    // Close the library and ensure the original content is visible again.
    fireEvent.click(
      screen.getByRole('button', {
        name: /Close stretch library and return to the main view/i,
      })
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('opens auth modal from header Start button and shows account email after auth', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    )

    // Click the Log in / Start button
    fireEvent.click(screen.getByRole('button', { name: /Log in \/ Start/i }))
    expect(
      screen.getByRole('dialog', { name: /Sign in to save your recovery history/i })
    ).toBeInTheDocument()

    // Fill in email and password and submit
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: /^Log in$/,
      })
    )

    // Modal should close and email should now be visible in the header
    expect(
      screen.queryByRole('dialog', { name: /Sign in to save your recovery history/i })
    ).not.toBeInTheDocument()
    expect(
      screen.getByLabelText(/Signed in email/i)
    ).toHaveTextContent('user@example.com')
  })

  it('shows weekly summary when Weekly summary button is clicked', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    )

    fireEvent.click(screen.getByRole('button', { name: /Weekly summary/i }))

    expect(
      screen.getByRole('heading', { name: /This week in recovery/i })
    ).toBeInTheDocument()
  })
})
