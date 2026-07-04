'use client'

export type Tier = 'FREE' | 'HALF' | 'FULL'

export type AuthUser = {
  id: string
  username: string
  email: string
  avatarUrl?: string | null
  tier?: Tier
  faculty?: string | null
  department?: string | null
  level?: number | null
  accessToken: string
  refreshToken: string
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
  faculty?: string
  department?: string
  level?: number
}

export type CourseApiItem = {
  id: string
  title: string
  code: string
  units: number
  questions?: QuestionApiItem[]
}

export type QuestionApiItem = {
  id: string
  topic: string
  question: string
  options: string[]
  answer: number
  explanation: string
  courseId: string
  course?: CourseApiItem
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

const SESSION_KEY = 'unilock.session'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
}

function getAccessToken() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return (JSON.parse(raw) as AuthUser).accessToken ?? null
  } catch {
    return null
  }
}

export function saveSession(user: AuthUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function getSession(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  const token = options.auth ? getAccessToken() : null

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      typeof data?.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join(', ')
          : 'Something went wrong. Please try again.'
    throw new ApiError(message, response.status)
  }

  return data as T
}

export function loginUser(email: string, password: string) {
  return apiRequest<AuthUser>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function registerUser(payload: RegisterPayload) {
  return apiRequest<{ message: string; data: Omit<AuthUser, 'accessToken' | 'refreshToken'> }>('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function verifyEmail(email: string, token: string) {
  return apiRequest<{ message: string }>('/auth/verify-email', {
    method: 'POST',
    body: { email, token },
  })
}

export function fetchCourses() {
  return apiRequest<CourseApiItem[]>('/course', { auth: true })
}

export function fetchQuestions() {
  return apiRequest<QuestionApiItem[]>('/question')
}

export function checkout(tier: Exclude<Tier, 'FREE'>) {
  return apiRequest<{ checkoutUrl: string; reference: string }>('/order/checkout', {
    method: 'POST',
    auth: true,
    body: { tier },
  })
}
