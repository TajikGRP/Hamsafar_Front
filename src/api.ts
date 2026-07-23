/* API client for the Hamsafar Spring Boot backend.
   Base URL: VITE_API_BASE_URL (deployed) or /api (Vite dev proxy → :8080). */

const BASE: string = import.meta.env.VITE_API_BASE_URL ?? '/api'

/* ---------- Types mirroring backend DTOs ---------- */

export type FareType = 'PER_PERSON' | 'FIXED_TOTAL'
export type RideScheduleStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'DEPARTED'
  | 'COMPLETED'
  | 'CANCELLED'
export type RideJoinStatus =
  | 'PENDING'
  | 'WAITLISTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface UserResponse {
  userId: number
  email: string
  name: string
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface UserSummary {
  userId: number
  email: string
  name: string
}

export interface VehicleSummary {
  vehicleId: number
  vehicleType: string
  manufacturer: string | null
  modelName: string
  licensePlate: string
  passengerCapacity: number
  trunkVolumeLiter: number | null
  vehicleImageUrl: string | null
  active: boolean
}

export interface DriverSummary {
  driverId: number
  name: string
  email: string
  driverPhone: string
  vehicle: VehicleSummary | null
}

export interface DriverResponse {
  driverId: number
  userId: number
  email: string
  name: string
  phone: string
  driverPhone: string
  introduction: string | null
  vehicleId: number
  vehicleType: string
  manufacturer: string | null
  modelName: string
  licensePlate: string
  passengerCapacity: number
  trunkVolumeLiter: number | null
  maxLuggageCount: number
  largeLuggageCapacity: number | null
  vehicleImageUrl: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface RideScheduleResponse {
  scheduleId: number
  driver: DriverSummary
  title: string | null
  meetingAt: string
  joinDeadlineAt: string | null
  meetingAddress: string
  meetingPlaceName: string | null
  destinationAddress: string
  destinationPlaceName: string | null
  fareType: FareType
  fareAmount: number
  maxPassengerCount: number
  approvedPassengerCount: number
  pendingPassengerCount: number
  remainingPassengerCount: number
  maxLuggageCount: number
  approvedLuggageCount: number
  pendingLuggageCount: number
  remainingLuggageCount: number
  waitlistedRequestCount: number
  description: string | null
  status: RideScheduleStatus
}

export interface RideJoinResponse {
  joinId: number
  scheduleId: number
  user: UserSummary
  passengerCount: number
  luggageCount: number
  largeLuggageCount: number | null
  specialLuggageNote: string | null
  unitFare: number
  totalFare: number
  status: RideJoinStatus
  waitlistPosition: number | null
  joinedAt: string
  meetingAddress: string
  meetingPlaceName: string | null
  destinationAddress: string
  destinationPlaceName: string | null
  meetingAt: string
}

/* ---------- Low-level fetch helper ---------- */

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      /* keep default message */
    }
    throw Object.assign(new Error(message), { status: res.status })
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

/* ---------- Users / Drivers ---------- */

export const listUsers = () => http<UserResponse[]>('/users')

export const createUser = (body: { email: string; name: string }) =>
  http<UserResponse>('/users', { method: 'POST', body: JSON.stringify(body) })

export const listDrivers = () => http<DriverResponse[]>('/drivers')

export interface DriverCreateBody {
  email: string
  name: string
  phone: string
  driverPhone: string
  introduction?: string
  vehicleType: string
  manufacturer?: string
  modelName: string
  licensePlate: string
  passengerCapacity: number
  trunkVolumeLiter?: number
  maxLuggageCount: number
  largeLuggageCapacity?: number
  vehicleImageUrl?: string
}

export const createDriver = (body: DriverCreateBody) =>
  http<DriverResponse>('/drivers', { method: 'POST', body: JSON.stringify(body) })

/* ---------- Ride schedules ---------- */

export interface ScheduleCreateBody {
  title?: string
  meetingAt: string // ISO LocalDateTime, must be in the future
  joinDeadlineAt?: string
  meetingAddress: string
  meetingPlaceName?: string
  meetingLatitude?: number
  meetingLongitude?: number
  destinationAddress: string
  destinationPlaceName?: string
  destinationLatitude?: number
  destinationLongitude?: number
  fareAmount: number
  description?: string
}

