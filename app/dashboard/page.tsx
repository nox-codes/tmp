'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
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
} from "react-icons/hi"
import { fetchCourses, type CourseApiItem } from "../lib/api"
import { useRequireAuth } from "../lib/auth-context"

const stats = [
  { label: "Current GPA",      value: "4.32", trend: "+0.18", color: "teal",   Icon: HiOutlineAcademicCap },
  { label: "Study streak",     value: "12 days", trend: "🔥",    color: "amber",  Icon: HiOutlineFire },
  { label: "CBT avg score",    value: "82%",  trend: "+6%",  color: "green",  Icon: HiOutlineLightningBolt },
  { label: "Study time / wk",  value: "23 hr", trend: "+3h",  color: "purple", Icon: HiOutlineClock },
]

const gpaTrend = [3.5, 3.7, 3.6, 3.9, 4.0, 4.1, 4.32]
const gpaLabels = ["1L1", "1L2", "2L1", "2L2", "3L1", "3L2", "Now"]

const recentCBT = [
  { course: "CSC 312 — Algorithms",   score: 88, attempted: "2 hrs ago",  questions: 40 },
  { course: "MTH 201 — Calculus II",  score: 76, attempted: "Yesterday",  questions: 30 },
  { course: "STA 211 — Probability",  score: 92, attempted: "2 days ago", questions: 25 },
  { course: "ENG 201 — Use of English", score: 81, attempted: "3 days ago", questions: 35 },
]

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

const heatmap = Array.from({ length: 84 }, (_, i) => {
  const seed = (i * 7 + 3) % 11
  if (seed < 2) return 0
  if (seed < 5) return 1
  if (seed < 8) return 2
  if (seed < 10) return 3
  return 4
})

const COLORS = ["teal", "amber", "green", "purple"]

const STAT_BG: Record<string, string> = {
  teal:   "bg-teal-500/10 text-teal-400",
  amber:  "bg-amber-500/10 text-amber-400",
  green:  "bg-emerald-500/10 text-emerald-400",
  purple: "bg-violet-500/10 text-violet-400",
}

export default function Dashboard() {
  const { user } = useRequireAuth()
  const [backendCourses, setBackendCourses] = useState<CourseApiItem[]>([])
  const [courseNote, setCourseNote] = useState("")

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
            You&apos;ve studied <strong className="text-[var(--text)]">3 hours</strong> this week. Keep that 12-day streak alive.
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

      <div className="dash-grid">
        <section className="dash-card dash-card-wide p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">GPA Trend</h2>
              <p className="dash-card-sub">Across 7 semesters</p>
            </div>
            <span className="dash-trend-up">
              <HiOutlineTrendingUp /> +0.82 vs first semester
            </span>
          </div>
          <div className="dash-gpa-chart mt-6">
            <svg viewBox="0 0 700 200" className="dash-gpa-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gpaArea" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((g) => (
                <line key={g} x1={0} x2={700} y1={(g * 200) / 4} y2={(g * 200) / 4} stroke="rgba(148,163,184,0.08)" />
              ))}
              <path
                d={gpaTrend.map((v, i) => {
                  const x = (i * 700) / (gpaTrend.length - 1)
                  const y = 200 - (v / 5) * 200
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`
                }).join(" ") + ` L 700 200 L 0 200 Z`}
                fill="url(#gpaArea)"
              />
              <path
                d={gpaTrend.map((v, i) => {
                  const x = (i * 700) / (gpaTrend.length - 1)
                  const y = 200 - (v / 5) * 200
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`
                }).join(" ")}
                fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              />
              {gpaTrend.map((v, i) => {
                const x = (i * 700) / (gpaTrend.length - 1)
                const y = 200 - (v / 5) * 200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={5} fill="var(--bg)" stroke="#2dd4bf" strokeWidth="2" />
                  </g>
                )
              })}
            </svg>
            <div className="dash-gpa-labels mt-6">
              {gpaLabels.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </section>

        <section className="dash-card p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Study activity</h2>
              <p className="dash-card-sub">Last 12 weeks</p>
            </div>
          </div>
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
        </section>

        <section className="dash-card dash-card-wide p-8 md:p-10">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title text-xl">Recent CBT scores</h2>
              <p className="dash-card-sub">Last 4 attempts</p>
            </div>
            <Link href="/analytics" className="dash-card-link">View all <HiOutlineChevronRight /></Link>
          </div>
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
