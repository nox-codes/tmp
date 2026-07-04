import Image from "next/image"
import {
  HiOutlineMail,
  HiOutlineAcademicCap,
  HiOutlineIdentification,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineFire,
  HiOutlineLightningBolt,
  HiOutlineStar,
} from "react-icons/hi"
import ComingSoonAction from "../componenets/ComingSoonAction"

const achievements = [
  { name: "First CBT",          date: "Sep 2024", icon: "🎓", desc: "Took your first practice exam" },
  { name: "7-day streak",       date: "Oct 2024", icon: "🔥", desc: "Studied 7 days in a row" },
  { name: "Top 10%",            date: "Nov 2024", icon: "🏆", desc: "Reached top 10% in your dept" },
  { name: "100 CBTs",           date: "Dec 2024", icon: "💯", desc: "Completed 100 practice attempts" },
  { name: "GPA jump",           date: "Jan 2025", icon: "📈", desc: "+0.5 GPA improvement" },
  { name: "Helped 10 friends",  date: "Feb 2025", icon: "🤝", desc: "Invited 10 classmates to UniLock" },
]

const courses = [
  { code: "CSC 312", name: "Algorithms & Complexity", progress: 78 },
  { code: "MTH 201", name: "Calculus II",             progress: 62 },
  { code: "STA 211", name: "Probability & Stats",     progress: 91 },
  { code: "PHY 102", name: "General Physics II",      progress: 45 },
]

export default function Profile() {
  return (
    <div className="dash">
      {/* Cover + identity */}
      <section className="profile-cover">
        <div className="profile-cover-bg" />
        <div className="profile-identity">
          <div className="profile-avatar">
            <Image src="/male-avatar.svg" alt="Profile" width={120} height={120} />
          </div>
          <div className="profile-identity-info">
            <h1 className="profile-name display">Nox Adekunle</h1>
            <p className="profile-handle">@nox · she/her</p>
            <div className="profile-badges">
              <span className="profile-badge profile-badge-pro"><HiOutlineStar /> Pro</span>
              <span className="profile-badge"><HiOutlineFire /> 12-day streak</span>
              <span className="profile-badge"><HiOutlineLightningBolt /> Top 12%</span>
            </div>
          </div>
          <ComingSoonAction className="btn btn-secondary" title="Profile editing">
            <HiOutlinePencil /> Edit profile
          </ComingSoonAction>
        </div>
      </section>

      {/* Two-column main — uses dash-grid with hairline border */}
      <div className="dash-grid">
        {/* Left */}
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">About</h2>
              <p className="dash-card-sub">Public info</p>
            </div>
          </div>
          <ul className="profile-info">
            <li><HiOutlineMail /> <span>nox@unilag.edu.ng</span></li>
            <li><HiOutlineIdentification /> <span>219024050</span></li>
            <li><HiOutlineAcademicCap /> <span>Computer Science · 300L · Faculty of Science</span></li>
            <li><HiOutlineLocationMarker /> <span>Akoka, Lagos</span></li>
            <li><HiOutlineCalendar /> <span>Joined September 2024</span></li>
          </ul>
        </div>

        {/* Right top — stats */}
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

        {/* Left bottom — courses */}
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Currently enrolled</h2>
              <p className="dash-card-sub">4 courses this semester</p>
            </div>
          </div>
          <ul className="profile-courses">
            {courses.map((c) => (
              <li key={c.code} className="profile-course">
                <div>
                  <p className="profile-course-code">{c.code}</p>
                  <p className="profile-course-name">{c.name}</p>
                </div>
                <div className="profile-course-progress">
                  <div className="dash-progress">
                    <span className="dash-progress-fill bg-teal-400" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span>{c.progress}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right bottom — achievements */}
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Achievements</h2>
              <p className="dash-card-sub">6 of 24 unlocked</p>
            </div>
          </div>
          <div className="profile-achievements">
            {achievements.map((a) => (
              <div key={a.name} className="profile-achievement">
                <div className="profile-achievement-icon">{a.icon}</div>
                <p className="profile-achievement-name">{a.name}</p>
                <p className="profile-achievement-date">{a.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
