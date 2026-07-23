import { useCallback, useEffect, useState } from 'react'
import ChatScreen from '../components/ChatScreen'
import DriverHome from './DriverHome'
import AddRouteScreen from './AddRouteScreen'
import RoutesListScreen from './RoutesListScreen'
import RequestsScreen from './RequestsScreen'
import CarFullScreen from './CarFullScreen'
import { standFor } from '../data'
import {
  approveJoin,
  createSchedule,
  ensureDemoDriver,
  getDriverSchedules,
  getSchedule,
  getScheduleJoins,
  rejectJoin,
  toLocalDateTimeParam,
} from '../api'
import type {
  DriverResponse,
  RideJoinResponse,
  RideScheduleResponse,
} from '../api'

/* Driver flow (Tajik UI · EN captions):
   D0 Home → D1 Add route / D2 My routes → D3 Requests → D4 Chat (mock) → D5 Car full */
export default function DriverFlow({ onHome }: { onHome: () => void }) {
  const [screen, setScreen] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

  const [driver, setDriver] = useState<DriverResponse | null>(null)
  const [driverError, setDriverError] = useState<string | null>(null)

  const [schedules, setSchedules] = useState<RideScheduleResponse[]>([])
  const [schedulesLoading, setSchedulesLoading] = useState(false)

  const [selected, setSelected] = useState<RideScheduleResponse | null>(null)
  const [joins, setJoins] = useState<RideJoinResponse[]>([])
  const [joinsLoading, setJoinsLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busyJoinId, setBusyJoinId] = useState<number | null>(null)

  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)

  const loadSchedules = useCallback(async (driverId: number) => {
    setSchedulesLoading(true)
    try {
      const page = await getDriverSchedules(driverId)
      setSchedules(page.content)
    } catch {
      /* list stays as-is */
    } finally {
      setSchedulesLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await ensureDemoDriver()
        if (cancelled) return
        setDriver(d)
        await loadSchedules(d.driverId)
      } catch (e) {
        if (!cancelled) {
          setDriverError(
            e instanceof Error ? e.message : 'Could not reach the server.',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadSchedules])

  const pendingCount = schedules.reduce(
    (sum, s) => sum + Number(s.pendingPassengerCount),
    0,
  )

  const publish = async (opts: {
    fromCity: string
    toCity: string
    date: Date
    hour: number
    price: number
    description: string
  }) => {
    if (!driver) return
    setPublishing(true)
    setPublishError(null)
    try {
      const meeting = new Date(opts.date)
      meeting.setHours(opts.hour, 0, 0, 0)
      const from = standFor(opts.fromCity)
      const to = standFor(opts.toCity)
      await createSchedule(driver.driverId, {
        title: `${opts.fromCity} → ${opts.toCity}`,
        meetingAt: toLocalDateTimeParam(meeting),
        meetingAddress: from.address,
        meetingPlaceName: from.placeName,
        destinationAddress: opts.toCity,
        destinationPlaceName: to.placeName,
        fareAmount: opts.price,
        description: opts.description,
      })
      await loadSchedules(driver.driverId)
      setScreen(2)
    } catch (e) {
      setPublishError(
        e instanceof Error ? e.message : 'Could not publish the route.',
      )
    } finally {
      setPublishing(false)
    }
  }

  const openSchedule = async (s: RideScheduleResponse) => {
    if (!driver) return
    setSelected(s)
    setActionError(null)
    setScreen(Number(s.remainingPassengerCount) === 0 ? 5 : 3)
    setJoinsLoading(true)
    try {
      const page = await getScheduleJoins(s.scheduleId, driver.driverId)
      setJoins(page.content)
    } catch {
      setJoins([])
    } finally {
      setJoinsLoading(false)
    }
  }

  const refreshSelected = async (scheduleId: number) => {
    if (!driver) return null
    const [fresh, page] = await Promise.all([
      getSchedule(scheduleId),
      getScheduleJoins(scheduleId, driver.driverId),
    ])
    setSelected(fresh)
    setJoins(page.content)
    setSchedules((list) =>
      list.map((s) => (s.scheduleId === fresh.scheduleId ? fresh : s)),
    )
    return fresh
  }

  const decide = async (joinId: number, action: 'approve' | 'reject') => {
    if (!driver || !selected) return
    setBusyJoinId(joinId)
    setActionError(null)
    try {
      if (action === 'approve') await approveJoin(joinId, driver.driverId)
      else await rejectJoin(joinId, driver.driverId)
      const fresh = await refreshSelected(selected.scheduleId)
      if (fresh && Number(fresh.remainingPassengerCount) === 0) {
        setTimeout(() => setScreen(5), 700)
      }
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : 'Could not update the request.',
      )
    } finally {
      setBusyJoinId(null)
    }
  }

  if (screen === 0) {
    return (
      <DriverHome
        pendingCount={pendingCount}
        error={driverError}
        onAddRoute={() => setScreen(1)}
        onMyRoutes={() => setScreen(2)}
        onHome={onHome}
      />
    )
  }

  if (screen === 1) {
    return (
      <AddRouteScreen
        driver={driver}
        publishing={publishing}
        error={publishError}
        onBack={() => setScreen(0)}
        onPublish={publish}
      />
    )
  }

  if (screen === 2) {
    return (
      <RoutesListScreen
        schedules={schedules}
        loading={schedulesLoading}
        onBack={() => setScreen(0)}
        onOpen={openSchedule}
        onAddRoute={() => setScreen(1)}
      />
    )
  }

  if (screen === 3 && selected) {
    return (
      <RequestsScreen
        schedule={selected}
        joins={joins}
        loading={joinsLoading}
        busyJoinId={busyJoinId}
        error={actionError}
        onBack={() => setScreen(2)}
        onApprove={(id) => decide(id, 'approve')}
        onReject={(id) => decide(id, 'reject')}
        onChat={() => setScreen(4)}
      />
    )
  }

  if (screen === 4) {
    return (
      <ChatScreen
        title="Sofia M."
        subtitle="Сайёҳ · English"
        avatar="SM"
        avatarAmber
        banner="Паёмҳо тарҷума мешаванд · Messages are auto-translated"
        placeholder="Ба тоҷикӣ нависед…"
        initial={[
          {
            id: 1,
            mine: false,
            text: 'Hi! Are there still free places?',
            sub: 'Салом! Ҷойҳои холӣ ҳастанд?',
          },
          {
            id: 2,
            mine: true,
            text: 'Ҳа, холӣ аст.',
            sub: 'Yes, there are free places.',
          },
          {
            id: 3,
            mine: false,
            text: 'Great, I will request now.',
            sub: 'Хуб, ҳозир дархост мекунам.',
          },
        ]}
        reply={{ mine: false, text: 'Perfect, thank you!', sub: 'Олӣ, раҳмат!' }}
        onBack={() => setScreen(3)}
      />
    )
  }

  if (screen === 5 && selected) {
    return (
      <CarFullScreen
        schedule={selected}
        joins={joins}
        onMyRoutes={() => setScreen(2)}
      />
    )
  }

  return (
    <DriverHome
      pendingCount={pendingCount}
      error={driverError}
      onAddRoute={() => setScreen(1)}
      onMyRoutes={() => setScreen(2)}
      onHome={onHome}
    />
  )
}
