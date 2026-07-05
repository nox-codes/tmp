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
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  const token = accessToken || refreshToken
  if (!token) {
    return NextResponse.json({ error: 'no_session' }, { status: 401 })
  }

  let finalAccess = accessToken || ''
  let finalRefresh = refreshToken || ''

  if (refreshToken) {
    try {
      const res = await fetch('http://localhost:3001/auth/refresh', {
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
  const id = payload?.sub || ''
  const email = payload?.username || ''

  return NextResponse.json({
    accessToken: finalAccess,
    refreshToken: finalRefresh,
    user: {
      id,
      email,
      username: email,
      accessToken: finalAccess,
      refreshToken: finalRefresh,
    },
  })
}
