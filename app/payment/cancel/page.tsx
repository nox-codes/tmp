'use client'

import Link from "next/link"
import { HiXCircle } from "react-icons/hi"

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="h-16 w-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
          <HiXCircle className="h-10 w-10 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--text)]">Payment Cancelled</h1>
          <p className="text-[var(--text-mute)]">
            Your payment was not completed. No charges were made. You can try again whenever you&apos;re ready.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/pricing" className="btn btn-primary px-10 py-4 text-base">
            View Plans
          </Link>
          <Link href="/dashboard" className="btn btn-secondary px-10 py-4 text-base">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
