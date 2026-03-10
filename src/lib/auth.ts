export interface User {
  id: string
  email: string
}

const STORAGE_KEY = 'recovery-assistant:user'

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as User
    return parsed && typeof parsed.email === 'string' ? parsed : null
  } catch {
    return null
  }
}

function persistUser(user: User | null) {
  if (typeof window === 'undefined') return
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export async function signup(email: string, _password: string): Promise<User> {
  const trimmed = email.trim().toLowerCase()
  if (!trimmed) {
    throw new Error('Email is required')
  }
  const user: User = { id: trimmed, email: trimmed }
  persistUser(user)
  return user
}

export async function login(email: string, _password: string): Promise<User> {
  const trimmed = email.trim().toLowerCase()
  if (!trimmed) {
    throw new Error('Email is required')
  }
  const existing = getCurrentUser()
  const user: User = existing?.email === trimmed ? existing : { id: trimmed, email: trimmed }
  persistUser(user)
  return user
}

export async function logout(): Promise<void> {
  persistUser(null)
}

