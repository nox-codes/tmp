'use client'

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { HiOutlineEye, HiOutlineEyeOff, HiCheck } from "react-icons/hi"
import { getApiBaseUrl, registerUser, verifyEmail } from "../lib/api"
import ComingSoonAction from "../componenets/ComingSoonAction"

const perks = [
  "Free forever plan, no card required",
  "Access curated UNILAG course materials",
  "Practice with real CBT past questions",
  "Track your GPA & study streaks",
  "Join study groups across your faculty",
]

export default function Register() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [faculty, setFaculty] = useState("Science")
  const [level, setLevel] = useState("100")
  const [department, setDepartment] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [awaitingVerification, setAwaitingVerification] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setFeedback("")

    if (awaitingVerification) {
      setLoading(true)
      try {
        const result = await verifyEmail(email, verificationCode)
        setFeedback(result.message)
        router.push("/login")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify this email right now.")
      } finally {
        setLoading(false)
      }
      return
    }

    if (step === 1) {
      setStep(2)
      return
    }

    setLoading(true)
    try {
      const result = await registerUser({
        username: `${firstName} ${lastName}`.trim(),
        email,
        password,
        faculty,
        department,
        level: Number(level),
      })
      setFeedback(result.message)
      setAwaitingVerification(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account right now.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      {/* Brand panel */}
      <aside className="auth-brand auth-brand-register">
        <div className="auth-brand-grid" />
        <div className="auth-brand-glow" />

        <Link href="/" className="auth-brand-logo">
          <Image width={36} height={36} src="/logo-nobg.png" alt="UniLock" />
          <span>UniLock</span>
        </Link>

        <div className="auth-brand-content">
          <h2 className="auth-brand-heading">
            Start free.<br />
            <span className="hero-heading-accent">Study smarter today.</span>
          </h2>

          <ul className="auth-perks">
            {perks.map((p) => (
              <li key={p}>
                <span className="auth-perk-check"><HiCheck /></span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="auth-brand-trust">
            <div className="auth-brand-trust-avatars">
              <span className="auth-trust-av bg-gradient-to-br from-teal-500 to-emerald-500">A</span>
              <span className="auth-trust-av bg-gradient-to-br from-amber-500 to-rose-500">F</span>
              <span className="auth-trust-av bg-gradient-to-br from-violet-500 to-fuchsia-500">C</span>
              <span className="auth-trust-av bg-gradient-to-br from-sky-500 to-teal-500">H</span>
            </div>
            <p>Joined by 10,000+ UNILAG students this session</p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="auth-form-panel">
        <div className="auth-form-mobile-logo">
          <Link href="/" className="footer-brand">
            <Image width={32} height={32} src="/logo.svg" alt="UniLock" />
            <span className="footer-brand-text">UniLock</span>
          </Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-step-indicator">
            <span className={`auth-step ${step >= 1 ? "auth-step-on" : ""}`}>1</span>
            <span className="auth-step-line" />
            <span className={`auth-step ${step >= 2 ? "auth-step-on" : ""}`}>2</span>
          </div>

          <h1 className="auth-form-title">
            {awaitingVerification ? "Verify your email" : step === 1 ? "Create your account" : "Tell us about you"}
          </h1>
          <p className="auth-form-sub">
            {awaitingVerification ? (
              <>Enter the code sent to <strong>{email}</strong>.</>
            ) : (
              <>
                Already on UniLock?{" "}
                <Link href="/login" className="auth-link">Log in</Link>
              </>
            )}
          </p>

          {awaitingVerification ? (
            <>
              <div className="auth-field">
                <label htmlFor="verificationCode">Verification code</label>
                <input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  placeholder="6-digit code"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary auth-submit">
                {loading ? "Verifying..." : "Verify email"}
              </button>
            </>
          ) : step === 1 ? (
            <>
              <button type="button" className="auth-social" onClick={() => { window.location.href = `${getApiBaseUrl()}/auth/google` }}>
                <FcGoogle className="h-5 w-5" />
                <span>Sign up with Google</span>
              </button>

              <div className="auth-divider">
                <span>or with email</span>
              </div>

              <div className="auth-field-row">
                <div className="auth-field">
                  <label htmlFor="first">First name</label>
                  <input id="first" type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Ayodele" required />
                </div>
                <div className="auth-field">
                  <label htmlFor="last">Last name</label>
                  <input id="last" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Adekunle" required />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="email">UNILAG email</label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@unilag.edu.ng" required />
                <p className="auth-field-hint">Use your school email for instant verification.</p>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
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

              <button type="submit" className="btn btn-primary auth-submit">
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="auth-field">
                <label htmlFor="matric">Matric number</label>
                <input id="matric" type="text" placeholder="e.g. 219024050" required />
              </div>

              <div className="auth-field-row">
                <div className="auth-field">
                  <label htmlFor="faculty">Faculty</label>
                  <select id="faculty" value={faculty} onChange={(event) => setFaculty(event.target.value)}>
                    <option value="Science">Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Arts">Arts</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Management Sciences">Management Sciences</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Law">Law</option>
                  </select>
                </div>
                <div className="auth-field">
                  <label htmlFor="level">Level</label>
                  <select id="level" value={level} onChange={(event) => setLevel(event.target.value)}>
                    <option value="100">100L</option>
                    <option value="200">200L</option>
                    <option value="300">300L</option>
                    <option value="400">400L</option>
                    <option value="500">500L</option>
                  </select>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="dept">Department</label>
                <input id="dept" type="text" value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Computer Science" required />
              </div>

              <label className="auth-checkbox">
                <input type="checkbox" required />
                <span>
                  I agree to the{" "}
                  <ComingSoonAction className="auth-link auth-link-button" title="Terms">
                    Terms
                  </ComingSoonAction>{" "}
                  and{" "}
                  <ComingSoonAction className="auth-link auth-link-button" title="Privacy Policy">
                    Privacy Policy
                  </ComingSoonAction>.
                </span>
              </label>

              <div className="auth-actions-row">
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                  Back
                </button>
                <button type="submit" className="btn btn-primary auth-submit-inline">
                  {loading ? "Creating..." : "Create account"}
                </button>
              </div>
            </>
          )}

          {feedback && <p className="auth-feedback auth-feedback-success">{feedback}</p>}
          {error && <p className="auth-feedback auth-feedback-error">{error}</p>}
        </form>
      </main>
    </div>
  )
}
