import type { TracerUser } from '../types'

const DB_KEY = 'tracer_users_db'
const SESSION_KEY = 'tracer_current_session'

// Helper to get DB
function getUsers(): TracerUser[] {
  const raw = localStorage.getItem(DB_KEY)
  if (raw) return JSON.parse(raw) as TracerUser[]
  
  // Seed with an admin account if DB is empty
  const defaultAdmin: TracerUser = { uid: 'admin-1', name: 'Admin', email: 'admin@tracer.com', password: 'password', role: 'admin' }
  localStorage.setItem(DB_KEY, JSON.stringify([defaultAdmin]))
  return [defaultAdmin]
}

function saveUsers(users: TracerUser[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(users))
}

export const authService = {
  login(email: string, password: string): TracerUser {
    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Create session (omit password)
    const { password: _, ...sessionUser } = user
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return sessionUser as TracerUser
  },

  register(userData: Partial<TracerUser>): TracerUser {
    const users = getUsers()
    
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already registered')
    }

    const newUser: TracerUser = {
      uid: crypto.randomUUID(),
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || '',
      role: userData.role || 'passenger',
      drivingLicense: userData.drivingLicense,
      rcNumber: userData.rcNumber,
      busRegistration: userData.busRegistration
    }

    users.push(newUser)
    saveUsers(users)
    
    // Auto login
    const { password: _, ...sessionUser } = newUser
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return sessionUser as TracerUser
  },

  getCurrentUser(): TracerUser | null {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as TracerUser) : null
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  }
}
