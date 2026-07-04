'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import {
  HiOutlineFlag,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineX,
} from "react-icons/hi"

type Question = {
  id: number
  text: string
  options: string[]
}

const QUESTIONS: Question[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  text: [
    "What is the time complexity of binary search on a sorted array of n elements?",
    "Which data structure uses Last-In-First-Out (LIFO) ordering?",
    "Given a directed acyclic graph (DAG), which algorithm finds a topological ordering?",
    "What is the average-case time complexity of quicksort?",
    "Which of the following is NOT a stable sorting algorithm?",
    "In Big-O notation, which represents the fastest growth rate?",
    "Which technique is used by dynamic programming?",
    "What is the worst-case complexity of inserting into a balanced BST of n nodes?",
  ][i % 8],
  options: [
    ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
    ["Queue", "Stack", "Heap", "Linked list"],
    ["Dijkstra", "Kahn's algorithm", "Floyd–Warshall", "Bellman–Ford"],
    ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    ["Merge sort", "Bubble sort", "Quicksort", "Insertion sort"],
    ["O(n!)", "O(2^n)", "O(n log n)", "O(n^2)"],
    ["Divide & conquer only", "Memoization & optimal substructure", "Greedy choices", "Brute force"],
    ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
  ][i % 8],
}))

const TOTAL_SECONDS = 60 * 60 // 60 min

export default function ExamPage() {
  const [active, setActive] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)
  const [confirmExit, setConfirmExit] = useState(false)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [remaining])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const ss = (s % 60).toString().padStart(2, "0")
    return `${m}:${ss}`
  }

  const current = QUESTIONS[active]
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const lowTime = remaining < 60 * 5

  const select = (i: number) => setAnswers((a) => ({ ...a, [current.id]: i }))
  const toggleFlag = () => setFlagged((s) => {
    const next = new Set(s)
    if (next.has(current.id)) next.delete(current.id)
    else next.add(current.id)
    return next
  })

  return (
    <div className="exam-shell">
      {/* Top bar */}
      <header className="exam-top">
        <div className="exam-top-left">
          <Link href="/" className="exam-logo">
            <Image width={28} height={28} src="/logo.svg" alt="UniLock" />
            <span>UniLock CBT</span>
          </Link>
          <span className="exam-course">CSC 312 — Algorithms & Complexity</span>
        </div>

        <div className={`exam-timer ${lowTime ? "exam-timer-low" : ""}`}>
          <HiOutlineClock />
          <span>{fmt(remaining)}</span>
        </div>

        <div className="exam-top-right">
          <span className="exam-progress-text">
            <strong>{answeredCount}</strong> / {QUESTIONS.length} answered
          </span>
          <button onClick={() => setConfirmExit(true)} className="exam-exit">
            <HiOutlineX /> Exit
          </button>
        </div>
      </header>

      <div className="exam-body">
        {/* Main question */}
        <main className="exam-main">
          <div className="exam-q-head">
            <div>
              <p className="exam-q-num">Question {active + 1} of {QUESTIONS.length}</p>
              <p className="exam-q-meta">No calculator allowed · Single choice</p>
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
            {active === QUESTIONS.length - 1 ? (
              <Link href="/cbt/results" className="btn btn-primary">
                Submit exam
              </Link>
            ) : (
              <button onClick={() => setActive((a) => Math.min(QUESTIONS.length - 1, a + 1))} className="btn btn-primary">
                Next <HiOutlineChevronRight />
              </button>
            )}
          </div>
        </main>

        {/* Palette sidebar */}
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
            {QUESTIONS.map((q, i) => {
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
            <Link href="/cbt/results" className="btn btn-primary w-full">
              Submit early
            </Link>
            <p className="exam-foot-note">You can submit any time. Unanswered questions count as 0.</p>
          </div>
        </aside>
      </div>

      {/* Exit confirm */}
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
