import { type ReactNode, useState } from 'react'
import LibraryView from './LibraryView'
import AuthModal from './AuthModal'
import { getCurrentUser, logout } from '../lib/auth'
import WeeklySummaryView from './WeeklySummaryView'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [showLibrary, setShowLibrary] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(() => getCurrentUser()?.email ?? null)

  const handleOpenLibrary = () => {
    setShowLibrary(true)
  }

  const handleCloseLibrary = () => {
    setShowLibrary(false)
  }

  const handleOpenSummary = () => {
    setShowSummary(true)
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
  }

  const handleOpenAuth = () => {
    setShowAuth(true)
  }

  const handleCloseAuth = () => {
    setShowAuth(false)
  }

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email)
  }

  const handleLogout = async () => {
    await logout()
    setUserEmail(null)
  }

  const handleGoHome = () => {
    setShowLibrary(false)
    setShowSummary(false)
    setShowAuth(false)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('recovery-assistant:go-home'))
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button
          type="button"
          className="app-header__brand"
          onClick={handleGoHome}
          aria-label="Recovery Assistant home"
        >
          <span className="app-header__mark" aria-hidden="true" />
          <span className="app-header__title">Recovery Assistant</span>
        </button>
        <nav className="app-header__nav" aria-label="Primary">
          <button type="button" className="app-header__link">
            About
          </button>
          <button
            type="button"
            className="app-header__link"
            onClick={handleOpenLibrary}
          >
            Library
          </button>
          <button
            type="button"
            className="app-header__link"
            onClick={handleOpenSummary}
          >
            Weekly summary
          </button>
        </nav>
        {userEmail ? (
          <div className="app-header__account">
            <span className="app-header__account-email" aria-label="Signed in email">
              {userEmail}
            </span>
            <button
              type="button"
              className="app-header__start app-header__start--secondary"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="app-header__start"
            onClick={handleOpenAuth}
          >
            Log in / Start
          </button>
        )}
      </header>
      {showLibrary ? (
        <main>
          <LibraryView onClose={handleCloseLibrary} />
        </main>
      ) : showSummary ? (
        <main>
          <WeeklySummaryView onClose={handleCloseSummary} />
        </main>
      ) : (
        <main>{children}</main>
      )}
      <AuthModal
        isOpen={showAuth}
        onClose={handleCloseAuth}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}
