'use client'

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HiCheckCircle, HiXCircle } from "react-icons/hi"
import { updateUserTier } from "../../lib/api"
import type { Tier } from "../../lib/api"

function PaymentSuccessInner() {
  const router = useRouter()
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference")
    const pending = sessionStorage.getItem("pending_payment")

    if (!reference) {
      setStatus("error")
      setErrorMsg("No payment reference found.")
      return
    }

    if (pending) {
      try {
        const { tier } = JSON.parse(pending)
        updateUserTier(tier as Tier)
        sessionStorage.removeItem("pending_payment")
      } catch {}
    }

    setStatus("success")

    const timer = setTimeout(() => {
      router.replace("/dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

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

        {status === "error" && (
          <div className="space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-rose-500/20 flex items-center justify-center">
              <HiXCircle className="h-10 w-10 text-rose-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[var(--text)]">Something went wrong</h1>
              <p className="text-[var(--text-mute)]">{errorMsg || "Please check your payment status in settings."}</p>
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
