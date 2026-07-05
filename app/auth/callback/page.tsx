'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../../lib/auth-context"

export default function AuthCallback() {
  const router = useRouter()
  const { login } = useAuth()
  const [message, setMessage] = useState('Completing sign-in...')

  useEffect(() => {
    let cancelled = false

    async function exchange() {
      try {
        const res = await fetch('/api/auth/exchange')
        if (res.ok && !cancelled) {
          const data = await res.json()
          if (data.accessToken) {
            login({ ...data.user, accessToken: data.accessToken, refreshToken: data.refreshToken || '' })
            if (!cancelled) {
              setMessage('Sign-in successful! Redirecting...')
              setTimeout(() => router.push('/dashboard'), 1000)
            }
            return
          }
        }
      } catch {}

      if (!cancelled) {
        setMessage('Sign-in not detected. Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      }
    }

    exchange()
    return () => { cancelled = true }
  }, [router, login])

  return (
    <div className="auth-split">
      <div className="auth-form-panel" style={{ margin: '0 auto', maxWidth: 480 }}>
        <div className="auth-form" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
          <h1 className="auth-form-title" style={{ fontSize: '1.5rem' }}>{message}</h1>
        </div>
      </div>
    </div>
  )
}
