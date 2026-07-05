'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineLightningBolt,
  HiOutlineRefresh,
  HiOutlineShare,
  HiOutlineFilter,
} from "react-icons/hi"
import ComingSoonAction from "../../componenets/ComingSoonAction"

type ExamResult = {
  courseCode: string
  courseName: string
  score: number
  correct: number
  wrong: number
  skipped: number
  total: number
  duration: string
  answers: Record<number, number>
  questions: { id: number; text: string; options: string[]; correctAnswer: number }[]
  flagged: number[]
}

const defaultResult: ExamResult = {
  courseCode: 'CSC 312',
  courseName: 'Algorithms & Complexity',
  score: 0,
  correct: 0,
  wrong: 0,
  skipped: 0,
  total: 0,
  duration: '0 min',
  answers: {},
  questions: [],
  flagged: [],
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ExamResult>(defaultResult)
  const [filter, setFilter] = useState<"all" | "wrong" | "skipped" | "flagged">("all")
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const raw = sessionStorage.getItem('cbt_result')
    if (!raw) {
      router.replace('/cbt')
      return
    }
    try {
      const parsed = JSON.parse(raw) as ExamResult
      if (parsed.total > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResult(parsed)
      } else {
        router.replace('/cbt')
      }
    } catch {
      router.replace('/cbt')
    }
  }, [router])

  const topicBreakdown = useMemo(() => {
    const topics: Record<string, { correct: number; total: number }> = {}
    result.questions.forEach((q) => {
      const topic = 'General'
      if (!topics[topic]) topics[topic] = { correct: 0, total: 0 }
      topics[topic].total++
      if (result.answers[q.id] !== undefined && result.answers[q.id] === q.correctAnswer) {
        topics[topic].correct++
      }
    })
    return Object.entries(topics).map(([topic, data]) => ({ topic, ...data }))
  }, [result])

  const review = useMemo(() => {
    return result.questions.map((q, i) => {
      const userAnswer = result.answers[q.id]
      const isCorrect = userAnswer !== undefined && userAnswer === q.correctAnswer
      const isSkipped = userAnswer === undefined
      const status = isSkipped ? 'skipped' : isCorrect ? 'correct' : 'wrong'
      return {
        n: i + 1,
        status,
        text: q.text,
        your: isSkipped ? '—' : q.options[userAnswer] ?? '—',
        answer: q.options[q.correctAnswer],
      }
    })
  }, [result])

  const visible = review.filter(r => filter === "all" ? true : r.status === filter)

  if (result.total === 0) return null

  return (
    <div className="dash">
      <section className="results-hero">
        <div className="results-hero-left">
          <p className="results-hero-label">Exam complete</p>
          <h1 className="results-hero-title">{result.courseCode} — {result.courseName}</h1>
          <p className="results-hero-meta">· {result.duration}</p>

          <div className="results-actions">
            <Link href="/cbt" className="btn btn-secondary"><HiOutlineRefresh /> Retry</Link>
            <ComingSoonAction className="btn btn-secondary" title="Share results">
              <HiOutlineShare /> Share
            </ComingSoonAction>
            <Link href="/cbt" className="btn btn-primary"><HiOutlineLightningBolt /> New CBT</Link>
          </div>
        </div>

        <div className="results-score-circle">
          <svg viewBox="0 0 120 120" className="results-circle-svg">
            <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
            <circle
              cx="60" cy="60" r="52"
              stroke="#2dd4bf" strokeWidth="10" fill="none"
              strokeDasharray={`${(result.score / 100) * 326.7} 326.7`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="results-score-text">
            <p className="results-score-value">{result.score}%</p>
            <p className="results-score-label">Score</p>
          </div>
        </div>
      </section>

      <section className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-icon bg-emerald-500/10 text-emerald-400">
            <HiOutlineCheckCircle className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Correct</p>
            <p className="dash-stat-value">{result.correct}/{result.total}</p>
          </div>
          <span className="dash-stat-trend">{result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0}%</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-rose-500/10 text-rose-400">
            <HiOutlineXCircle className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Wrong</p>
            <p className="dash-stat-value">{result.wrong}</p>
          </div>
          <span className="dash-stat-trend">Review</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-amber-500/10 text-amber-400">
            <HiOutlineClock className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Skipped</p>
            <p className="dash-stat-value">{result.skipped}</p>
          </div>
          <span className="dash-stat-trend">—</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-violet-500/10 text-violet-400">
            <HiOutlineLightningBolt className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Duration</p>
            <p className="dash-stat-value">{result.duration}</p>
          </div>
          <span className="dash-stat-trend">{result.score >= 70 ? 'Passed' : 'Failed'}</span>
        </div>
      </section>

      <div className="results-grid">
        <section className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Topic breakdown</h2>
              <p className="dash-card-sub">Where you shined and where to focus next</p>
            </div>
          </div>
          <ul className="results-topics">
            {topicBreakdown.map((t) => {
              const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0
              return (
                <li key={t.topic} className="results-topic">
                  <div className="results-topic-head">
                    <span className="results-topic-name">{t.topic}</span>
                    <span className="results-topic-score">{t.correct}/{t.total}</span>
                  </div>
                  <div className="dash-progress">
                    <span
                      className={`dash-progress-fill ${pct >= 80 ? "bg-emerald-400" : pct >= 60 ? "bg-teal-400" : "bg-amber-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Insights</h2>
              <p className="dash-card-sub">From this attempt</p>
            </div>
          </div>
          <ul className="results-insights">
            <li>{result.score >= 80 ? 'Great job! You scored above 80%.' : result.score >= 60 ? 'Good effort! Keep practicing to improve.' : 'Keep studying! Focus on weak areas for better results.'}</li>
            <li>You answered <strong>{result.correct}/{result.total}</strong> questions correctly ({result.score}%).</li>
            {result.wrong > 0 && <li>Review the {result.wrong} questions you got wrong below.</li>}
            {result.skipped > 0 && <li>You skipped {result.skipped} question{result.skipped !== 1 ? 's' : ''}. Try to answer all next time.</li>}
            {result.flagged.length > 0 && <li>You flagged {result.flagged.length} question{result.flagged.length !== 1 ? 's' : ''} for review.</li>}
          </ul>
          <Link href="/library" className="btn btn-secondary w-full mt-4">
            Study weak spots
          </Link>
        </section>

        <section className="dash-card dash-card-full">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Answer review</h2>
              <p className="dash-card-sub">Review your answers below</p>
            </div>
            <div className="results-filter">
              <HiOutlineFilter />
              <select value={filter} onChange={(e) => setFilter(e.target.value as "all"|"wrong"|"skipped"|"flagged") }>
                <option value="all">All</option>
                <option value="wrong">Wrong only</option>
                <option value="skipped">Skipped</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          <ul className="results-review">
            {visible.map((r) => (
              <li key={r.n} className={`results-review-item results-review-${r.status}`}>
                <div className="results-review-num">{r.n}</div>
                <div className="results-review-body">
                  <p className="results-review-q">{r.text}</p>
                  <div className="results-review-row">
                    <span className="results-review-label">Your answer:</span>
                    <span className={r.status === "correct" ? "text-emerald-400" : "text-rose-400"}>{r.your}</span>
                  </div>
                  {r.status !== "correct" && (
                    <div className="results-review-row">
                      <span className="results-review-label">Correct:</span>
                      <span className="text-emerald-400">{r.answer}</span>
                    </div>
                  )}
                </div>
                <span className={`results-review-badge results-review-badge-${r.status}`}>
                  {r.status === "correct" && <HiOutlineCheckCircle />}
                  {r.status === "wrong" && <HiOutlineXCircle />}
                  {r.status === "skipped" && "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
