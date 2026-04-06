'use client'
import { usePathname } from "next/navigation";
import NavBar from "./navBar";
import UserNav from "./userNav";


const PUBLIC_ROUTES = ['/', '/about', '/contact', '/login', '/register', '/pricing']

export default function DynamicNav() {
    const pathname = usePathname()
    const isPublic = PUBLIC_ROUTES.includes(pathname)

    return isPublic ? <NavBar /> : <UserNav />
}