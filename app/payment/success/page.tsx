'use client'

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi"
import { updateUserTier, getApiBaseUrl } from "../../lib/api"
import { useAuth } from "../../lib/auth-context"
import type { Tier } from "../../lib/api"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

async function fetchProfileWithRefresh(): Promise<{ tier: Tier } | null> {
  const raw = getCookie("unilock_session")
  if (!raw) return null
  let refreshToken: string | null = null
  try {
    const parsed = JSON.parse(raw)
    refreshToken = parsed?.user?.refreshToken ?? null
  } catch {}
  if (!refreshToken) return null

  const refreshRes = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  })
  if (!refreshRes.ok) return null
  const { accessToken } = await refreshRes.json()

  const profileRes = await fetch(`${getApiBaseUrl()}/user/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!profileRes.ok) return null
  return profileRes.json()
}

function PaymentSuccessInner() {
  const router = useRouter()
  const { refreshUserData } = useAuth()
  const [status, setStatus] = useState<"verifying" | "success" | "processing" | "cancelled" | "error">("verifying")
  const [errorMsg, setErrorMsg] = useState("")
  const [expectedTier, setExpectedTier] = useState<Tier | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const [countdown, setCountdown] = useState(7)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference")

    if (!reference) {
      const pending = sessionStorage.getItem("pending_payment")
      if (pending) {
        try {
          const { tier } = JSON.parse(pending)
          setExpectedTier(tier as Tier)
        } catch {}
        sessionStorage.removeItem("pending_payment")
      }
      setStatus("cancelled")
      return
    }

    const pending = sessionStorage.getItem("pending_payment")
    let tier: Tier | null = null

    if (pending) {
      try {
        const parsed = JSON.parse(pending)
        tier = parsed.tier as Tier
        setExpectedTier(tier)
      } catch {}
    }

    setStatus("verifying")

    fetchProfileWithRefresh()
      .then(profile => {
        if (tier && profile && profile.tier === tier) {
          updateUserTier(tier)
          sessionStorage.removeItem("pending_payment")
          refreshUserData()
          setStatus("success")
          setTimeout(() => router.replace("/dashboard"), 3000)
        } else if (tier && profile && profile.tier !== tier) {
          setStatus("processing")
        } else if (tier && !profile) {
          setStatus("processing")
        } else {
          refreshUserData()
          setStatus("success")
          setTimeout(() => router.replace("/dashboard"), 3000)
        }
      })
  }, [router, refreshUserData, retryKey])

  useEffect(() => {
    if (status !== "cancelled" && status !== "error") return
    setCountdown(7)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.replace("/settings?tab=billing")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center">
              <div className="h-8 w-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Verifying your payment...</h1>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
              <HiCheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[var(--text)]">Payment Successful!</h1>
              <p className="text-[var(--text-mute)]">
                Your plan has been upgraded. You&apos;re being redirected to your dashboard.
              </p>
            </div>
            <button
              onClick={() => router.replace("/dashboard")}
              className="btn btn-primary px-10 py-4 text-base"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === "processing" && (
          <div className="space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
              <HiClock className="h-10 w-10 text-amber-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[var(--text)]">Still Processing</h1>
              <p className="text-[var(--text-mute)]">
                Your payment was received but your plan is still being updated. This usually takes a few minutes.
                You can check again or visit your dashboard.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setRetryKey(k => k + 1)}
                className="btn btn-primary px-10 py-4 text-base"
              >
                Check Again
              </button>
              <button
                onClick={() => router.replace("/dashboard")}
                className="btn btn-secondary px-10 py-4 text-base"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {status === "cancelled" && (
          <div className="space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-slate-500/20 flex items-center justify-center">
              <HiXCircle className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[var(--text)]">Payment Cancelled</h1>
              <p className="text-[var(--text-mute)]">
                No payment was made. Your plan remains unchanged.
              </p>
              <p className="text-sm text-[var(--text-mute)]">
                Redirecting to billing settings in {countdown}...
              </p>
            </div>
            <button
              onClick={() => router.replace("/settings?tab=billing")}
              className="btn btn-primary px-10 py-4 text-base"
            >
              Billing Settings
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-rose-500/20 flex items-center justify-center">
              <HiXCircle className="h-10 w-10 text-rose-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[var(--text)]">Something went wrong</h1>
              <p className="text-[var(--text-mute)]">{errorMsg || "Please check your payment status in settings."}</p>
              <p className="text-sm text-[var(--text-mute)]">
                Redirecting to billing settings in {countdown}...
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.replace("/settings?tab=billing")}
                className="btn btn-primary px-10 py-4 text-base"
              >
                Billing Settings
              </button>
              <button
                onClick={() => router.replace("/dashboard")}
                className="btn btn-secondary px-10 py-4 text-base"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="h-8 w-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessInner />
    </Suspense>
  )
}
