'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi"
import { fetchCourses, fetchQuestions, type CourseApiItem } from "../lib/api"
import { useAuth } from "../lib/auth-context"
import ComingSoonAction from "../componenets/ComingSoonAction"

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

type CourseWithCount = CourseApiItem & {
  questionCount: number
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

function computeStats(history: CbtResult[]) {
  const total = history.length
  if (total === 0) {
    return { totalAttempts: 0, avgScore: 0, totalTime: "0 hr", streak: 0 }
  }
  const avgScore = Math.round(history.reduce((s, r) => s + r.score, 0) / total)
  const totalMinutes = history.reduce((s, r) => {
    const m = parseInt(r.duration)
    return s + (isNaN(m) ? 0 : m)
  }, 0)
  const totalHours = Math.round(totalMinutes / 60)
  const streak = 0
  return {
    totalAttempts: total,
    avgScore,
    totalTime: `${totalHours} hr`,
    streak,
  }
}

export default function CBTPage() {
  const { user } = useAuth()
  const tier = user?.tier ?? "FREE"
  const dailyLimit = tier === "FREE" ? 20 : Infinity

  const [selectedCourse, setSelectedCourse] = useState("")
  const [duration, setDuration] = useState(60)
  const [numQs, setNumQs] = useState(20)
  const [mode, setMode] = useState<"timed" | "practice">("timed")
  const [courses, setCourses] = useState<CourseWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<CbtResult[]>([])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [courseData, allQuestions] = await Promise.all([
          fetchCourses(),
          fetchQuestions().catch(() => []),
        ])
        if (!active) return

        const counts = new Map<string, number>()
        for (const q of allQuestions) {
          const code = q.course?.code
          if (code) counts.set(code, (counts.get(code) ?? 0) + 1)
        }

        if (Array.isArray(courseData) && courseData.length > 0) {
          const withCounts = courseData.map(c => ({ ...c, questionCount: counts.get(c.code) ?? 0 }))
          setCourses(withCounts)
          setSelectedCourse(withCounts[0].code)
        } else {
          setError("No courses available yet.")
        }
      } catch (err) {
        console.error('[CBT] Failed to load courses:', err)
        if (active) setError("Could not load courses from server.")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    setHistory(loadHistory())
    return () => { active = false }
  }, [])

  const stats = useMemo(() => computeStats(history), [history])

  const selected = courses.find((c: CourseWithCount) => c.code === selectedCourse) ?? courses[0]
  const availableCount = selected?.questionCount ?? 0
  const maxSelectable = Math.min(availableCount, dailyLimit)
  const selectedQuestionCount = Math.min(numQs, maxSelectable)

  if (loading) {
    return (
      <div className="dash">
        <div className="dash-welcome">
          <div>
            <h1 className="dash-welcome-title display">CBT Mode</h1>
            <p className="dash-welcome-sub">Loading courses...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dash">
        <div className="dash-welcome">
          <div>
            <h1 className="dash-welcome-title display">CBT Mode</h1>
            <p className="dash-welcome-sub text-rose-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">CBT Mode</h1>
          <p className="dash-welcome-sub">
            Practice with real UNILAG past questions under exam conditions.
          </p>
          {tier === "FREE" && (
            <p className="dash-welcome-sub dash-welcome-note">
              Free plan: {dailyLimit} questions per session.
            </p>
          )}
        </div>
        <div className="dash-welcome-actions">
          <span className="cbt-streak"><HiOutlineLightningBolt /> {stats.streak}-day streak</span>
        </div>
      </div>

      <section className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-icon bg-teal-500/10 text-teal-400">
            <HiOutlineDocumentText className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Total attempts</p>
            <p className="dash-stat-value">{stats.totalAttempts}</p>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-emerald-500/10 text-emerald-400">
            <HiOutlineCheckCircle className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Average score</p>
            <p className="dash-stat-value">{stats.avgScore}%</p>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-amber-500/10 text-amber-400">
            <HiOutlineClock className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Time practiced</p>
            <p className="dash-stat-value">{stats.totalTime}</p>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-violet-500/10 text-violet-400">
            <HiOutlineCalendar className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">This week</p>
            <p className="dash-stat-value">{history.filter(r => {
              const d = new Date(r.timestamp)
              const now = new Date()
              const weekAgo = new Date(now.getTime() - 7 * 86400000)
              return d >= weekAgo
            }).length} tests</p>
          </div>
        </div>
      </section>

      <div className="cbt-layout">
        <section className="cbt-setup">
          <div className="cbt-setup-inner">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Start a new attempt</h2>
              <p className="dash-card-sub">Choose your course and settings</p>
            </div>
          </div>

          <div className="cbt-field">
            <label className="cbt-field-label">Course</label>
            {courses.length === 0 ? (
              <p className="text-[var(--text-mute)] text-sm">No courses loaded.</p>
            ) : (
              <div className="cbt-course-grid">
                {courses.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCourse(c.code)}
                    className={`cbt-course-chip ${selectedCourse === c.code ? "cbt-course-chip-active" : ""}`}
                  >
                    <span className="cbt-course-chip-code">{c.code}</span>
                    <span className="cbt-course-chip-name">{c.title}</span>
                    <span className="cbt-course-chip-meta">{c.questionCount ?? 0} questions</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="cbt-field">
            <label className="cbt-field-label">Mode</label>
            <div className="cbt-mode-grid">
              <button
                type="button"
                onClick={() => setMode("timed")}
                className={`cbt-mode-card ${mode === "timed" ? "cbt-mode-card-active" : ""}`}
              >
                <HiOutlineClock />
                <div>
                  <p>Timed (Real CBT)</p>
                  <span>Strict timer · No going back after submit</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`cbt-mode-card ${mode === "practice" ? "cbt-mode-card-active" : ""}`}
              >
                <HiOutlineDocumentText />
                <div>
                  <p>Practice</p>
                  <span>No timer · See answers after each question</span>
                </div>
              </button>
            </div>
          </div>

          <div className="cbt-slider-row">
            <div className="cbt-field">
              <div className="cbt-slider-head">
                <label className="cbt-field-label">Questions</label>
                <span className="cbt-slider-value">{selectedQuestionCount}</span>
              </div>
              <input
                type="range"
                min={5}
                max={maxSelectable || 5}
                step={5}
                value={selectedQuestionCount}
                onChange={(e) => setNumQs(Number(e.target.value))}
                className="cbt-slider"
              />
              <div className="cbt-slider-ticks">
                <span>5</span>
                <span>{maxSelectable || 5}</span>
              </div>
              {tier === "FREE" && availableCount > 20 && (
                <p className="text-xs text-[var(--text-mute)] mt-1">
                  <HiOutlineExclamationCircle className="inline h-3 w-3 mr-1" />
                  Free plan: capped at {dailyLimit} questions. Upgrade for unlimited.
                </p>
              )}
            </div>

            <div className="cbt-field">
              <div className="cbt-slider-head">
                <label className="cbt-field-label">Duration (min)</label>
                <span className="cbt-slider-value">{mode === "timed" ? duration : "∞"}</span>
              </div>
              <input
                type="range"
                min={15}
                max={120}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={mode === "practice"}
                className="cbt-slider"
              />
              <div className="cbt-slider-ticks">
                <span>15</span>
                <span>120</span>
              </div>
            </div>
          </div>

          <div className="cbt-summary">
            <div>
              <p className="cbt-summary-label">You&apos;re about to start</p>
              <p className="cbt-summary-text">
                <strong>{selectedQuestionCount}</strong> {selected?.code ?? ""} questions ·{" "}
                <strong>{mode === "timed" ? `${duration} min timer` : "Practice mode"}</strong>
              </p>
            </div>
            {selected ? (
              <Link
                href={`/cbt/exam?course=${encodeURIComponent(selected.code)}&name=${encodeURIComponent(selected.title)}&q=${selectedQuestionCount}&dur=${duration}&mode=${mode}`}
                className="btn btn-primary"
              >
                <HiOutlineLightningBolt /> Start CBT
              </Link>
            ) : (
              <button disabled className="btn btn-primary opacity-50 cursor-not-allowed">
                <HiOutlineLightningBolt /> Start CBT
              </button>
            )}
          </div>
          </div>
        </section>

        <section className="cbt-history">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Recent attempts</h2>
              <p className="dash-card-sub">Tap to review</p>
            </div>
            <ComingSoonAction className="dash-card-link" title="CBT attempt history">
              All <HiOutlineChevronRight />
            </ComingSoonAction>
          </div>
          {history.length === 0 ? (
            <p className="text-[var(--text-mute)] text-sm p-6">No attempts yet. Start your first CBT above.</p>
          ) : (
            <ul className="cbt-history-list">
              {history.slice(-5).reverse().map((h, i) => (
                <li key={i} className="cbt-history-item">
                  <div className="cbt-history-left">
                    <p className="cbt-history-course">{h.courseCode} — {h.courseName}</p>
                    <p className="cbt-history-meta">{h.duration} · {h.total} q</p>
                  </div>
                  <div className="cbt-history-right">
                    <span className={`cbt-history-score ${h.score >= 70 ? "cbt-score-pass" : "cbt-score-fail"}`}>
                      {h.score}%
                    </span>
                    <ComingSoonAction className="cbt-history-link" title="Attempt review">
                      Review
                    </ComingSoonAction>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
