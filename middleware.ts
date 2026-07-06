import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/library',
  '/cbt',
  '/analytics',
  '/bookmarks',
  '/groups',
  '/profile',
  '/settings',
  '/notifications',
]

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/pricing',
  '/payment',
  '/api',
  '/_next',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isProtected) return NextResponse.next()

  const sessionCookie = request.cookies.get('unilock_session')
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(sessionCookie.value))
    if (!parsed?.user?.accessToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo/).*)',
  ],
}
