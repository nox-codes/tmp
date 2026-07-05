'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthUser, Tier } from './api'
import { getApiBaseUrl, checkout } from './api'

const SESSION_COOKIE = 'unilock_session'
const GENDER_COOKIE = 'unilock_gender'

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  if (days > 0) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
  } else {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function eraseCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

type SessionData = {
  user: AuthUser
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (user: AuthUser, rememberMe?: boolean) => void
  logout: () => void
  refreshUser: () => Promise<void>
  refreshUserData: () => Promise<void>
  gender: 'male' | 'female'
  setGender: (g: 'male' | 'female') => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [gender, setGenderState] = useState<'male' | 'female'>('male')

  useEffect(() => {
    let active = true
    async function init() {
      const raw = getCookie(SESSION_COOKIE)
      if (raw) {
        try {
          const parsed: SessionData = JSON.parse(raw)
          if (parsed?.user?.accessToken) {
            if (active) setUser(parsed.user)
            const savedGender = getCookie(GENDER_COOKIE)
            if (savedGender === 'female' || savedGender === 'male') {
              if (active) setGenderState(savedGender)
            }
            if (active) setLoading(false)
            return
          }
        } catch {}
      }

      const savedGender = getCookie(GENDER_COOKIE)
      if (savedGender === 'female' || savedGender === 'male') {
        if (active) setGenderState(savedGender)
      }
      if (active) setLoading(false)
    }
    init()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (loading || !user) return
    const pending = sessionStorage.getItem('pending_checkout') as Tier | null
    if (pending === 'HALF' || pending === 'FULL') {
      sessionStorage.removeItem('pending_checkout')
      checkout(pending).then(res => {
        window.location.href = res.checkoutUrl
      }).catch(() => {})
    }
  }, [user, loading])

  const login = useCallback((userData: AuthUser, rememberMe = true) => {
    const session: SessionData = { user: userData }
    setCookie(SESSION_COOKIE, JSON.stringify(session), rememberMe ? 30 : 0)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    eraseCookie(SESSION_COOKIE)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: user?.refreshToken }),
      })
      if (!res.ok) throw new Error('Refresh failed')
      const data = await res.json()
      if (user) {
        const updated: AuthUser = { ...user, accessToken: data.accessToken }
        const session: SessionData = { user: updated }
        setCookie(SESSION_COOKIE, JSON.stringify(session), 30)
        setUser(updated)
      }
    } catch {
      logout()
    }
  }, [user, logout])

  const refreshUserData = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: user.refreshToken }),
      })
      if (!res.ok) throw new Error('Refresh data failed')
      const { accessToken } = await res.json()

      const profileRes = await fetch(`${getApiBaseUrl()}/user/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        const updated: AuthUser = { ...user, ...profileData, accessToken, refreshToken: user.refreshToken }
        const session: SessionData = { user: updated }
        setCookie(SESSION_COOKIE, JSON.stringify(session), 30)
        setUser(updated)
        return
      }

      const updated: AuthUser = { ...user, accessToken }
      const session: SessionData = { user: updated }
      setCookie(SESSION_COOKIE, JSON.stringify(session), 30)
      setUser(updated)
    } catch {
      logout()
    }
  }, [user, logout])

  const setGender = useCallback((g: 'male' | 'female') => {
    setCookie(GENDER_COOKIE, g, 365)
    setGenderState(g)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, refreshUserData, gender, setGender }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  return { user, loading }
}
