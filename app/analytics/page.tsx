import {
  HiOutlineTrendingUp,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineLightningBolt,
} from "react-icons/hi"

const weeklyHours = [3, 5, 2, 6, 4, 7, 5]
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const subjects = [
  { name: "Algorithms (CSC 312)", mastery: 88, color: "bg-teal-400"   },
  { name: "Calculus II",          mastery: 74, color: "bg-amber-400"  },
  { name: "Probability (STA 211)",mastery: 92, color: "bg-emerald-400"},
  { name: "Operating Systems",    mastery: 55, color: "bg-violet-400" },
  { name: "Physics II",           mastery: 41, color: "bg-rose-400"   },
]

const strengths = [
  { topic: "Sorting & Searching",   level: 95 },
  { topic: "Trees",                 level: 92 },
  { topic: "Hypothesis Testing",    level: 88 },
]
const weaknesses = [
  { topic: "Dynamic Programming",   level: 48 },
  { topic: "Vector Calculus",       level: 52 },
  { topic: "Process Scheduling",    level: 38 },
]

const sessions = [
  { date: "Today",     items: ["52 min · CSC 312 CBT — 88%", "30 min · Algorithms reading"] },
  { date: "Yesterday", items: ["45 min · MTH 201 CBT — 76%", "1h · Tutorial group"] },
  { date: "Mon",       items: ["38 min · STA 211 CBT — 92%"] },
]

const max = Math.max(...weeklyHours)

export default function Analytics() {
  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Analytics</h1>
          <p className="dash-welcome-sub">
            Find your patterns. Double down on what works.
          </p>
        </div>
      </div>

      {/* Top stats */}
      <section className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-icon bg-teal-500/10 text-teal-400">
            <HiOutlineAcademicCap className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Predicted GPA</p>
            <p className="dash-stat-value">4.45</p>
          </div>
          <span className="dash-stat-trend">+0.13</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-amber-500/10 text-amber-400">
            <HiOutlineClock className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Study hrs / wk</p>
            <p className="dash-stat-value">23</p>
          </div>
          <span className="dash-stat-trend">+3h</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-emerald-500/10 text-emerald-400">
            <HiOutlineTrendingUp className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">Improvement</p>
            <p className="dash-stat-value">+12%</p>
          </div>
          <span className="dash-stat-trend">30d</span>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon bg-violet-500/10 text-violet-400">
            <HiOutlineLightningBolt className="h-5 w-5" />
          </div>
          <div className="dash-stat-info">
            <p className="dash-stat-label">CBT pass rate</p>
            <p className="dash-stat-value">94%</p>
          </div>
          <span className="dash-stat-trend">↑</span>
        </div>
      </section>

      <div className="dash-grid">
        {/* Weekly hours bar chart */}
        <section className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Study hours this week</h2>
              <p className="dash-card-sub">23 hours total · best day: Saturday</p>
            </div>
          </div>
          <div className="analytics-bars">
            {weeklyHours.map((h, i) => (
              <div key={i} className="analytics-bar-col">
                <span className="analytics-bar-val">{h}h</span>
                <span
                  className="analytics-bar"
                  style={{ height: `${(h / max) * 100}%` }}
                />
                <span className="analytics-bar-label">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Subject mastery */}
        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Subject mastery</h2>
              <p className="dash-card-sub">Based on CBT performance</p>
            </div>
          </div>
          <ul className="analytics-subjects">
            {subjects.map((s) => (
              <li key={s.name} className="analytics-subject">
                <div className="analytics-subject-head">
                  <span>{s.name}</span>
                  <span>{s.mastery}%</span>
                </div>
                <div className="dash-progress">
                  <span className={`dash-progress-fill ${s.color}`} style={{ width: `${s.mastery}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Strengths */}
        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Strengths</h2>
              <p className="dash-card-sub">Top 3 topics</p>
            </div>
          </div>
          <ul className="analytics-tags">
            {strengths.map((s) => (
              <li key={s.topic} className="analytics-tag analytics-tag-good">
                <span>{s.topic}</span>
                <span>{s.level}%</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Weaknesses */}
        <section className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Focus areas</h2>
              <p className="dash-card-sub">Where to spend study time</p>
            </div>
          </div>
          <ul className="analytics-tags">
            {weaknesses.map((s) => (
              <li key={s.topic} className="analytics-tag analytics-tag-bad">
                <span>{s.topic}</span>
                <span>{s.level}%</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent sessions */}
        <section className="dash-card dash-card-wide">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Recent sessions</h2>
              <p className="dash-card-sub">Last 3 study days</p>
            </div>
          </div>
          <ul className="analytics-sessions">
            {sessions.map((s) => (
              <li key={s.date}>
                <p className="analytics-session-date">{s.date}</p>
                <ul className="analytics-session-items">
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
