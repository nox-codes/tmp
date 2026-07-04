'use client'

import { HiOutlineUserGroup, HiOutlinePlus, HiOutlineFire } from "react-icons/hi"
import ComingSoonAction from "../componenets/ComingSoonAction"

const myGroups = [
  { name: "CSC 300L Squad",   members: 24, msgs: 142 },
  { name: "MTH 201 — Calc II", members: 18, msgs: 67 },
  { name: "STA 211 Sprint",   members: 12, msgs: 38 },
]

const discover = [
  { name: "Faculty of Science · 2024",     members: 412, badge: "Public" },
  { name: "Computer Science · All levels", members: 287, badge: "Public" },
  { name: "JAMB Resit Group",              members: 73,  badge: "Public" },
  { name: "Engineering 200L",              members: 156, badge: "Public" },
]

export default function Groups() {
  return (
    <div className="dash">
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-title display">Study Groups</h1>
          <p className="dash-welcome-sub">
            Find your people. Study together. Push each other.
          </p>
        </div>
        <div className="dash-welcome-actions">
          <ComingSoonAction className="btn btn-primary btn-sm px-8 py-3 text-base" title="Study groups">
            <HiOutlinePlus /> Create group
          </ComingSoonAction>
        </div>
      </div>

      <div className="dash-grid gap-12">
        <section className="dash-card dash-card-wide p-8 md:p-12">
          <div className="dash-card-head mb-10">
            <div>
              <h2 className="dash-card-title text-2xl">Your groups</h2>
              <p className="dash-card-sub text-base">{myGroups.length} joined</p>
            </div>
          </div>
          <ul className="space-y-2">
            {myGroups.map((g) => (
              <li key={g.name} className="flex items-center gap-6 py-6 first:pt-0 last:pb-0 border-b border-[var(--line)] last:border-0">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-elev-2)] text-base font-bold text-[var(--text-mute)] border border-[var(--line)]">
                  {g.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-[var(--text)]">{g.name}</p>
                  <p className="text-sm text-[var(--text-faint)] mt-1">{g.members} members · {g.msgs} new messages</p>
                </div>
                <ComingSoonAction className="btn btn-secondary btn-sm px-6 py-3 text-sm" title="Group chat">
                  Open
                </ComingSoonAction>
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-card p-8 md:p-12">
          <div className="dash-card-head mb-10">
            <div>
              <h2 className="dash-card-title text-2xl">This week&apos;s MVP</h2>
              <p className="dash-card-sub text-base">CSC 300L Squad</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center py-4 gap-6">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--bg-elev-2)] text-xl font-bold text-[var(--text-mute)] border border-[var(--line)]">
              FB
            </span>
            <div className="space-y-1">
              <p className="text-xl font-semibold text-[var(--text)]">Fatimah B.</p>
              <p className="text-base text-[var(--text-faint)]">21 hours studied · 12 CBTs</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-400 border border-amber-500/20">
              <HiOutlineFire className="h-5 w-5" /> 18-day streak
            </span>
          </div>
        </section>

        <section className="dash-card dash-card-full p-8 md:p-12">
          <div className="dash-card-head mb-10">
            <div>
              <h2 className="dash-card-title text-2xl">Discover groups</h2>
              <p className="dash-card-sub text-base">Popular in your faculty</p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {discover.map((g) => (
              <div key={g.name} className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev-2)] p-8 md:p-10 transition-all hover:border-[var(--accent)]/30">
                <div className="flex items-center justify-between mb-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                    <HiOutlineUserGroup className="text-[var(--accent)] h-7 w-7" />
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[var(--text-faint)] font-bold">{g.badge}</span>
                </div>
                <p className="text-lg font-semibold text-[var(--text)]">{g.name}</p>
                <p className="text-sm text-[var(--text-faint)] mt-2">{g.members} members</p>
                <ComingSoonAction className="btn btn-secondary btn-sm w-full mt-8 px-6 py-3 text-sm" title="Join group">
                  Join
                </ComingSoonAction>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
