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
} from "react-icons/hi"
import { fetchQuestions, QuestionApiItem } from "../lib/api"
import ComingSoonAction from "../componenets/ComingSoonAction"

const courses = [
  { code: "CSC 312", name: "Algorithms & Complexity", available: 120, attempts: 8, best: 88 },
  { code: "MTH 201", name: "Calculus II",             available: 180, attempts: 12, best: 84 },
  { code: "STA 211", name: "Probability & Stats",     available: 96,  attempts: 5,  best: 92 },
  { code: "PHY 102", name: "General Physics II",      available: 110, attempts: 3,  best: 71 },
  { code: "CSC 314", name: "Operating Systems",       available: 80,  attempts: 0,  best: 0  },
  { code: "ENG 201", name: "Use of English II",       available: 60,  attempts: 2,  best: 76 },
]

const history = [
  { id: 1, course: "CSC 312 · Algorithms",   date: "Today · 2hrs ago",   score: 88, questions: 40, time: "52 min", status: "Passed" },
  { id: 2, course: "MTH 201 · Calculus II",  date: "Yesterday",           score: 76, questions: 30, time: "45 min", status: "Passed" },
  { id: 3, course: "STA 211 · Probability",  date: "2 days ago",          score: 92, questions: 25, time: "38 min", status: "Passed" },
  { id: 4, course: "PHY 102 · Physics II",   date: "Last week",           score: 58, questions: 30, time: "60 min", status: "Failed" },
]

export default function CBTPage() {
  const [selectedCourse, setSelectedCourse] = useState("CSC 312")
  const [duration, setDuration] = useState(60)
  const [numQs, setNumQs] = useState(40)
  const [mode, setMode] = useState<"timed" | "practice">("timed")
  const [backendQuestions, setBackendQuestions] = useState<QuestionApiItem[]>([])
  const [sourceNote, setSourceNote] = useState("Showing sample question banks while backend data loads.")

  useEffect(() => {
    let active = true

    async function loadQuestions() {
      try {
        const questions = await fetchQuestions()
        if (!active) return

        if (Array.isArray(questions) && questions.length > 0) {
          setBackendQuestions(questions)
          setSourceNote("Synced with backend question data.")
          const firstCourse = questions[0]?.course?.code
          if (firstCourse) setSelectedCourse(firstCourse)
        } else {
          setSourceNote("No backend questions yet. Showing sample question banks.")
        }
      } catch {
        if (active) setSourceNote("Backend questions unavailable. Showing sample question banks.")
      }
    }

    loadQuestions()
    return () => {
      active = false
    }
  }, [])

  const courseOptions = useMemo(() => {
    if (backendQuestions.length === 0) return courses

    const byCode = new Map<string, { code: string; name: string; available: number; attempts: number; best: number }>()

    backendQuestions.forEach((question) => {
      const code = question.course?.code ?? "COURSE"
      const name = question.course?.title ?? "Backend question bank"
      const current = byCode.get(code)
      byCode.set(code, {
        code,
        name,
        available: (current?.available ?? 0) + 1,
        attempts: 0,
        best: 0,
      })
    })

    return Array.from(byCode.values())
  }, [backendQuestions])

  const selected = courseOptions.find(c => c.code === selectedCourse) ?? courseOptions[0] ?? courses[0]
  const maxQuestions = Math.max(10, Math.min(80, selected.available))
  const selectedQuestionCount = Math.min(numQs, maxQuestions)

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">CBT Mode</h1>
          <p className="dash-welcome-sub">
            Practice with real UNILAG past questions under exam conditions.
          </p>
          <p className="dash-welcome-sub dash-welcome-note">{sourceNote}</p>
        </div>
        <div className="dash-welcome-actions">
          <span className="cbt-streak"><HiOutlineLightningBolt /> 12-day streak</span>
        </div>
      </div>

      {/* Quick stats */}
      <section className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-icon bg-teal-500/10 text-teal-400">
            <HiOutlineDocumentText className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Total attempts</p>
            <p className="dash-stat-value">30</p>
          </div>
          <span className="dash-stat-trend">+8 wk</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-emerald-500/10 text-emerald-400">
            <HiOutlineCheckCircle className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Average score</p>
            <p className="dash-stat-value">82%</p>
          </div>
          <span className="dash-stat-trend">+6%</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-amber-500/10 text-amber-400">
            <HiOutlineClock className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Time practiced</p>
            <p className="dash-stat-value">14 hr</p>
          </div>
          <span className="dash-stat-trend">+2h</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-violet-500/10 text-violet-400">
            <HiOutlineCalendar className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">This week</p>
            <p className="dash-stat-value">5 tests</p>
          </div>
          <span className="dash-stat-trend">🔥</span>
        </div>
      </section>

      <div className="cbt-layout">
        {/* Setup panel */}
        <section className="cbt-setup">
          <div className="cbt-setup-inner">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Start a new attempt</h2>
              <p className="dash-card-sub">Choose your course and settings</p>
            </div>
          </div>

          {/* Course picker */}
          <div className="cbt-field">
            <label className="cbt-field-label">Course</label>
            <div className="cbt-course-grid">
              {courseOptions.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCourse(c.code)}
                  className={`cbt-course-chip ${selectedCourse === c.code ? "cbt-course-chip-active" : ""}`}
                >
                  <span className="cbt-course-chip-code">{c.code}</span>
                  <span className="cbt-course-chip-name">{c.name}</span>
                  <span className="cbt-course-chip-meta">{c.available} questions</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
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

          {/* Sliders */}
          <div className="cbt-slider-row">
            <div className="cbt-field">
              <div className="cbt-slider-head">
                <label className="cbt-field-label">Questions</label>
                <span className="cbt-slider-value">{numQs}</span>
              </div>
              <input
                type="range"
                min={10}
                max={maxQuestions}
                step={5}
                value={selectedQuestionCount}
                onChange={(e) => setNumQs(Number(e.target.value))}
                className="cbt-slider"
              />
              <div className="cbt-slider-ticks">
                <span>10</span>
                <span>80</span>
              </div>
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

          {/* Summary + start */}
          <div className="cbt-summary">
            <div>
              <p className="cbt-summary-label">You&apos;re about to start</p>
              <p className="cbt-summary-text">
                <strong>{selectedQuestionCount}</strong> {selected.code} questions ·{" "}
                <strong>{mode === "timed" ? `${duration} min timer` : "Practice mode"}</strong>
              </p>
            </div>
            <Link href="/cbt/exam" className="btn btn-primary">
              <HiOutlineLightningBolt /> Start CBT
            </Link>
          </div>
          </div>
        </section>

        {/* History */}
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
          <ul className="cbt-history-list">
            {history.map((h) => (
              <li key={h.id} className="cbt-history-item">
                <div className="cbt-history-left">
                  <p className="cbt-history-course">{h.course}</p>
                  <p className="cbt-history-meta">{h.date} · {h.questions} q · {h.time}</p>
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
        </section>
      </div>
    </div>
  )
}
