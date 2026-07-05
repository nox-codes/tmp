'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"
import { loginUser } from "../lib/api"
import { useAuth } from "../lib/auth-context"
import ComingSoonAction from "../componenets/ComingSoonAction"

export default function Login() {
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "")
    const password = String(form.get("password") ?? "")

    try {
      const user = await loginUser(email, password)
      login(user)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in right now.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      <aside className="auth-brand">
        <div className="auth-brand-content">
          <h2 className="auth-brand-heading">
            Welcome back.<br />
            <span className="hero-heading-accent">Time to lock in.</span>
          </h2>

          <div className="auth-brand-stats">
            <div className="auth-brand-stat">
              <p className="auth-brand-stat-val">10,000+</p>
              <p className="auth-brand-stat-lbl">Students</p>
            </div>
            <div className="auth-brand-stat">
              <p className="auth-brand-stat-val">95%</p>
              <p className="auth-brand-stat-lbl">Pass rate</p>
            </div>
            <div className="auth-brand-stat">
              <p className="auth-brand-stat-val">12k+</p>
              <p className="auth-brand-stat-lbl">Past questions</p>
            </div>
          </div>

          <div className="auth-brand-quote">
            <p>&ldquo;I went from a 2.8 to a 4.2 in one semester. The CBT mode is unreal.&rdquo;</p>
            <div className="auth-brand-quote-author">
              <div className="auth-brand-quote-avatar bg-gradient-to-br from-teal-500 to-emerald-500">A</div>
              <div>
                <p className="auth-brand-quote-name">Adewale O.</p>
                <p className="auth-brand-quote-role">Computer Science, 300L</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-form-title">Log in to UniLock</h1>
          <p className="auth-form-sub">
            New here?{" "}
            <Link href="/register" className="auth-link">Create an account</Link>
          </p>

          <button type="button" className="auth-social" onClick={() => { window.location.href = '/api/backend/auth/google' }}>
            <FcGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </button>

          <div className="auth-divider">
            <span>or sign in with email</span>
          </div>

          <div className="auth-field">
            <label htmlFor="email">UNILAG email</label>
            <input id="email" name="email" type="email" placeholder="you@unilag.edu.ng" autoComplete="email" required />
          </div>

          <div className="auth-field">
            <div className="auth-field-inline">
              <label htmlFor="password">Password</label>
              <ComingSoonAction
                className="auth-link auth-forgot auth-link-button"
                title="Password reset"
                message="The reset email screen is not built into the product yet."
              >
                Forgot?
              </ComingSoonAction>
            </div>
            <div className="auth-input-wrap">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="auth-input-toggle"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <label className="auth-checkbox">
            <input type="checkbox" />
            <span>Keep me signed in on this device</span>
          </label>

          <button type="submit" className="btn btn-primary auth-submit">
            {loading ? "Logging in..." : "Log in"}
          </button>

          {error && <p className="auth-feedback auth-feedback-error">{error}</p>}

          <p className="auth-terms">
            By continuing you agree to our{" "}
            <ComingSoonAction className="auth-link auth-link-button" title="Terms">
              Terms
            </ComingSoonAction>{" "}
            and{" "}
            <ComingSoonAction className="auth-link auth-link-button" title="Privacy Policy">
              Privacy Policy
            </ComingSoonAction>.
          </p>
        </form>
      </main>
    </div>
  )
}
