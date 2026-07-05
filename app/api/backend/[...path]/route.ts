import { NextRequest, NextResponse } from 'next/server'

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  return proxy(request)
}

export async function POST(request: NextRequest) {
  return proxy(request)
}

export async function PATCH(request: NextRequest) {
  return proxy(request)
}

export async function PUT(request: NextRequest) {
  return proxy(request)
}

export async function DELETE(request: NextRequest) {
  return proxy(request)
}

async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/backend', '')
  const search = request.nextUrl.search
  const url = `${backendUrl}${path}${search}`

  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    if (key !== 'host' && key !== 'connection') {
      headers[key] = value
    }
  })

  const body = request.method === 'GET' || request.method === 'HEAD'
    ? undefined
    : await request.blob()

  const res = await fetch(url, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  })

  const responseHeaders: Record<string, string> = {}
  res.headers.forEach((value, key) => {
    responseHeaders[key] = value
  })

  const responseBody = res.status === 204 || res.status === 304
    ? null
    : await res.blob()

  return new NextResponse(responseBody, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  })
}
