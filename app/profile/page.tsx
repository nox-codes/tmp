'use client'

import Image from "next/image"
import {
  HiOutlineMail,
  HiOutlineAcademicCap,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineFire,
  HiOutlineLightningBolt,
  HiOutlineStar,
} from "react-icons/hi"
import { useAuth } from "../lib/auth-context"
import ComingSoonAction from "../componenets/ComingSoonAction"

export default function Profile() {
  const { user, gender } = useAuth()
  const avatarSrc = gender === 'female' ? '/female-avatar.svg' : '/male-avatar.svg'

  const displayName = user?.username ?? "Student"
  const email = user?.email ?? "student@unilag.edu.ng"
  const department = user?.department ?? "—"
  const faculty = user?.faculty ?? "—"
  const level = user?.level ? `${user.level}L` : "—"
  const tier = user?.tier ?? "FREE"
  const tierBadge = tier === 'FULL' ? 'Pro' : tier === 'HALF' ? 'Essentials' : 'Free'

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
              <span className="profile-badge"><HiOutlineFire /> 12-day streak</span>
              <span className="profile-badge"><HiOutlineLightningBolt /> Top 12%</span>
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
              <p className="profile-stat-val">4.32</p>
              <p className="profile-stat-lbl">Current GPA</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-val">142</p>
              <p className="profile-stat-lbl">CBTs taken</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-val">82%</p>
              <p className="profile-stat-lbl">Avg score</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-val">68 hr</p>
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
