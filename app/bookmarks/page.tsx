'use client'

import { useEffect, useMemo, useState } from "react"
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

function loadBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("bookmarks")
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

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
  const [items, setItems] = useState<Bookmark[]>([])

  useEffect(() => {
    setItems(loadBookmarks())
  }, [])

  const filtered = useMemo(() => {
    return items.filter((b) => {
      if (tab !== "all" && b.kind !== tab) return false
      if (q) {
        const s = q.toLowerCase()
        if (!b.title.toLowerCase().includes(s) && !b.course.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [tab, q, items])

  const counts = useMemo(() => ({
    all: items.length,
    note: items.filter(b => b.kind === "note").length,
    question: items.filter(b => b.kind === "question").length,
    material: items.filter(b => b.kind === "material").length,
  }), [items])

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Bookmarks</h1>
          <p className="dash-welcome-sub">
            {items.length > 0
              ? `${items.length} saved · the things you wanted to come back to.`
              : "Nothing saved yet."}
          </p>
        </div>
      </div>

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
            {q || tab !== "all"
              ? <p>No bookmarks match your search.</p>
              : <p>No bookmarks yet. Save questions and notes while studying to find them here.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
