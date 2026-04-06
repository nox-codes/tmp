'use client'
import { usePathname } from "next/navigation";
import SideBar from "./sideBar"

const SIDEBAR_ROUTES = ['/dashboard', '/profile', '/bookmarks', '/analytics', '/library']


export default function ConditionalSideBar() {
  const pathname = usePathname();
  const showSidebar = SIDEBAR_ROUTES.some(route => pathname.startsWith(route));

  return showSidebar ? <SideBar /> : null

}