export const createSchedule = (driverId: number, body: ScheduleCreateBody) =>
  http<RideScheduleResponse>(`/rides/schedules?driverId=${driverId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })

export const searchSchedules = (params: {
  departure?: string
  destination?: string
  date?: string // yyyy-MM-dd
  passengerCount?: number
  page?: number
  size?: number
  sortBy?: 'meetingAt' | 'fareAmount' | 'createdAt'
  sortDirection?: 'asc' | 'desc'
}) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  })
  return http<PageResponse<RideScheduleResponse>>(`/rides/schedules?${q}`)
}

export const getSchedule = (scheduleId: number) =>
  http<RideScheduleResponse>(`/rides/schedules/${scheduleId}`)

export const getDriverSchedules = (driverId: number, size = 50) =>
  http<PageResponse<RideScheduleResponse>>(
    `/rides/drivers/${driverId}/schedules?size=${size}&sortBy=meetingAt&sortDirection=desc`,
  )

/* ---------- Ride joins (booking requests) ---------- */

export interface JoinCreateBody {
  passengerCount: number
  luggageCount: number
  largeLuggageCount?: number
  specialLuggageNote?: string
}

export const createJoin = (
  scheduleId: number,
  userId: number,
  body: JoinCreateBody,
) =>
  http<RideJoinResponse>(`/rides/schedules/${scheduleId}/joins?userId=${userId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })

export const getScheduleJoins = (scheduleId: number, driverId: number, size = 50) =>
  http<PageResponse<RideJoinResponse>>(
    `/rides/schedules/${scheduleId}/joins?driverId=${driverId}&size=${size}`,
  )

export const getUserJoins = (userId: number, size = 50) =>
  http<PageResponse<RideJoinResponse>>(`/rides/users/${userId}/joins?size=${size}`)

export const approveJoin = (joinId: number, driverId: number) =>
  http<RideJoinResponse>(`/rides/joins/${joinId}/approve?driverId=${driverId}`, {
    method: 'PATCH',
  })

export const rejectJoin = (joinId: number, driverId: number) =>
  http<RideJoinResponse>(`/rides/joins/${joinId}/reject?driverId=${driverId}`, {
    method: 'PATCH',
  })

export const cancelJoin = (joinId: number, userId: number) =>
  http<RideJoinResponse>(`/rides/joins/${joinId}/cancel?userId=${userId}`, {
    method: 'PATCH',
  })

/* ---------- Demo accounts (no auth in backend yet) ---------- */

const DEMO_PASSENGER_EMAIL = 'demo.passenger@hamsafar.tj'
const DEMO_DRIVER_EMAIL = 'demo.driver@hamsafar.tj'

export async function ensureDemoPassenger(): Promise<UserResponse> {
  const users = await listUsers()
  const existing = users.find((u) => u.email === DEMO_PASSENGER_EMAIL)
  if (existing) return existing
  return createUser({ email: DEMO_PASSENGER_EMAIL, name: 'Sofia M.' })
}

export async function ensureDemoDriver(): Promise<DriverResponse> {
  const drivers = await listDrivers()
  const existing = drivers.find((d) => d.email === DEMO_DRIVER_EMAIL)
  if (existing) return existing
  return createDriver({
    email: DEMO_DRIVER_EMAIL,
    name: 'Bakhtiyor S.',
    phone: '+992935550117',
    driverPhone: '+992935550117',
    introduction: 'Dushanbe ↔ Khorog, daily departures from the Badakhshan stand',
    vehicleType: 'SUV',
    manufacturer: 'Toyota',
    modelName: 'Land Cruiser',
    licensePlate: '5124 BS 01',
    passengerCapacity: 6,
    trunkVolumeLiter: 600,
    maxLuggageCount: 8,
    largeLuggageCapacity: 4,
  })
}

/* ---------- Small display helpers ---------- */

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

export const fmtDateTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/* yyyy-MM-dd in local time */
export const toDateParam = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/* ISO LocalDateTime without timezone, e.g. 2026-07-22T06:00:00 */
export const toLocalDateTimeParam = (d: Date) => {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${toDateParam(d)}T${hh}:${mm}:00`
}
