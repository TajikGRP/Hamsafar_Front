/* In-memory mock of the Hamsafar Spring Boot API (same routes & DTO shapes).
   Used only to test the frontend wiring inside the sandbox. */
import http from 'node:http'

const now = () => new Date().toISOString().slice(0, 19)

const db = {
  users: [], // {userId,email,name,role,createdAt,updatedAt}
  drivers: [], // DriverResponse shape
  schedules: [], // internal
  joins: [], // internal
  seq: { user: 1, driver: 1, vehicle: 1, schedule: 1, join: 1 },
}

const CAP_HOLD = new Set(['PENDING', 'APPROVED'])

function capacity(s) {
  const joins = db.joins.filter((j) => j.scheduleId === s.scheduleId)
  const sum = (statuses) =>
    joins
      .filter((j) => statuses.has ? statuses.has(j.status) : statuses.includes(j.status))
      .reduce((a, j) => a + j.passengerCount, 0)
  const approvedP = sum(['APPROVED'])
  const pendingP = sum(['PENDING'])
  const held = sum(CAP_HOLD)
  return {
    approvedPassengerCount: approvedP,
    pendingPassengerCount: pendingP,
    remainingPassengerCount: Math.max(0, s.maxPassengerCount - held),
    approvedLuggageCount: 0,
    pendingLuggageCount: 0,
    remainingLuggageCount: s.maxLuggageCount,
    waitlistedRequestCount: joins.filter((j) => j.status === 'WAITLISTED').length,
  }
}

function scheduleResponse(s) {
  const d = db.drivers.find((x) => x.driverId === s.driverId)
  return {
    scheduleId: s.scheduleId,
    driver: {
      driverId: d.driverId,
      name: d.name,
      email: d.email,
      driverPhone: d.driverPhone,
      vehicle: {
        vehicleId: d.vehicleId,
        vehicleType: d.vehicleType,
        manufacturer: d.manufacturer,
        modelName: d.modelName,
        licensePlate: d.licensePlate,
        passengerCapacity: d.passengerCapacity,
        trunkVolumeLiter: d.trunkVolumeLiter,
        vehicleImageUrl: d.vehicleImageUrl ?? null,
        active: true,
      },
    },
    title: s.title ?? null,
    meetingAt: s.meetingAt,
    joinDeadlineAt: s.joinDeadlineAt ?? null,
    meetingAddress: s.meetingAddress,
    meetingPlaceName: s.meetingPlaceName ?? null,
    destinationAddress: s.destinationAddress,
    destinationPlaceName: s.destinationPlaceName ?? null,
    fareType: 'PER_PERSON',
    fareAmount: s.fareAmount,
    maxPassengerCount: s.maxPassengerCount,
    maxLuggageCount: s.maxLuggageCount,
    description: s.description ?? null,
    status: s.status,
    ...capacity(s),
  }
}

function joinResponse(j) {
  const s = db.schedules.find((x) => x.scheduleId === j.scheduleId)
  const u = db.users.find((x) => x.userId === j.userId)
  return {
    joinId: j.joinId,
    scheduleId: j.scheduleId,
    user: { userId: u.userId, email: u.email, name: u.name },
    passengerCount: j.passengerCount,
    luggageCount: j.luggageCount,
    largeLuggageCount: j.largeLuggageCount ?? null,
    specialLuggageNote: j.specialLuggageNote ?? null,
    unitFare: s.fareAmount,
    totalFare: s.fareAmount * j.passengerCount,
    status: j.status,
    waitlistPosition: j.waitlistPosition ?? null,
    joinedAt: j.joinedAt,
    meetingAddress: s.meetingAddress,
    meetingPlaceName: s.meetingPlaceName ?? null,
    destinationAddress: s.destinationAddress,
    destinationPlaceName: s.destinationPlaceName ?? null,
    meetingAt: s.meetingAt,
  }
}

