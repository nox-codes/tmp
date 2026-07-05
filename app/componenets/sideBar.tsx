'use client'

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineBookmark,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi"
import { useAuth } from "../lib/auth-context"

const primary = [
  { href: "/dashboard",  label: "Dashboard",    Icon: HiOutlineHome },
  { href: "/library",    label: "Library",      Icon: HiOutlineBookOpen },
  { href: "/cbt",        label: "CBT Mode",     Icon: HiOutlineLightningBolt },
  { href: "/analytics",  label: "Analytics",    Icon: HiOutlineChartBar },
  { href: "/bookmarks",  label: "Bookmarks",    Icon: HiOutlineBookmark },
  { href: "/groups",     label: "Study Groups", Icon: HiOutlineUserGroup },
]

const secondary = [
  { href: "/profile",  label: "Profile",  Icon: HiOutlineUser },
  { href: "/settings", label: "Settings", Icon: HiOutlineCog },
]

function toDateKey(ts: string) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function computeStreak(): number {
  if (typeof window === "undefined") return 0
  let raw: string | null = null
  try { raw = localStorage.getItem("cbt_history") } catch { return 0 }
  if (!raw) return 0
  let history: { timestamp: string }[] = []
  try { history = JSON.parse(raw) } catch { return 0 }
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

export default function SideBar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const streak = useMemo(() => computeStreak(), [])
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="sidebar-rail" aria-label="Primary">
      <nav className="sidebar-group">
        {primary.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${isActive(href) ? "sidebar-link-active" : ""}`}
            data-tooltip={label}
          >
            <Icon className="sidebar-icon" aria-hidden />
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <nav className="sidebar-group">
        {secondary.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${isActive(href) ? "sidebar-link-active" : ""}`}
            data-tooltip={label}
          >
            <Icon className="sidebar-icon" aria-hidden />
            <span className="sr-only">{label}</span>
          </Link>
        ))}
        <button
          onClick={() => logout()}
          className="sidebar-link sidebar-link-danger"
          data-tooltip="Log Out"
          aria-label="Log Out"
        >
          <HiOutlineLogout className="sidebar-icon" aria-hidden />
          <span className="sr-only">Log Out</span>
        </button>
      </nav>

      <div className="sidebar-streak" data-tooltip={`${streak}-day streak`}>
        <span className="sidebar-streak-flame">🔥</span>
        <span className="sidebar-streak-count">{streak}</span>
      </div>
    </aside>
  )
}
