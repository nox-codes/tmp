'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  HiOutlineSearch,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineLightningBolt,
  HiOutlineFilter,
  HiOutlineStar,
  HiOutlineClock,
} from "react-icons/hi"
import { CourseApiItem, fetchCourses } from "../lib/api"
import ComingSoonAction from "../componenets/ComingSoonAction"

type Course = {
  id?: string
  code: string
  name: string
  faculty: string
  level: string
  units: number
  materials: number
  pastQs: number
  rating: number
  progress: number
  color: string
}

function SkeletonCard() {
  return (
    <div className="lib-card animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-20 rounded-full bg-[var(--border)]" />
        <div className="h-4 w-12 rounded bg-[var(--border)]" />
      </div>
      <div className="h-5 w-3/4 rounded bg-[var(--border)] mb-2" />
      <div className="h-4 w-1/2 rounded bg-[var(--border)] mb-5" />
      <div className="flex gap-4 mb-6">
        <div className="h-4 w-24 rounded bg-[var(--border)]" />
        <div className="h-4 w-20 rounded bg-[var(--border)]" />
      </div>
      <div className="h-10 w-full rounded-lg bg-[var(--border)]" />
    </div>
  )
}

const FACULTIES = ["All", "Science", "Arts", "Social", "MSS", "Medicine", "Law"]
const LEVELS    = ["All", "100L", "200L", "300L", "400L", "500L"]

const PROGRESS_BG: Record<string, string> = {
  teal: "bg-teal-400", amber: "bg-amber-400", green: "bg-emerald-400", purple: "bg-violet-400",
}
const TAG_BG: Record<string, string> = {
  teal: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  purple: "bg-violet-500/10 text-violet-400 border-violet-500/30",
}

export default function Library() {
  const [q, setQ] = useState("")
  const [faculty, setFaculty] = useState("All")
  const [level, setLevel] = useState("All")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadCourses() {
      try {
        const data = await fetchCourses()
        if (!active) return
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data.map(mapApiCourse))
        }
      } catch {
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCourses()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (faculty !== "All" && c.faculty !== faculty) return false
      if (level !== "All" && c.level !== level) return false
      if (q) {
        const s = q.toLowerCase()
        if (!c.code.toLowerCase().includes(s) && !c.name.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [courses, q, faculty, level])

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Course Library</h1>
          <p className="dash-welcome-sub">
            {loading ? "Loading courses..." : `${courses.length} courses · Aligned with UNILAG curriculum`}
          </p>
        </div>
        <div className="dash-welcome-actions">
          <Link href="/cbt" className="btn btn-primary btn-sm">
            <HiOutlineLightningBolt /> Quick CBT
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="lib-controls">
        <div className="lib-search">
          <HiOutlineSearch className="lib-search-icon" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by course code or name..."
          />
        </div>

        <div className="lib-filters">
          <div className="lib-filter">
            <HiOutlineFilter />
            <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
              {FACULTIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="lib-filter">
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>


      </div>

      {/* Grid */}
      <div className="lib-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : courses.length === 0 ? (
          <div className="lib-empty">
            <p>No courses available.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="lib-empty">
            <p>No courses match those filters.</p>
            <button onClick={() => { setQ(""); setFaculty("All"); setLevel("All"); }} className="btn btn-secondary btn-sm">
              Reset filters
            </button>
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.code} className="lib-card">
              <div className="lib-card-head">
                <span className={`lib-card-code ${TAG_BG[c.color]}`}>{c.code}</span>
                <div className="lib-card-rating">
                  <HiOutlineStar className="text-amber-400" />
                  <span>{c.rating}</span>
                </div>
              </div>

              <h3 className="lib-card-title">{c.name}</h3>
              <p className="lib-card-meta">
                {c.faculty} · {c.level} · {c.units} units
              </p>

              <div className="lib-card-stats">
                <span><HiOutlineBookOpen /> {c.materials} materials</span>
                <span><HiOutlineDocumentText /> {c.pastQs} past Qs</span>
              </div>

              <div className="lib-card-actions">
                <Link href={`/cbt?course=${c.code}`} className="btn btn-primary btn-sm flex-1">
                  <HiOutlineLightningBolt /> Practice
                </Link>
                <ComingSoonAction className="btn btn-secondary btn-sm flex-1" title="Study mode">
                  <HiOutlineBookOpen /> Study
                </ComingSoonAction>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function mapApiCourse(course: CourseApiItem, index: number): Course {
  const colors = ["teal", "amber", "green", "purple"]
  const questionCount = course.questions?.length ?? 0

  return {
    id: course.id,
    code: course.code,
    name: course.title,
    faculty: "Science",
    level: "General",
    units: course.units,
    materials: questionCount,
    pastQs: questionCount,
    rating: 4.5,
    progress: 0,
    color: colors[index % colors.length],
  }
}
