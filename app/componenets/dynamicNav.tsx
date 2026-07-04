'use client'
import { usePathname } from "next/navigation";
import NavBar from "./navBar";
import UserNav from "./userNav";

const PUBLIC_ROUTES = ['/', '/about', '/contact', '/login', '/register', '/pricing']

// Routes where we want the page to take over the full screen (no nav).
const FULLSCREEN_ROUTES = ['/cbt/exam']

export default function DynamicNav() {
    const pathname = usePathname()
    if (FULLSCREEN_ROUTES.some(route => pathname.startsWith(route))) return null
    const isPublic = PUBLIC_ROUTES.includes(pathname)
    return isPublic ? <NavBar /> : <UserNav />
}
