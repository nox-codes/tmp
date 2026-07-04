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

const COURSES: Course[] = [
  { code: "CSC 312", name: "Algorithms & Complexity",        faculty: "Science", level: "300L", units: 3, materials: 14, pastQs: 120, rating: 4.8, progress: 78, color: "teal"   },
  { code: "MTH 201", name: "Calculus II",                    faculty: "Science", level: "200L", units: 4, materials: 22, pastQs: 180, rating: 4.6, progress: 62, color: "amber"  },
  { code: "STA 211", name: "Probability & Statistics",       faculty: "Science", level: "200L", units: 3, materials: 18, pastQs: 96,  rating: 4.7, progress: 91, color: "green"  },
  { code: "PHY 102", name: "General Physics II",             faculty: "Science", level: "100L", units: 3, materials: 16, pastQs: 110, rating: 4.4, progress: 45, color: "purple" },
  { code: "CSC 314", name: "Operating Systems",              faculty: "Science", level: "300L", units: 3, materials: 11, pastQs: 80,  rating: 4.9, progress: 0,  color: "teal"   },
  { code: "ENG 201", name: "Use of English II",              faculty: "Arts",    level: "200L", units: 2, materials: 9,  pastQs: 60,  rating: 4.2, progress: 30, color: "amber"  },
  { code: "MTH 202", name: "Linear Algebra",                 faculty: "Science", level: "200L", units: 3, materials: 19, pastQs: 140, rating: 4.5, progress: 0,  color: "green"  },
  { code: "CSC 318", name: "Software Engineering",           faculty: "Science", level: "300L", units: 3, materials: 13, pastQs: 70,  rating: 4.8, progress: 0,  color: "purple" },
  { code: "ECO 101", name: "Principles of Economics",        faculty: "Social",  level: "100L", units: 3, materials: 21, pastQs: 130, rating: 4.3, progress: 0,  color: "teal"   },
  { code: "ACC 201", name: "Principles of Accounting",       faculty: "MSS",     level: "200L", units: 3, materials: 17, pastQs: 100, rating: 4.4, progress: 0,  color: "amber"  },
  { code: "MED 101", name: "Anatomy & Physiology I",         faculty: "Medicine", level: "100L", units: 4, materials: 25, pastQs: 220, rating: 4.7, progress: 0,  color: "green"  },
  { code: "LAW 101", name: "Nigerian Legal System",          faculty: "Law",     level: "100L", units: 3, materials: 14, pastQs: 90,  rating: 4.5, progress: 0,  color: "purple" },
]

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
  const [tab, setTab] = useState<"all" | "enrolled">("all")
  const [backendCourses, setBackendCourses] = useState<Course[]>([])
  const [sourceNote, setSourceNote] = useState("Showing sample courses while backend data loads.")

  useEffect(() => {
    let active = true

    async function loadCourses() {
      try {
        const courses = await fetchCourses()
        if (!active) return

        if (Array.isArray(courses) && courses.length > 0) {
          setBackendCourses(courses.map(mapApiCourse))
          setSourceNote("Synced with backend course data.")
        } else {
          setSourceNote("No backend courses yet. Showing sample courses.")
        }
      } catch {
        if (active) setSourceNote("Backend courses unavailable. Showing sample courses.")
      }
    }

    loadCourses()
    return () => {
      active = false
    }
  }, [])

  const courses = backendCourses.length > 0 ? backendCourses : COURSES

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (tab === "enrolled" && c.progress === 0) return false
      if (faculty !== "All" && c.faculty !== faculty) return false
      if (level !== "All" && c.level !== level) return false
      if (q) {
        const s = q.toLowerCase()
        if (!c.code.toLowerCase().includes(s) && !c.name.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [courses, q, faculty, level, tab])

  const enrolledCount = courses.filter(c => c.progress > 0).length

  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Course Library</h1>
          <p className="dash-welcome-sub">
            {courses.length} courses · {enrolledCount} enrolled · Aligned with UNILAG curriculum
          </p>
          <p className="dash-welcome-sub dash-welcome-note">{sourceNote}</p>
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

        <div className="lib-tabs">
          <button
            className={`lib-tab ${tab === "all" ? "lib-tab-active" : ""}`}
            onClick={() => setTab("all")}
          >
            All courses
          </button>
          <button
            className={`lib-tab ${tab === "enrolled" ? "lib-tab-active" : ""}`}
            onClick={() => setTab("enrolled")}
          >
            Enrolled ({enrolledCount})
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="lib-grid">
        {filtered.map((c) => (
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

            {c.progress > 0 ? (
              <>
                <div className="lib-card-progress-info">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="dash-progress">
                  <span className={`dash-progress-fill ${PROGRESS_BG[c.color]}`} style={{ width: `${c.progress}%` }} />
                </div>
                <div className="lib-card-actions">
                  <ComingSoonAction className="btn btn-secondary btn-sm flex-1">
                    <HiOutlineClock /> Continue
                  </ComingSoonAction>
                  <Link href="/cbt" className="btn btn-primary btn-sm flex-1">
                    Practice
                  </Link>
                </div>
              </>
            ) : (
              <div className="lib-card-actions lib-card-actions-single">
                <ComingSoonAction className="btn btn-primary btn-sm w-full" title="Course enrollment">
                  Enroll
                </ComingSoonAction>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="lib-empty">
            <p>No courses match those filters.</p>
            <button onClick={() => { setQ(""); setFaculty("All"); setLevel("All"); setTab("all"); }} className="btn btn-secondary btn-sm">
              Reset filters
            </button>
          </div>
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
