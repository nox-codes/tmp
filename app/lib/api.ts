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
  semester?: string | null
  isVerified?: boolean
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

const SESSION_COOKIE = 'unilock_session'

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

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function getAccessToken(): string | null {
  const raw = getCookie(SESSION_COOKIE)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.user?.accessToken ?? null
  } catch {
    return null
  }
}

function getRefreshToken(): string | null {
  const raw = getCookie(SESSION_COOKIE)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.user?.refreshToken ?? null
  } catch {
    return null
  }
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

  if (response.status === 401 && options.auth) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        })
        if (refreshRes.ok) {
          const { accessToken } = await refreshRes.json()
          const raw = getCookie(SESSION_COOKIE)
          if (raw) {
            const parsed = JSON.parse(raw)
            parsed.user.accessToken = accessToken
            const expires = new Date(Date.now() + 30 * 86400000).toUTCString()
            document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(parsed))}; expires=${expires}; path=/; SameSite=Lax`
          }
          headers.Authorization = `Bearer ${accessToken}`
          const retryRes = await fetch(`${getApiBaseUrl()}${path}`, {
            method: options.method ?? 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
          })
          const retryText = await retryRes.text()
          const retryData = retryText ? JSON.parse(retryText) : null
          if (!retryRes.ok) {
            const msg = typeof retryData?.message === 'string'
              ? retryData.message
              : Array.isArray(retryData?.message)
                ? retryData.message.join(', ')
                : 'Something went wrong.'
            throw new ApiError(msg, retryRes.status)
          }
          return retryData as T
        }
      } catch {
        throw new ApiError('Session expired. Please log in again.', 401)
      }
    }
    throw new ApiError('Session expired. Please log in again.', 401)
  }

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

export function resendOtp(email: string) {
  return apiRequest<{ message: string }>('/auth/resend-otp', {
    method: 'POST',
    body: { email },
  })
}

export function fetchCourses() {
  return apiRequest<CourseApiItem[]>('/courses', { auth: true })
}

export function fetchQuestions() {
  return apiRequest<QuestionApiItem[]>('/question')
}

export function fetchQuestionById(id: string) {
  return apiRequest<QuestionApiItem>(`/question/${id}`, { auth: true })
}

export function fetchCourseById(id: string) {
  return apiRequest<CourseApiItem>(`/courses/${id}`)
}

export function fetchQuestionsByCourse(courseCode: string) {
  return apiRequest<QuestionApiItem[]>('/question').then(qs =>
    qs.filter(q => q.course?.code === courseCode)
  )
}

export type ExamResult = {
  courseCode: string
  courseName: string
  score: number
  correct: number
  wrong: number
  skipped: number
  total: number
  duration: string
  answers: Record<number, number>
  questions: QuestionApiItem[]
  flagged: number[]
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<{ message: string }>('/auth/change-password', {
    method: 'PATCH',
    auth: true,
    body: { currentPassword, newPassword },
  })
}

export function updateUserProfile(data: Partial<{ username: string; faculty: string; department: string; level: number; gender: string }>) {
  return apiRequest<{ message: string }>('/user/profile', {
    method: 'PATCH',
    auth: true,
    body: data,
  })
}

export function updateUserTier(tier: Tier) {
  const raw = getCookie(SESSION_COOKIE)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    parsed.user.tier = tier
    const expires = new Date(Date.now() + 30 * 86400000).toUTCString()
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(parsed))}; expires=${expires}; path=/; SameSite=Lax`
  } catch {}
}

export function checkout(tier: Exclude<Tier, 'FREE'>) {
  return apiRequest<{ checkoutUrl: string; reference: string }>('/order/checkout', {
    method: 'POST',
    auth: true,
    body: { tier },
  }).then(res => {
    sessionStorage.setItem('pending_payment', JSON.stringify({ reference: res.reference, tier }))
    return res
  })
}

export function verifyPayment(reference: string, tier: Tier) {
  return apiRequest<{ message: string }>('/order/verify-payment', {
    method: 'POST',
    auth: true,
    body: { reference, tier },
  })
}
