import { NextRequest } from 'next/server'
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

async function proxy(request: NextRequest): Promise<Response> {
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
      const raw = proxyRes.rawHeaders || []
      const setCookies: string[] = []
      const location = proxyRes.headers['location'] || ''
      const responseHeaders = new Headers()

      for (let i = 0; i < raw.length; i += 2) {
        const key = raw[i]
        const val = raw[i + 1]
        if (key.toLowerCase() === 'set-cookie') {
          setCookies.push(val)
        } else if (key.toLowerCase() !== 'content-length') {
          responseHeaders.set(key, val)
        }
      }

      // Set cookies directly as raw Set-Cookie headers
      for (const sc of setCookies) {
        responseHeaders.append('Set-Cookie', sc)
      }

      const chunks: Buffer[] = []
      proxyRes.on('data', (chunk: Buffer) => chunks.push(chunk))
      proxyRes.on('end', () => {
        const body = proxyRes.statusCode === 204 || proxyRes.statusCode === 304
          ? null
          : Buffer.concat(chunks)
        resolve(new Response(body, {
          status: proxyRes.statusCode,
          statusText: proxyRes.statusMessage,
          headers: responseHeaders,
        }))
      })
    })

    proxyReq.on('error', reject)
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}