const pageOf = (content) => ({
  content,
  page: 0,
  size: content.length || 20,
  totalElements: content.length,
  totalPages: 1,
  first: true,
  last: true,
  empty: content.length === 0,
})

const send = (res, code, body) => {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': '*',
  })
  res.end(body === undefined ? '' : JSON.stringify(body))
}
const err = (res, code, message) => send(res, code, { status: code, message })

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const p = url.pathname
  const q = url.searchParams
  let body = {}
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const chunks = []
    for await (const c of req) chunks.push(c)
    const raw = Buffer.concat(chunks).toString()
    if (raw) try { body = JSON.parse(raw) } catch { return err(res, 400, 'Bad JSON') }
  }
  if (req.method === 'OPTIONS') return send(res, 200)

  // ---- users ----
  if (p === '/api/users' && req.method === 'GET') return send(res, 200, db.users)
  if (p === '/api/users' && req.method === 'POST') {
    if (!body.email || !body.name) return err(res, 400, 'email and name are required')
    if (db.users.some((u) => u.email === body.email)) return err(res, 409, 'Email already exists')
    const u = { userId: db.seq.user++, email: body.email, name: body.name, role: 'PASSENGER', createdAt: now(), updatedAt: now() }
    db.users.push(u)
    return send(res, 201, u)
  }

  // ---- drivers ----
  if (p === '/api/drivers' && req.method === 'GET') return send(res, 200, db.drivers)
  if (p === '/api/drivers' && req.method === 'POST') {
    const u = { userId: db.seq.user++, email: body.email, name: body.name, role: 'DRIVER', createdAt: now(), updatedAt: now() }
    db.users.push(u)
    const d = {
      driverId: db.seq.driver++, userId: u.userId, email: body.email, name: body.name,
      phone: body.phone, driverPhone: body.driverPhone, introduction: body.introduction ?? null,
      vehicleId: db.seq.vehicle++, vehicleType: body.vehicleType, manufacturer: body.manufacturer ?? null,
      modelName: body.modelName, licensePlate: body.licensePlate,
      passengerCapacity: body.passengerCapacity, trunkVolumeLiter: body.trunkVolumeLiter ?? null,
      maxLuggageCount: body.maxLuggageCount, largeLuggageCapacity: body.largeLuggageCapacity ?? null,
      vehicleImageUrl: body.vehicleImageUrl ?? null, active: true, createdAt: now(), updatedAt: now(),
    }
    db.drivers.push(d)
    return send(res, 201, d)
  }

  // ---- ride schedules ----
  if (p === '/api/rides/schedules' && req.method === 'POST') {
    const driverId = Number(q.get('driverId'))
    const d = db.drivers.find((x) => x.driverId === driverId)
    if (!d) return err(res, 400, 'Driver not found.')
    if (new Date(body.meetingAt) <= new Date()) return err(res, 400, 'The departure time must be in the future.')
    const s = {
      scheduleId: db.seq.schedule++, driverId, title: body.title,
      meetingAt: body.meetingAt, joinDeadlineAt: body.joinDeadlineAt,
      meetingAddress: body.meetingAddress, meetingPlaceName: body.meetingPlaceName,
      destinationAddress: body.destinationAddress, destinationPlaceName: body.destinationPlaceName,
      fareAmount: body.fareAmount, maxPassengerCount: d.passengerCapacity,
      maxLuggageCount: d.maxLuggageCount, description: body.description, status: 'OPEN',
    }
    db.schedules.push(s)
    return send(res, 201, scheduleResponse(s))
  }
  if (p === '/api/rides/schedules' && req.method === 'GET') {
    const dep = q.get('departure')?.toLowerCase()
    const dst = q.get('destination')?.toLowerCase()
    const date = q.get('date')
    const pc = q.get('passengerCount') ? Number(q.get('passengerCount')) : null
    let list = db.schedules.filter((s) => s.status === 'OPEN' && new Date(s.meetingAt) > new Date())
    if (dep) list = list.filter((s) => s.meetingAddress.toLowerCase().includes(dep) || (s.meetingPlaceName ?? '').toLowerCase().includes(dep))
    if (dst) list = list.filter((s) => s.destinationAddress.toLowerCase().includes(dst) || (s.destinationPlaceName ?? '').toLowerCase().includes(dst))
    if (date) list = list.filter((s) => s.meetingAt.startsWith(date))
    let out = list.map(scheduleResponse)
    if (pc) out = out.filter((s) => s.remainingPassengerCount >= pc)
    out.sort((a, b) => a.meetingAt.localeCompare(b.meetingAt))
    return send(res, 200, pageOf(out))
  }

  let m
  if ((m = p.match(/^\/api\/rides\/drivers\/(\d+)\/schedules$/)) && req.method === 'GET') {
    const list = db.schedules.filter((s) => s.driverId === Number(m[1])).map(scheduleResponse)
    return send(res, 200, pageOf(list))
  }
  if ((m = p.match(/^\/api\/rides\/schedules\/(\d+)$/)) && req.method === 'GET') {
    const s = db.schedules.find((x) => x.scheduleId === Number(m[1]))
    if (!s) return err(res, 400, 'Ride schedule not found.')
    return send(res, 200, scheduleResponse(s))
  }
  if ((m = p.match(/^\/api\/rides\/schedules\/(\d+)\/joins$/)) && req.method === 'POST') {
    const s = db.schedules.find((x) => x.scheduleId === Number(m[1]))
    const u = db.users.find((x) => x.userId === Number(q.get('userId')))
    if (!s) return err(res, 400, 'Ride schedule not found.')
    if (!u) return err(res, 400, 'User not found.')
    const cap = capacity(s)
    const fits = body.passengerCount <= cap.remainingPassengerCount
    const j = {
      joinId: db.seq.join++, scheduleId: s.scheduleId, userId: u.userId,
      passengerCount: body.passengerCount, luggageCount: body.luggageCount,
      largeLuggageCount: body.largeLuggageCount, specialLuggageNote: body.specialLuggageNote,
      status: fits ? 'PENDING' : 'WAITLISTED',
      waitlistPosition: fits ? null : capacity(s).waitlistedRequestCount + 1,
      joinedAt: now(),
    }
    db.joins.push(j)
    return send(res, 201, joinResponse(j))
  }
  if ((m = p.match(/^\/api\/rides\/schedules\/(\d+)\/joins$/)) && req.method === 'GET') {
    const list = db.joins.filter((j) => j.scheduleId === Number(m[1])).map(joinResponse)
    return send(res, 200, pageOf(list))
  }
  if ((m = p.match(/^\/api\/rides\/users\/(\d+)\/joins$/)) && req.method === 'GET') {
    const list = db.joins.filter((j) => j.userId === Number(m[1])).map(joinResponse)
    return send(res, 200, pageOf(list))
  }
  if ((m = p.match(/^\/api\/rides\/joins\/(\d+)\/(approve|reject|cancel)$/)) && req.method === 'PATCH') {
    const j = db.joins.find((x) => x.joinId === Number(m[1]))
    if (!j) return err(res, 400, 'Join not found.')
    const action = m[2]
    if (action === 'approve') {
      if (j.status !== 'PENDING') return err(res, 409, 'Only pending requests can be approved.')
      j.status = 'APPROVED'
    } else if (action === 'reject') {
      if (j.status !== 'PENDING' && j.status !== 'WAITLISTED') return err(res, 409, 'Only pending requests can be rejected.')
      j.status = 'REJECTED'
    } else {
      j.status = 'CANCELLED'
    }
    return send(res, 200, joinResponse(j))
  }

  return err(res, 404, `No route: ${req.method} ${p}`)
})

server.listen(8080, () => console.log('mock backend on :8080'))
