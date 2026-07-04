'use client'

import { useMemo, useState } from "react"
import {
  HiOutlineBookmark,
  HiOutlineDocumentText,
  HiOutlineQuestionMarkCircle,
  HiOutlineBookOpen,
  HiOutlineSearch,
  HiOutlineDotsVertical,
} from "react-icons/hi"
import ComingSoonAction from "../componenets/ComingSoonAction"

type Kind = "note" | "question" | "material"

type Bookmark = {
  id: number
  kind: Kind
  title: string
  course: string
  excerpt: string
  date: string
  tag?: string
}

const ITEMS: Bookmark[] = [
  { id: 1, kind: "question", title: "Topological sort vs Dijkstra", course: "CSC 312", excerpt: "Both can run on DAGs but they answer different questions...", date: "Today",     tag: "Wrong on CBT" },
  { id: 2, kind: "note",     title: "Calculus II — chain rule cheat sheet", course: "MTH 201", excerpt: "Always start with the outer function, then multiply...", date: "Yesterday" },
  { id: 3, kind: "material", title: "Lecture 4 — Process scheduling PDF", course: "CSC 314", excerpt: "Round robin, SJF, priority — comparison table on p.12", date: "2 days ago" },
  { id: 4, kind: "question", title: "Stability of merge sort proof",       course: "CSC 312", excerpt: "Merge sort is stable because in the merge step, equal elements...", date: "3 days ago", tag: "For revision" },
  { id: 5, kind: "note",     title: "STA 211 — hypothesis testing flow",   course: "STA 211", excerpt: "1. State H0 and H1. 2. Choose significance level...", date: "1 week ago" },
  { id: 6, kind: "material", title: "Past Q 2022 — Physics II",            course: "PHY 102", excerpt: "Annotated past paper with full worked solutions", date: "1 week ago" },
  { id: 7, kind: "question", title: "Dynamic programming subproblems",     course: "CSC 312", excerpt: "Identify overlapping subproblems by drawing the recursion tree...", date: "2 weeks ago", tag: "Weak topic" },
  { id: 8, kind: "note",     title: "Linear algebra eigenvalue intuition", course: "MTH 202", excerpt: "An eigenvector is a direction the matrix only stretches...", date: "2 weeks ago" },
]

const KIND_ICON: Record<Kind, React.ComponentType<{ className?: string }>> = {
  note: HiOutlineBookmark,
  question: HiOutlineQuestionMarkCircle,
  material: HiOutlineBookOpen,
}

const KIND_COLOR: Record<Kind, string> = {
  note: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  question: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  material: "bg-teal-500/10 text-teal-400 border-teal-500/30",
}

const tabs: { key: Kind | "all"; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "note",     label: "Notes" },
  { key: "question", label: "Questions" },
  { key: "material", label: "Materials" },
]

export default function Bookmarks() {
  const [tab, setTab] = useState<Kind | "all">("all")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    return ITEMS.filter((b) => {
      if (tab !== "all" && b.kind !== tab) return false
      if (q) {
        const s = q.toLowerCase()
        if (!b.title.toLowerCase().includes(s) && !b.course.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [tab, q])

  const counts: Record<string, number> = {
    all:      ITEMS.length,
    note:     ITEMS.filter(b => b.kind === "note").length,
    question: ITEMS.filter(b => b.kind === "question").length,
    material: ITEMS.filter(b => b.kind === "material").length,
  }

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Bookmarks</h1>
          <p className="dash-welcome-sub">
            {ITEMS.length} saved · the things you wanted to come back to.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="lib-controls">
        <div className="lib-search">
          <HiOutlineSearch className="lib-search-icon" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bookmarks..." />
        </div>
        <div className="lib-tabs bm-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`lib-tab ${tab === t.key ? "lib-tab-active" : ""}`}
            >
              {t.label} <span className="bm-count">{counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bm-list">
        {filtered.map((b) => {
          const Icon = KIND_ICON[b.kind]
          return (
            <article key={b.id} className="bm-card">
              <div className="bm-card-head">
                <span className={`bm-card-kind ${KIND_COLOR[b.kind]}`}>
                  <Icon className="h-3 w-3" /> {b.kind}
                </span>
                <ComingSoonAction className="bm-card-more" title="Bookmark actions">
                  <HiOutlineDotsVertical />
                </ComingSoonAction>
              </div>

              <h3 className="bm-card-title">{b.title}</h3>
              <p className="bm-card-excerpt">{b.excerpt}</p>

              <div className="bm-card-foot">
                <span className="bm-card-course">
                  <HiOutlineDocumentText /> {b.course}
                </span>
                {b.tag && <span className="bm-card-tag">{b.tag}</span>}
                <span className="bm-card-date">{b.date}</span>
              </div>
            </article>
          )
        })}

        {filtered.length === 0 && (
          <div className="lib-empty">
            <p>Nothing here yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
