'use client'

import { useMemo } from "react"
import Image from "next/image"
import {
  HiOutlineMail,
  HiOutlineAcademicCap,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineFire,
  HiOutlineStar,
} from "react-icons/hi"
import { useAuth } from "../lib/auth-context"
import ComingSoonAction from "../componenets/ComingSoonAction"

type CbtResult = {
  courseCode: string
  courseName: string
  score: number
  duration: string
  timestamp: string
}

function toDateKey(ts: string) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function computeStreak(history: CbtResult[]): number {
  if (history.length === 0) return 0
  const activeDays = new Set(history.map(h => toDateKey(h.timestamp)))
  const today = toDateKey(new Date().toISOString())
  const yesterday = toDateKey(new Date(Date.now() - 86400000).toISOString())
  if (!activeDays.has(today) && !activeDays.has(yesterday)) return 0
  const start = activeDays.has(today) ? today : yesterday
  let streak = 0
  const d = new Date(start)
  while (true) {
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    if (!activeDays.has(key)) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
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

export default function Profile() {
  const { user, gender } = useAuth()
  const avatarSrc = gender === 'female' ? '/female-avatar.svg' : '/male-avatar.svg'

  const history = useMemo(() => loadHistory(), [])
  const totalCbts = history.length
  const avgScore = totalCbts > 0 ? Math.round(history.reduce((s, r) => s + r.score, 0) / totalCbts) : 0
  const totalMinutes = history.reduce((s, r) => {
    const m = parseInt(r.duration)
    return s + (isNaN(m) ? 0 : m)
  }, 0)
  const lastScore = totalCbts > 0 ? history[totalCbts - 1].score : null
  const totalHours = Math.round(totalMinutes / 60)
  const streak = useMemo(() => computeStreak(history), [history])

  const displayName = user?.username ?? "Student"
  const email = user?.email ?? "student@unilag.edu.ng"
  const department = user?.department ?? "—"
  const faculty = user?.faculty ?? "—"
  const level = user?.level ? `${user.level}L` : "—"
  const tier = user?.tier ?? "FREE"
  const tierBadge = tier === 'FULL' ? 'Premium' : tier === 'HALF' ? 'Basic' : 'Free'

  return (
    <div className="dash">
      <section className="profile-cover">
        <div className="profile-cover-bg" />
        <div className="profile-identity">
          <div className="profile-avatar">
            <Image src={avatarSrc} alt="Profile" width={120} height={120} />
          </div>
          <div className="profile-identity-info">
            <h1 className="profile-name display">{displayName}</h1>
            <p className="profile-handle">@{displayName.toLowerCase().replace(/\s+/g, '')}</p>
            <div className="profile-badges">
              <span className={`profile-badge ${tier !== 'FREE' ? 'profile-badge-pro' : ''}`}>
                <HiOutlineStar /> {tierBadge}
              </span>
              <span className="profile-badge"><HiOutlineFire /> {streak}-day streak</span>

            </div>
          </div>
          <ComingSoonAction className="btn btn-secondary" title="Profile editing">
            <HiOutlinePencil /> Edit profile
          </ComingSoonAction>
        </div>
      </section>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">About</h2>
              <p className="dash-card-sub">Public info</p>
            </div>
          </div>
          <ul className="profile-info">
            <li><HiOutlineMail /> <span>{email}</span></li>
            <li><HiOutlineIdentification /> <span>{department}</span></li>
            <li><HiOutlineAcademicCap /> <span>{department} · {level} · {faculty}</span></li>
            <li><HiOutlineCalendar /> <span>Joined 2024</span></li>
          </ul>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Stats</h2>
              <p className="dash-card-sub">Lifetime</p>
            </div>
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <p className="profile-stat-val">{lastScore !== null ? `${lastScore}%` : "—"}</p>
              <p className="profile-stat-lbl">Latest score</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-val">{totalCbts}</p>
              <p className="profile-stat-lbl">CBTs taken</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-val">{totalCbts > 0 ? `${avgScore}%` : "—"}</p>
              <p className="profile-stat-lbl">Avg score</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-val">{totalHours > 0 ? `${totalHours} hr` : "—"}</p>
              <p className="profile-stat-lbl">Study time</p>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Currently enrolled</h2>
              <p className="dash-card-sub">Courses this semester</p>
            </div>
          </div>
          <p className="text-[var(--text-mute)] text-sm p-6">No enrollment data available yet.</p>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Achievements</h2>
              <p className="dash-card-sub">0 of 24 unlocked</p>
            </div>
          </div>
          <p className="text-[var(--text-mute)] text-sm p-6">Complete your first CBT to earn achievements.</p>
        </div>
      </div>
    </div>
  )
}
