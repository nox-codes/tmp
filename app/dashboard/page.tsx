'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineLightningBolt,
  HiOutlineTrendingUp,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineX,
} from "react-icons/hi"
import { fetchCourses, fetchUserProfile, updateUserTier, type CourseApiItem, type Tier } from "../lib/api"
import { useAuth, useRequireAuth } from "../lib/auth-context"

type CbtResult = {
  courseCode: string
  courseName: string
  score: number
  correct: number
  wrong: number
  skipped: number
  total: number
  duration: string
  timestamp: string
}

function loadHistory(): CbtResult[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("cbt_history")
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

const upcoming = [
  { time: "Tomorrow · 10am", course: "CSC 312 Mock CBT",   meta: "40 questions · 60 mins", tag: "Pending", tagType: "pending" as const },
  { time: "Wed · 2pm",       course: "MTH 201 Tutorial",   meta: "Group session · LT3",     tag: "Joined",  tagType: "ok" as const },
  { time: "Fri · 9am",       course: "STA 211 Quiz",       meta: "Graded · 25 questions",   tag: "Required", tagType: "warn" as const },
]

const leaderboard = [
  { rank: 1, name: "Adewale O.",   pts: 4820, you: false },
  { rank: 2, name: "Fatimah B.",   pts: 4610, you: false },
  { rank: 3, name: "You",          pts: 4488, you: true  },
  { rank: 4, name: "Chinedu E.",   pts: 4302, you: false },
  { rank: 5, name: "Halima Y.",    pts: 4150, you: false },
]

function buildHeatmap(history: CbtResult[]): number[] {
  const now = Date.now()
  const dayMs = 86400000
  const counts = new Array<number>(84).fill(0)
  for (const r of history) {
    const ts = new Date(r.timestamp).getTime()
    const dayIndex = Math.floor((now - ts) / dayMs)
    if (dayIndex >= 0 && dayIndex < 84) {
      counts[dayIndex]++
    }
  }
  const max = Math.max(...counts, 1)
  return counts.map(c => {
    if (c === 0) return 0
    const ratio = c / max
    if (ratio <= 0.25) return 1
    if (ratio <= 0.5) return 2
    if (ratio <= 0.75) return 3
    return 4
  })
}

const COLORS = ["teal", "amber", "green", "purple"]

const STAT_BG: Record<string, string> = {
  teal:   "bg-teal-500/10 text-teal-400",
  amber:  "bg-amber-500/10 text-amber-400",
  green:  "bg-emerald-500/10 text-emerald-400",
  purple: "bg-violet-500/10 text-violet-400",
}

export default function Dashboard() {
  const { user } = useRequireAuth()
  const { refreshUserData } = useAuth()
  const [backendCourses, setBackendCourses] = useState<CourseApiItem[]>([])
  const [courseNote, setCourseNote] = useState("")
  const [pendingTier, setPendingTier] = useState<Tier | null>(null)
  const [checkingPayment, setCheckingPayment] = useState(false)

  const history = useMemo(() => loadHistory(), [])
  const totalAttempts = history.length
  const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s, r) => s + r.score, 0) / totalAttempts) : 0
  const totalMinutes = history.reduce((s, r) => {
    const m = parseInt(r.duration)
    return s + (isNaN(m) ? 0 : m)
  }, 0)
  const streak = 0
  const recentCBT = history.slice(-4).reverse().map(r => ({
    course: `${r.courseCode} — ${r.courseName}`,
    score: r.score,
    attempted: timeAgo(r.timestamp),
    questions: r.total,
  }))

  const scoreTrend = useMemo(() => {
    const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    return sorted.slice(-7).map(r => r.score)
  }, [history])

  const scoreLabels = useMemo(() => {
    const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    return sorted.slice(-7).map(r => {
      const d = new Date(r.timestamp)
      return `${d.getMonth() + 1}/${d.getDate()}`
    })
  }, [history])

  const heatmap = useMemo(() => buildHeatmap(history), [history])
  const lastScore = history.length > 0 ? history[history.length - 1].score : null
  const scoreDiff = history.length >= 2 ? history[history.length - 1].score - history[history.length - 2].score : null

  const stats = [
    { label: "Latest score",    value: lastScore !== null ? `${lastScore}%` : "—", trend: scoreDiff !== null ? `${scoreDiff >= 0 ? "+" : ""}${scoreDiff}%` : "—", color: "teal",   Icon: HiOutlineAcademicCap },
    { label: "Study streak",    value: streak > 0 ? `${streak} days` : "0 days", trend: "🔥",    color: "amber",  Icon: HiOutlineFire },
    { label: "CBT avg score",   value: `${avgScore}%`,  trend: totalAttempts > 0 ? `${avgScore}%` : "—",  color: "green",  Icon: HiOutlineLightningBolt },
    { label: "Study time / wk", value: `${Math.round(totalMinutes / 60)} hr`, trend: totalMinutes > 0 ? `${Math.round(totalMinutes / 60)}h` : "—",  color: "purple", Icon: HiOutlineClock },
  ]

  useEffect(() => {
    if (!user) return
    const raw = sessionStorage.getItem("pending_payment")
    if (raw) {
      try {
        const { tier } = JSON.parse(raw)
        if (tier !== user.tier) {
          setPendingTier(tier as Tier)
        } else {
          sessionStorage.removeItem("pending_payment")
        }
      } catch {}
    }
  }, [user])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const courses = await fetchCourses()
        if (!active) return
        if (Array.isArray(courses) && courses.length > 0) {
          setBackendCourses(courses)
          setCourseNote("Synced with backend course data.")
        } else {
          setCourseNote("")
        }
      } catch {
        if (active) setCourseNote("Could not load courses from server.")
      }
    }
    load()
    return () => { active = false }
  }, [])

  const displayCourses = backendCourses.length > 0
    ? backendCourses.slice(0, 4).map((c, i) => ({
        code: c.code,
        name: c.title,
        progress: Math.min(100, (c.questions?.length ?? 0) * 10),
        units: c.units,
        color: COLORS[i % COLORS.length],
      }))
    : [
        { code: "CSC 312", name: "Algorithms & Complexity",   progress: 78, units: 3, color: "teal" },
        { code: "MTH 201", name: "Calculus II",               progress: 62, units: 4, color: "amber" },
        { code: "STA 211", name: "Probability & Statistics",  progress: 91, units: 3, color: "green" },
        { code: "PHY 102", name: "General Physics II",        progress: 45, units: 3, color: "purple" },
      ]

  const recommended = backendCourses.length > 0
    ? backendCourses.slice(4, 7).map((c) => ({
        code: c.code,
        name: c.title,
        reason: "Available in your course library",
      }))
    : [
        { code: "CSC 314", name: "Operating Systems",     reason: "Based on your strength in CSC 312" },
        { code: "MTH 202", name: "Linear Algebra",        reason: "Builds on Calculus II progress" },
        { code: "CSC 318", name: "Software Engineering",  reason: "Highly rated by your classmates" },
      ]

  const name = user?.username?.split(" ")[0] ?? "Student"

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Welcome back, {name}</h1>
          <p className="dash-welcome-sub">
            You&apos;ve studied <strong className="text-[var(--text)]">{Math.round(totalMinutes / 60)} hour{Math.round(totalMinutes / 60) !== 1 ? "s" : ""}</strong> this week.
            {courseNote && <span className="dash-welcome-note ml-2">· {courseNote}</span>}
          </p>
        </div>
        <div className="dash-welcome-actions">
          <Link href="/cbt" className="btn btn-secondary btn-sm px-6 py-2.5">Practice CBT</Link>
          <Link href="/library" className="btn btn-primary btn-sm px-6 py-2.5">
            <HiOutlineLightningBolt /> Start Study Mode
          </Link>
        </div>
      </div>

      <section className="dash-stats">
        {stats.map((s) => (
          <div key={s.label} className="dash-stat p-6 md:p-7">
            <div className={`dash-stat-icon ${STAT_BG[s.color]}`}>
              <s.Icon className="h-6 w-6" />
            </div>
            <div className="dash-stat-info">
              <p className="dash-stat-label">{s.label}</p>
              <p className="dash-stat-value text-xl">{s.value}</p>
            </div>
            <span className="dash-stat-trend">{s.trend}</span>
          </div>
        ))}
      </section>

      <section className="dash-card p-8 md:p-10 mb-8 border border-[var(--accent)]/20 bg-[var(--accent-soft)]/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center shrink-0">
              <HiOutlineCreditCard className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Current Plan</p>
              <p className="text-xl font-bold text-[var(--text)]">
                {user?.tier === "FULL" ? "Premium" : user?.tier === "HALF" ? "Basic" : "Free"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {user?.tier === "FREE" && (
              <Link href="/settings?tab=billing" className="btn btn-primary btn-sm px-6 py-2.5">
                Upgrade to Basic
              </Link>
            )}
            {user?.tier === "HALF" && (
              <Link href="/settings?tab=billing" className="btn btn-primary btn-sm px-6 py-2.5">
                Upgrade to Premium
              </Link>
            )}
            {user?.tier === "FULL" && (
              <Link href="/settings?tab=billing" className="btn btn-secondary btn-sm px-6 py-2.5 flex items-center gap-2">
                <HiOutlineCog className="h-4 w-4" /> Manage
              </Link>
            )}
          </div>
        </div>
      </section>

      {pendingTier && (
        <section className="dash-card p-6 mb-8 border border-amber-500/30 bg-amber-500/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <HiOutlineClock className="h-6 w-6 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-[var(--text)]">
                  {pendingTier === "FULL" ? "Premium" : "Basic"} upgrade pending
                </p>
                <p className="text-sm text-[var(--text-mute)]">
                  {checkingPayment ? "Checking your account..." : "You started an upgrade. Check if it went through or dismiss this notice."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={async () => {
                  setCheckingPayment(true)
                  try {
                    const profile = await fetchUserProfile()
                    const raw = sessionStorage.getItem("pending_payment")
                    if (raw) {
                      const { tier } = JSON.parse(raw)
                      if (profile.tier === tier) {
                        updateUserTier(tier)
                        sessionStorage.removeItem("pending_payment")
                        setPendingTier(null)
                        refreshUserData()
                      }
                    }
                  } catch {}
                  setCheckingPayment(false)
                }}
                disabled={checkingPayment}
                className="btn btn-secondary btn-sm px-6 py-2.5 shrink-0"
              >
                {checkingPayment ? "Checking..." : "Check Now"}
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem("pending_payment")
                  setPendingTier(null)
                }}
                className="btn btn-secondary btn-sm px-3 py-2.5"
                aria-label="Dismiss"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="dash-grid">
        <section className="dash-card dash-card-wide p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Score Trend</h2>
              <p className="dash-card-sub">Last {Math.max(scoreTrend.length, 1)} attempt{scoreTrend.length !== 1 ? "s" : ""}</p>
            </div>
            {scoreTrend.length >= 2 && (
              <span className={`dash-trend-${scoreDiff !== null && scoreDiff > 0 ? "up" : "down"}`}>
                <HiOutlineTrendingUp className={scoreDiff !== null && scoreDiff < 0 ? "rotate-180" : ""} />
                {scoreDiff !== null ? `${scoreDiff >= 0 ? "+" : ""}${scoreDiff}%` : ""}
              </span>
            )}
          </div>
          {scoreTrend.length > 0 ? (
            <div className="dash-gpa-chart mt-6">
              <svg viewBox="0 0 700 200" className="dash-gpa-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="scoreArea" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 25, 50, 75, 100].map((g) => (
                  <line key={g} x1={0} x2={700} y1={200 - (g / 100) * 200} y2={200 - (g / 100) * 200} stroke="rgba(148,163,184,0.08)" />
                ))}
                <path
                  d={scoreTrend.map((v, i) => {
                    const x = (i * 700) / (scoreTrend.length - 1)
                    const y = 200 - (v / 100) * 200
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`
                  }).join(" ") + ` L 700 200 L 0 200 Z`}
                  fill="url(#scoreArea)"
                />
                <path
                  d={scoreTrend.map((v, i) => {
                    const x = (i * 700) / (scoreTrend.length - 1)
                    const y = 200 - (v / 100) * 200
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`
                  }).join(" ")}
                  fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
                {scoreTrend.map((v, i) => {
                  const x = (i * 700) / (scoreTrend.length - 1)
                  const y = 200 - (v / 100) * 200
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={5} fill="var(--bg)" stroke="#2dd4bf" strokeWidth="2" />
                    </g>
                  )
                })}
              </svg>
              <div className="dash-gpa-labels mt-6">
                {scoreLabels.map((l) => <span key={l}>{l}</span>)}
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center py-8 text-[var(--text-mute)]">
              <p>Complete a CBT exam to see your score trend.</p>
            </div>
          )}
        </section>

        <section className="dash-card p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Study activity</h2>
              <p className="dash-card-sub">Last 12 weeks</p>
            </div>
          </div>
          {history.length > 0 ? (
            <>
              <div className="dash-heatmap mt-8">
                {heatmap.map((v, i) => (
                  <span key={i} className={`dash-heat dash-heat-${v}`} title={`Day ${i + 1}`} />
                ))}
              </div>
              <div className="dash-heatmap-legend mt-6">
                <span>Less</span>
                <span className="dash-heat dash-heat-0" />
                <span className="dash-heat dash-heat-1" />
                <span className="dash-heat dash-heat-2" />
                <span className="dash-heat dash-heat-3" />
                <span className="dash-heat dash-heat-4" />
                <span>More</span>
              </div>
            </>
          ) : (
            <div className="mt-8 text-center py-8 text-[var(--text-mute)]">
              <p>Complete a CBT exam to see your study activity heatmap.</p>
            </div>
          )}
        </section>

        <section className="dash-card dash-card-wide p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Recent CBT scores</h2>
              <p className="dash-card-sub">Last 4 attempts</p>
            </div>
            <Link href="/analytics" className="dash-card-link">View all <HiOutlineChevronRight /></Link>
          </div>
          {recentCBT.length > 0 ? (
            <ul className="dash-cbt-list mt-6">
              {recentCBT.map((c) => (
                <li key={c.course} className="dash-cbt-item py-5">
                  <div className="dash-cbt-meta">
                    <p className="dash-cbt-course text-base">{c.course}</p>
                    <p className="dash-cbt-sub text-sm">{c.questions} q · {c.attempted}</p>
                  </div>
                  <div className="dash-cbt-score-wrap">
                    <div className="dash-cbt-bar">
                      <span
                        className={`dash-cbt-bar-fill ${c.score >= 85 ? "bg-emerald-400" : c.score >= 70 ? "bg-teal-400" : "bg-amber-400"}`}
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                    <span className="dash-cbt-score text-base">{c.score}%</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 text-center py-8 text-[var(--text-mute)]">
              <p>No CBT attempts yet. Take your first quiz to see scores here.</p>
              <Link href="/cbt" className="btn btn-primary btn-sm mt-4 px-6 py-2.5 inline-block">
                Start a Quiz
              </Link>
            </div>
          )}
        </section>

        <section className="dash-card p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Course progress</h2>
              <p className="dash-card-sub">This semester</p>
            </div>
            <Link href="/library" className="dash-card-link">Library <HiOutlineChevronRight /></Link>
          </div>
          <ul className="dash-courses mt-8 space-y-6">
            {displayCourses.map((c) => (
              <li key={c.code} className="dash-course">
                <div className="dash-course-head">
                  <span className="dash-course-code text-base">{c.code}</span>
                  <span className="dash-course-pct text-base">{c.progress}%</span>
                </div>
                <p className="dash-course-name text-base">{c.name}</p>
                <div className="dash-progress mt-3">
                  <span
                    className={`dash-progress-fill ${c.color === "teal" ? "bg-teal-400" : c.color === "amber" ? "bg-amber-400" : c.color === "green" ? "bg-emerald-400" : "bg-violet-400"}`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-card p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Upcoming</h2>
              <p className="dash-card-sub">Next 7 days</p>
            </div>
          </div>
          <ul className="dash-upcoming mt-8 space-y-4">
            {upcoming.map((u) => (
              <li key={u.course} className="dash-upcoming-item py-4">
                <span className="dash-upcoming-time text-sm">{u.time}</span>
                <div className="dash-upcoming-info">
                  <p className="dash-upcoming-course text-base">{u.course}</p>
                  <p className="dash-upcoming-meta text-sm">{u.meta}</p>
                </div>
                <span className={`dash-upcoming-tag dash-upcoming-tag-${u.tagType} text-xs px-3 py-1`}>{u.tag}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-card p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Recommended for you</h2>
              <p className="dash-card-sub">Powered by your performance</p>
            </div>
          </div>
          <ul className="dash-recommend mt-8 space-y-4">
            {recommended.map((r) => (
              <li key={r.code} className="dash-recommend-item py-4">
                <div>
                  <p className="dash-recommend-code text-base">{r.code}</p>
                  <p className="dash-recommend-name text-base">{r.name}</p>
                  <p className="dash-recommend-reason text-sm"><HiOutlineCheckCircle className="inline h-4 w-4 mr-1 text-teal-400" />{r.reason}</p>
                </div>
                <Link href="/library" className="btn btn-secondary btn-sm px-6 py-2.5">Open</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-card p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Department leaderboard</h2>
              <p className="dash-card-sub">CS · 300L this week</p>
            </div>
            <Link href="/groups" className="dash-card-link">Groups <HiOutlineChevronRight /></Link>
          </div>
          <ol className="dash-leaderboard mt-6 space-y-3">
            {leaderboard.map((l) => (
              <li key={l.rank} className={`dash-leader ${l.you ? "dash-leader-you" : ""} py-3`}>
                <span className="dash-leader-rank text-base">#{l.rank}</span>
                <span className="dash-leader-name text-base">{l.name}</span>
                <span className="dash-leader-pts text-sm">{l.pts.toLocaleString()} pts</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
