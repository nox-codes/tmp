'use client'

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

export default function SideBar() {
  const pathname = usePathname()
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
        <Link href="/" className="sidebar-link sidebar-link-danger" data-tooltip="Log Out">
          <HiOutlineLogout className="sidebar-icon" aria-hidden />
          <span className="sr-only">Log Out</span>
        </Link>
      </nav>

      <div className="sidebar-streak" data-tooltip="12-day streak">
        <span className="sidebar-streak-flame">🔥</span>
        <span className="sidebar-streak-count">12</span>
      </div>
    </aside>
  )
}
