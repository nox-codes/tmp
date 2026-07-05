'use client'

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import {
  HiOutlineFlag,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineX,
} from "react-icons/hi"
import { fetchQuestionsByCourse, type QuestionApiItem } from "../../lib/api"

type LocalQuestion = {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

function toLocal(q: QuestionApiItem): LocalQuestion {
  return {
    id: Number(q.id),
    text: q.question,
    options: q.options,
    correctAnswer: q.answer,
  }
}

function ExamContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseCode = searchParams.get('course') ?? 'CSC 312'
  const courseName = searchParams.get('name') ?? 'Algorithms & Complexity'
  const numQs = Math.min(80, Math.max(5, Number(searchParams.get('q')) || 40))
  const totalSeconds = (Number(searchParams.get('dur')) || 60) * 60
  const isPractice = searchParams.get('mode') === 'practice'

  const [active, setActive] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [remaining, setRemaining] = useState(isPractice ? -1 : totalSeconds)
  const [confirmExit, setConfirmExit] = useState(false)
  const [questions, setQuestions] = useState<LocalQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const hasSubmitted = useRef(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const qs = await fetchQuestionsByCourse(courseCode)
        if (!active) return
        if (qs.length === 0) {
          setError(`No questions found for ${courseCode}.`)
          setLoading(false)
          return
        }
        const shuffled = qs.sort(() => Math.random() - 0.5).slice(0, numQs).map(toLocal)
        setQuestions(shuffled)
      } catch {
        if (active) setError('Failed to load questions. Backend may be unavailable.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [courseCode, numQs])

  useEffect(() => {
    if (isPractice || remaining <= 0 || loading) return
    const t = setInterval(() => setRemaining((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [remaining, isPractice, loading])

  useEffect(() => {
    if (!loading && remaining === 0 && !isPractice && !hasSubmitted.current) {
      hasSubmitted.current = true
      submitResults()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, loading, isPractice])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const ss = (s % 60).toString().padStart(2, "0")
    return `${m}:${ss}`
  }

  const current = questions[active]
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const lowTime = !isPractice && remaining >= 0 && remaining < 60 * 5

  const select = (i: number) => setAnswers((a) => ({ ...a, [current.id]: i }))
  const toggleFlag = () => setFlagged((s) => {
    const next = new Set(s)
    if (next.has(current.id)) next.delete(current.id)
    else next.add(current.id)
    return next
  })

  function submitResults() {
    let correct = 0
    const answered: Record<number, number> = {}
    questions.forEach((q) => {
      const userAnswer = answers[q.id]
      answered[q.id] = userAnswer
      if (userAnswer !== undefined && userAnswer === q.correctAnswer) correct++
    })
    const total = questions.length
    const answeredCount = Object.keys(answers).length
    const wrong = answeredCount - correct
    const skipped = total - answeredCount
    const score = total > 0 ? Math.round((correct / total) * 100) : 0

    const result = {
      courseCode,
      courseName,
      score,
      correct,
      wrong,
      skipped,
      total,
      duration: isPractice ? 'Practice' : `${Math.floor((totalSeconds - (remaining >= 0 ? remaining : 0)) / 60)} min`,
      answers: answered,
      questions,
      flagged: Array.from(flagged),
    }
    sessionStorage.setItem('cbt_result', JSON.stringify(result))
    router.push('/cbt/results')
  }

  if (loading) {
    return (
      <div className="exam-shell">
        <div className="flex items-center justify-center h-full">
          <p className="text-[var(--text-mute)] text-lg">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="exam-shell">
        <div className="flex flex-col items-center justify-center h-full gap-6 p-10">
          <p className="text-[var(--text-mute)] text-lg">{error || 'No questions loaded.'}</p>
          <Link href="/cbt" className="btn btn-secondary">Back to CBT</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-shell">
      <header className="exam-top">
        <div className="exam-top-left">
          <Link href="/" className="exam-logo">
            <Image width={28} height={28} src="/logo.svg" alt="UniLock" />
            <span>UniLock CBT</span>
          </Link>
          <span className="exam-course">{courseCode} — {courseName}</span>
        </div>

        {!isPractice && (
          <div className={`exam-timer ${lowTime ? "exam-timer-low" : ""}`}>
            <HiOutlineClock />
            <span>{fmt(remaining)}</span>
          </div>
        )}

        <div className="exam-top-right">
          <span className="exam-progress-text">
            <strong>{answeredCount}</strong> / {questions.length} answered
          </span>
          <button onClick={() => setConfirmExit(true)} className="exam-exit">
            <HiOutlineX /> Exit
          </button>
        </div>
      </header>

      <div className="exam-body">
        <main className="exam-main">
          <div className="exam-q-head">
            <div>
              <p className="exam-q-num">Question {active + 1} of {questions.length}</p>
              <p className="exam-q-meta">Single choice</p>
            </div>
            <button onClick={toggleFlag} className={`exam-flag ${flagged.has(current.id) ? "exam-flag-on" : ""}`}>
              <HiOutlineFlag /> {flagged.has(current.id) ? "Flagged" : "Flag for review"}
            </button>
          </div>

          <h2 className="exam-q-text">{current.text}</h2>

          <div className="exam-options">
            {current.options.map((opt, i) => {
              const selected = answers[current.id] === i
              const letter = String.fromCharCode(65 + i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(i)}
                  className={`exam-option ${selected ? "exam-option-selected" : ""}`}
                >
                  <span className="exam-option-letter">{letter}</span>
                  <span className="exam-option-text">{opt}</span>
                </button>
              )
            })}
          </div>

          <div className="exam-nav">
            <button
              onClick={() => setActive((a) => Math.max(0, a - 1))}
              disabled={active === 0}
              className="btn btn-secondary"
            >
              <HiOutlineChevronLeft /> Previous
            </button>
            {active === questions.length - 1 ? (
              <button onClick={submitResults} className="btn btn-primary">
                Submit exam
              </button>
            ) : (
              <button onClick={() => setActive((a) => Math.min(questions.length - 1, a + 1))} className="btn btn-primary">
                Next <HiOutlineChevronRight />
              </button>
            )}
          </div>
        </main>

        <aside className="exam-side">
          <div className="exam-side-head">
            <h3>Question palette</h3>
            <p>Tap any number to jump.</p>
          </div>

          <div className="exam-legend">
            <span><i className="exam-dot exam-dot-current" /> Current</span>
            <span><i className="exam-dot exam-dot-answered" /> Answered</span>
            <span><i className="exam-dot exam-dot-flagged" /> Flagged</span>
            <span><i className="exam-dot exam-dot-empty" /> Unanswered</span>
          </div>

          <div className="exam-palette">
            {questions.map((q, i) => {
              const isCurrent  = i === active
              const isAnswered = answers[q.id] !== undefined
              const isFlagged  = flagged.has(q.id)
              return (
                <button
                  key={q.id}
                  onClick={() => setActive(i)}
                  className={`exam-pal ${isCurrent ? "exam-pal-current" : isAnswered ? "exam-pal-answered" : ""} ${isFlagged ? "exam-pal-flagged" : ""}`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          <div className="exam-side-foot">
            <button onClick={submitResults} className="btn btn-primary w-full">
              Submit early
            </button>
            <p className="exam-foot-note">You can submit any time. Unanswered questions count as 0.</p>
          </div>
        </aside>
      </div>

      {confirmExit && (
        <div className="exam-modal-bg">
          <div className="exam-modal">
            <h3>Exit exam?</h3>
            <p>Your progress will be discarded and this attempt won&apos;t count.</p>
            <div className="exam-modal-actions">
              <button onClick={() => setConfirmExit(false)} className="btn btn-secondary">Keep going</button>
              <Link href="/cbt" className="btn btn-primary">Yes, exit</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="exam-shell"><div className="flex items-center justify-center h-full"><p className="text-[var(--text-mute)]">Loading exam...</p></div></div>}>
      <ExamContent />
    </Suspense>
  )
}
