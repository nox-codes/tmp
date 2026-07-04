'use client'

import Link from "next/link"
import { useState } from "react"
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

const result = {
  course: "CSC 312 — Algorithms & Complexity",
  date: "Today · just now",
  score: 82,
  correct: 33,
  wrong: 5,
  skipped: 2,
  total: 40,
  duration: "52 min",
  best: 88,
  rank: 14,
  classAvg: 71,
}

const topicBreakdown = [
  { topic: "Sorting & Searching",     correct: 9, total: 10 },
  { topic: "Graphs",                  correct: 7, total: 10 },
  { topic: "Dynamic Programming",     correct: 6, total: 8 },
  { topic: "Trees",                   correct: 8, total: 8 },
  { topic: "Complexity Analysis",     correct: 3, total: 4 },
]

const review = [
  { n: 1,  status: "correct",  text: "Time complexity of binary search?", your: "O(log n)",     answer: "O(log n)" },
  { n: 2,  status: "correct",  text: "LIFO data structure?",              your: "Stack",         answer: "Stack" },
  { n: 3,  status: "wrong",    text: "Topological ordering algorithm?",   your: "Dijkstra",      answer: "Kahn's algorithm" },
  { n: 4,  status: "correct",  text: "Average-case quicksort?",           your: "O(n log n)",    answer: "O(n log n)" },
  { n: 5,  status: "wrong",    text: "Not a stable sorting algorithm?",   your: "Insertion sort", answer: "Quicksort" },
  { n: 6,  status: "correct",  text: "Fastest growth rate?",              your: "O(n!)",         answer: "O(n!)" },
  { n: 7,  status: "skipped",  text: "Dynamic programming uses?",         your: "—",             answer: "Memoization & optimal substructure" },
  { n: 8,  status: "correct",  text: "Insert into balanced BST?",         your: "O(log n)",      answer: "O(log n)" },
]

export default function ResultsPage() {
  const [filter, setFilter] = useState<"all" | "wrong" | "skipped" | "flagged">("all")
  const visible = review.filter(r => filter === "all" ? true : r.status === filter)

  return (
    <div className="dash">
      {/* Hero */}
      <section className="results-hero">
        <div className="results-hero-left">
          <p className="results-hero-label">Exam complete</p>
          <h1 className="results-hero-title">{result.course}</h1>
          <p className="results-hero-meta">{result.date} · {result.duration}</p>

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

      {/* Stat cards */}
      <section className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-icon bg-emerald-500/10 text-emerald-400">
            <HiOutlineCheckCircle className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Correct</p>
            <p className="dash-stat-value">{result.correct}/{result.total}</p>
          </div>
          <span className="dash-stat-trend">{Math.round((result.correct / result.total) * 100)}%</span>
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
            <p className="dash-stat-label">Avg / Q</p>
            <p className="dash-stat-value">78s</p>
          </div>
          <span className="dash-stat-trend">−12s</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-violet-500/10 text-violet-400">
            <HiOutlineLightningBolt className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Class rank</p>
            <p className="dash-stat-value">#{result.rank}</p>
          </div>
          <span className="dash-stat-trend">Top 12%</span>
        </div>
      </section>

      <div className="results-grid">
        {/* Topic breakdown */}
        <section className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Topic breakdown</h2>
              <p className="dash-card-sub">Where you shined and where to focus next</p>
            </div>
            <span className="results-class-avg">Class avg: {result.classAvg}%</span>
          </div>
          <ul className="results-topics">
            {topicBreakdown.map((t) => {
              const pct = Math.round((t.correct / t.total) * 100)
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

        {/* Insights */}
        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Insights</h2>
              <p className="dash-card-sub">From this attempt</p>
            </div>
          </div>
          <ul className="results-insights">
            <li>You beat your previous best by <strong>+6%</strong>.</li>
            <li>Trees: 100% — you&apos;ve mastered this topic. 🎯</li>
            <li>Dynamic Programming is your weakest area. We&apos;ll recommend more drills.</li>
            <li>You averaged 78s/question, faster than the class average of 92s.</li>
          </ul>
          <Link href="/library" className="btn btn-secondary w-full mt-4">
            Study DP weak spots
          </Link>
        </section>

        {/* Answer review */}
        <section className="dash-card dash-card-full">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Answer review</h2>
              <p className="dash-card-sub">Tap any question for the explanation</p>
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
