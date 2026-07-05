import { NextRequest, NextResponse } from 'next/server'

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
  const accessToken = request.nextUrl.searchParams.get('access_token')
  const refreshToken = request.nextUrl.searchParams.get('refresh_token')

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  const payload = decodeJwtPayload(accessToken)
  if (!payload?.sub) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  const session = {
    user: {
      id: payload.sub,
      email: payload.username || '',
      username: payload.username || '',
      accessToken,
      refreshToken,
    },
  }

  const response = NextResponse.redirect(new URL('/dashboard', request.url))
  response.cookies.set('unilock_session', JSON.stringify(session), {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  })

  return response
}
