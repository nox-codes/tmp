import { NextRequest, NextResponse } from 'next/server'
import http from 'http'
import https from 'https'

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
const parsedBackend = new URL(backendUrl)

export const runtime = 'nodejs'

export async function GET(request: NextRequest) { return proxy(request) }
export async function POST(request: NextRequest) { return proxy(request) }
export async function PATCH(request: NextRequest) { return proxy(request) }
export async function PUT(request: NextRequest) { return proxy(request) }
export async function DELETE(request: NextRequest) { return proxy(request) }

function parseSetCookie(setCookieStr: string): { name: string; value: string; options: Record<string, string> } {
  const parts = setCookieStr.split(';').map(s => s.trim())
  const [name, ...rest] = parts[0].split('=')
  const value = rest.join('=')
  const options: Record<string, string> = {}
  for (let i = 1; i < parts.length; i++) {
    const eqIdx = parts[i].indexOf('=')
    if (eqIdx === -1) {
      options[parts[i].toLowerCase()] = 'true'
    } else {
      options[parts[i].slice(0, eqIdx).toLowerCase().trim()] = parts[i].slice(eqIdx + 1).trim()
    }
  }
  return { name, value, options }
}

async function proxy(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname.replace('/api/backend', '')
  const search = request.nextUrl.search

  const body = request.method === 'GET' || request.method === 'HEAD'
    ? undefined
    : await request.text()

  return new Promise((resolve, reject) => {
    const requester = parsedBackend.protocol === 'https:' ? https : http

    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase()
      if (lower !== 'host' && lower !== 'connection' && lower !== 'content-length') {
        headers[key] = value
      }
    })

    const options: http.RequestOptions = {
      hostname: parsedBackend.hostname,
      port: parsedBackend.port || (parsedBackend.protocol === 'https:' ? 443 : 80),
      path: `${path}${search}`,
      method: request.method,
      headers,
    }

    const proxyReq = requester.request(options, (proxyRes) => {
      const chunks: Buffer[] = []
      proxyRes.on('data', (chunk: Buffer) => chunks.push(chunk))
      proxyRes.on('end', () => {
        // Handle redirects — use NextResponse.redirect + cookies API
        if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400) {
          const location = proxyRes.headers['location'] || ''
          const redirectRes = NextResponse.redirect(new URL(location, request.url))

          const raw = proxyRes.rawHeaders || []
          for (let i = 0; i < raw.length; i += 2) {
            if (raw[i].toLowerCase() === 'set-cookie') {
              const cookie = parseSetCookie(raw[i + 1])
              const maxAge = cookie.options['max-age']
              redirectRes.cookies.set(cookie.name, cookie.value, {
                path: cookie.options['path'] || '/',
                httpOnly: cookie.options['httponly'] === 'true',
                sameSite: cookie.options['samesite'] as 'lax' | 'strict' | 'none' | undefined,
                secure: cookie.options['secure'] === 'true',
                maxAge: maxAge ? parseInt(maxAge) : undefined,
              })
            }
          }

          resolve(redirectRes)
          return
        }

        // Non-redirect: forward body + headers
        const responseHeaders = new Headers()
        const raw = proxyRes.rawHeaders || []
        for (let i = 0; i < raw.length; i += 2) {
          if (raw[i].toLowerCase() !== 'set-cookie') {
            responseHeaders.set(raw[i], raw[i + 1])
          }
        }

        resolve(new NextResponse(Buffer.concat(chunks), {
          status: proxyRes.statusCode,
          statusText: proxyRes.statusMessage,
          headers: responseHeaders,
        }))
      })
    })

    proxyReq.on('error', reject)

    if (body) {
      proxyReq.write(body)
    }
    proxyReq.end()
  })
}
