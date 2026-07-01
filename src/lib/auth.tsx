"use client"

import {
  createContext, useContext, useEffect, useState, ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"
import { MOCK_USER } from "@/lib/mock/data"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("thumbfi_session")
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const persist = (u: User) => {
    setUser(u)
    localStorage.setItem("thumbfi_session", JSON.stringify(u))
  }

  const login = async (email: string, _pw: string) => {
    await new Promise(r => setTimeout(r, 900))
    persist({ ...MOCK_USER, email })
    return {}
  }

  const signup = async (name: string, email: string, _pw: string) => {
    await new Promise(r => setTimeout(r, 1100))
    persist({ ...MOCK_USER, name, email, plan: "free", credits_limit: 20, credits_used: 0, thumb_balance: 0 })
    return {}
  }

  const loginWithGoogle = async () => {
    await new Promise(r => setTimeout(r, 800))
    persist(MOCK_USER)
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("thumbfi_session")
  }

  const forgotPassword = async (email: string) => {
    await new Promise(r => setTimeout(r, 800))
    return {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
