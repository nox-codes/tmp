import { NextRequest, NextResponse } from 'next/server'

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.')
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    return payload as { sub?: string; username?: string }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  const token = accessToken || refreshToken
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let finalAccess = accessToken || ''
  let finalRefresh = refreshToken || ''

  if (refreshToken) {
    try {
      const res = await fetch(`${backendUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.accessToken) {
          finalAccess = data.accessToken
          finalRefresh = refreshToken
        }
      }
    } catch {}
  }

  const payload = decodeJwtPayload(finalAccess || finalRefresh)
  if (!payload?.sub) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const email = payload.username || ''
  const sessionData = JSON.stringify({
    user: {
      id: payload.sub,
      email,
      username: email,
      accessToken: finalAccess,
      refreshToken: finalRefresh,
    },
  })

  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set('unilock_session', sessionData, {
    path: '/',
    sameSite: 'lax',
    maxAge: 30 * 86400,
  })

  return response
}
