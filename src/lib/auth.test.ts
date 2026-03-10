import { getCurrentUser, signup, login, logout } from './auth'

const STORAGE_KEY = 'recovery-assistant:user'

describe('auth library', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('signup stores a user and getCurrentUser returns it', async () => {
    const user = await signup('test@example.com', 'password')
    expect(user.email).toBe('test@example.com')

    const stored = window.localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()

    const current = getCurrentUser()
    expect(current?.email).toBe('test@example.com')
  })

  it('login returns existing user when emails match', async () => {
    await signup('test@example.com', 'password')
    const user = await login('test@example.com', 'other-password')
    expect(user.email).toBe('test@example.com')
    expect(getCurrentUser()?.email).toBe('test@example.com')
  })

  it('logout clears stored user', async () => {
    await signup('test@example.com', 'password')
    await logout()
    expect(getCurrentUser()).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('throws when email is empty on signup/login', async () => {
    await expect(signup('', 'password')).rejects.toThrow('Email is required')
    await expect(login('   ', 'password')).rejects.toThrow('Email is required')
  })
})

