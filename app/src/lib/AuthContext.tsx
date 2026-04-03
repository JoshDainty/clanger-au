import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

/* ─── Dev-only demo user (bypasses Supabase) ─── */
const DEV_DEMO_EMAIL = 'demo@clanger.au'
const DEV_DEMO_PASSWORD = 'demo1234'

const DEMO_USER: User = {
  id: 'demo-user-001',
  email: DEV_DEMO_EMAIL,
  user_metadata: { display_name: 'JoshDainty' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2026-03-01T00:00:00Z',
} as User

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [demoUser, setDemoUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    // Dev demo bypass
    if (import.meta.env.DEV && email === DEV_DEMO_EMAIL && password === DEV_DEMO_PASSWORD) {
      setDemoUser(DEMO_USER)
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error as Error | null }
  }

  const signIn = async (email: string, password: string) => {
    // Dev demo bypass
    if (import.meta.env.DEV && email === DEV_DEMO_EMAIL && password === DEV_DEMO_PASSWORD) {
      setDemoUser(DEMO_USER)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    setDemoUser(null)
    await supabase.auth.signOut()
  }

  const activeUser = demoUser ?? session?.user ?? null

  return (
    <AuthContext.Provider
      value={{
        session,
        user: activeUser,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
