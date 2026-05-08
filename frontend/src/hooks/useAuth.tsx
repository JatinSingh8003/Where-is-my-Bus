import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { TracerUser } from '../types'
import { authService } from '../services/authService'

interface AuthContextType {
  user: TracerUser | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<TracerUser>) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<TracerUser | null>(authService.getCurrentUser())

  const value = useMemo(
    () => ({
      user,
      login: async (email: string, password: string) => {
        try {
          const loggedInUser = authService.login(email, password)
          setUser(loggedInUser)
        } catch (error) {
          throw error
        }
      },
      register: async (userData: Partial<TracerUser>) => {
        try {
          const newUser = authService.register(userData)
          setUser(newUser)
        } catch (error) {
          throw error
        }
      },
      logout: () => {
        authService.logout()
        setUser(null)
      }
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
