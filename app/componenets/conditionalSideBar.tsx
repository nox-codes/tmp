'use client'
import { usePathname } from "next/navigation";
import SideBar from "./sideBar"

const SIDEBAR_ROUTES = [
  '/dashboard',
  '/profile',
  '/bookmarks',
  '/analytics',
  '/library',
  '/cbt',
  '/groups',
  '/notifications',
  '/settings',
]

// Routes inside an authed area but should be presented fullscreen (no sidebar).
const FULLSCREEN_ROUTES = ['/cbt/exam']

export default function ConditionalSideBar() {
  const pathname = usePathname();
  const showSidebar =
    SIDEBAR_ROUTES.some(route => pathname.startsWith(route)) &&
    !FULLSCREEN_ROUTES.some(route => pathname.startsWith(route))

  return showSidebar ? <SideBar /> : null
}
