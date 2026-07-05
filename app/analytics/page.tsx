'use client'

import { useMemo } from "react"
import {
  HiOutlineTrendingUp,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineLightningBolt,
} from "react-icons/hi"

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

export default function Analytics() {
  const history = useMemo(() => loadHistory(), [])
  const totalAttempts = history.length
  const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s, r) => s + r.score, 0) / totalAttempts) : 0
  const passed = history.filter(r => r.score >= 70).length
  const passRate = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0
  const totalMinutes = history.reduce((s, r) => {
    const m = parseInt(r.duration)
    return s + (isNaN(m) ? 0 : m)
  }, 0)

  const subjectMastery = useMemo(() => {
    const map = new Map<string, number[]>()
    history.forEach(r => {
      const existing = map.get(r.courseCode) ?? []
      existing.push(r.score)
      map.set(r.courseCode, existing)
    })
    return Array.from(map.entries()).map(([code, scores]) => ({
      code,
      mastery: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    })).sort((a, b) => b.mastery - a.mastery)
  }, [history])

  const weeklyHours = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toDateString()
    })
    return days.map(day => {
      const dayResults = history.filter(r => new Date(r.timestamp).toDateString() === day)
      return dayResults.length * Math.round(avgScore / 10) || 0
    })
  }, [history, avgScore])

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const maxBar = Math.max(...weeklyHours, 1)

  const strengths = useMemo(() => {
    return subjectMastery.filter(s => s.mastery >= 70).slice(0, 3)
  }, [subjectMastery])

  const weaknesses = useMemo(() => {
    return subjectMastery.filter(s => s.mastery < 70).slice(0, 3)
  }, [subjectMastery])

  const recentSessions = useMemo(() => {
    const map = new Map<string, string[]>()
    history.slice(-10).forEach(r => {
      const d = new Date(r.timestamp)
      const label = d.toDateString() === new Date().toDateString() ? "Today" : d.toDateString() === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" : d.toLocaleDateString()
      const existing = map.get(label) ?? []
      existing.push(`${r.duration} · ${r.courseCode} CBT — ${r.score}%`)
      map.set(label, existing)
    })
    return Array.from(map.entries()).slice(0, 3)
  }, [history])

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Analytics</h1>
          <p className="dash-welcome-sub">
            {totalAttempts > 0 ? "Find your patterns. Double down on what works." : "Complete a CBT to see your analytics."}
          </p>
        </div>
      </div>

      <section className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-icon bg-teal-500/10 text-teal-400">
            <HiOutlineAcademicCap className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Total attempts</p>
            <p className="dash-stat-value">{totalAttempts}</p>
          </div>
          <span className="dash-stat-trend">{totalAttempts > 0 ? "lifetime" : "—"}</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-amber-500/10 text-amber-400">
            <HiOutlineClock className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Study hrs</p>
            <p className="dash-stat-value">{Math.round(totalMinutes / 60)}</p>
          </div>
          <span className="dash-stat-trend">{totalMinutes > 0 ? "total" : "—"}</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-emerald-500/10 text-emerald-400">
            <HiOutlineTrendingUp className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Avg score</p>
            <p className="dash-stat-value">{avgScore}%</p>
          </div>
          <span className="dash-stat-trend">{totalAttempts > 0 ? `${passRate}% pass` : "—"}</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-violet-500/10 text-violet-400">
            <HiOutlineLightningBolt className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">CBT pass rate</p>
            <p className="dash-stat-value">{passRate}%</p>
          </div>
          <span className="dash-stat-trend">{passed}/{totalAttempts}</span>
        </div>
      </section>

      <div className="dash-grid">
        <section className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Study hours this week</h2>
              <p className="dash-card-sub">{totalMinutes > 0 ? `${Math.round(totalMinutes / 60)} hours total` : "No data yet"}</p>
            </div>
          </div>
          <div className="analytics-bars">
            {weeklyHours.map((h, i) => (
              <div key={i} className="analytics-bar-col">
                <span className="analytics-bar-val">{h}h</span>
                <span
                  className="analytics-bar"
                  style={{ height: `${(h / maxBar) * 100}%` }}
                />
                <span className="analytics-bar-label">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Subject mastery</h2>
              <p className="dash-card-sub">Based on CBT performance</p>
            </div>
          </div>
          {subjectMastery.length === 0 ? (
            <p className="text-[var(--text-mute)] text-sm p-6">No CBT results yet.</p>
          ) : (
            <ul className="analytics-subjects">
              {subjectMastery.map((s) => (
                <li key={s.code} className="analytics-subject">
                  <div className="analytics-subject-head">
                    <span>{s.code}</span>
                    <span>{s.mastery}%</span>
                  </div>
                  <div className="dash-progress">
                    <span
                      className={`dash-progress-fill ${s.mastery >= 70 ? "bg-emerald-400" : s.mastery >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
                      style={{ width: `${s.mastery}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Strengths</h2>
              <p className="dash-card-sub">Top topics</p>
            </div>
          </div>
          {strengths.length === 0 ? (
            <p className="text-[var(--text-mute)] text-sm p-6">No data yet.</p>
          ) : (
            <ul className="analytics-tags">
              {strengths.map((s) => (
                <li key={s.code} className="analytics-tag analytics-tag-good">
                  <span>{s.code}</span>
                  <span>{s.mastery}%</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Focus areas</h2>
              <p className="dash-card-sub">Where to spend study time</p>
            </div>
          </div>
          {weaknesses.length === 0 ? (
            <p className="text-[var(--text-mute)] text-sm p-6">No data yet.</p>
          ) : (
            <ul className="analytics-tags">
              {weaknesses.map((s) => (
                <li key={s.code} className="analytics-tag analytics-tag-bad">
                  <span>{s.code}</span>
                  <span>{s.mastery}%</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Recent sessions</h2>
              <p className="dash-card-sub">Last study days</p>
            </div>
          </div>
          {recentSessions.length === 0 ? (
            <p className="text-[var(--text-mute)] text-sm p-6">No sessions yet.</p>
          ) : (
            <ul className="analytics-sessions">
              {recentSessions.map(([date, items]) => (
                <li key={date}>
                  <p className="analytics-session-date">{date}</p>
                  <ul className="analytics-session-items">
                    {items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
