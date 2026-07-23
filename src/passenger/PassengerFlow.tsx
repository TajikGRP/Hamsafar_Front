import { useState } from 'react'
import ChatScreen from '../components/ChatScreen'
import SearchScreen from './SearchScreen'
import ResultsScreen from './ResultsScreen'
import BookingScreen from './SeatSelectScreen'
import TicketScreen from './TicketScreen'
import {
  createJoin,
  ensureDemoPassenger,
  searchSchedules,
  toDateParam,
} from '../api'
import type { RideJoinResponse, RideScheduleResponse, UserResponse } from '../api'

export type DateFilter = 'any' | 'today' | 'tomorrow'

/* Passenger flow (English UI):
   P1 Search → P2 Results → P3 Booking → P4 Ticket → P5 Chat (mock) */
export default function PassengerFlow({ onHome }: { onHome: () => void }) {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [fromCity, setFromCity] = useState('Dushanbe')
  const [toCity, setToCity] = useState('Khorog')
  const [dateFilter, setDateFilter] = useState<DateFilter>('any')
  const [passengers, setPassengers] = useState(1)
  const [filter, setFilter] = useState(0)

  const [schedules, setSchedules] = useState<RideScheduleResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selected, setSelected] = useState<RideScheduleResponse | null>(null)
  const [user, setUser] = useState<UserResponse | null>(null)
  const [join, setJoin] = useState<RideJoinResponse | null>(null)
  const [requesting, setRequesting] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  const swap = () => {
    setFromCity(toCity)
    setToCity(fromCity)
  }

  const dateParam = () => {
    if (dateFilter === 'any') return undefined
    const d = new Date()
    if (dateFilter === 'tomorrow') d.setDate(d.getDate() + 1)
    return toDateParam(d)
  }

  const search = async () => {
    setScreen(2)
    setLoading(true)
    setError(null)
    try {
      const page = await searchSchedules({
        departure: fromCity,
        destination: toCity,
        date: dateParam(),
        passengerCount: passengers,
        size: 50,
      })
      setSchedules(page.content)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load rides.')
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  const requestSeat = async (count: number, luggage: number) => {
    if (!selected) return
    setRequesting(true)
    setRequestError(null)
    try {
      const u = user ?? (await ensureDemoPassenger())
      setUser(u)
      const j = await createJoin(selected.scheduleId, u.userId, {
        passengerCount: count,
        luggageCount: luggage,
      })
      setJoin(j)
      setScreen(4)
    } catch (e) {
      setRequestError(
        e instanceof Error ? e.message : 'Could not send the request.',
      )
    } finally {
      setRequesting(false)
    }
  }

  if (screen === 1) {
    return (
      <SearchScreen
        fromCity={fromCity}
        toCity={toCity}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
        passengers={passengers}
        onPassengers={setPassengers}
        onSwap={swap}
        onPickRoute={(from, to) => {
          setFromCity(from)
          setToCity(to)
        }}
        onFindSeat={search}
        onHome={onHome}
      />
    )
  }

  if (screen === 2) {
    return (
      <ResultsScreen
        fromCity={fromCity}
        toCity={toCity}
        dateFilter={dateFilter}
        passengers={passengers}
        schedules={schedules}
        loading={loading}
        error={error}
        filter={filter}
        onFilter={setFilter}
        onBack={() => setScreen(1)}
        onSelectRide={(s) => {
          setSelected(s)
          setRequestError(null)
          setScreen(3)
        }}
      />
    )
  }

  if (screen === 3 && selected) {
    return (
      <BookingScreen
        schedule={selected}
        maxPassengers={Math.max(1, selected.remainingPassengerCount)}
        requesting={requesting}
        error={requestError}
        onBack={() => setScreen(2)}
        onRequest={requestSeat}
      />
    )
  }

  if (screen === 5 && selected) {
    return (
      <ChatScreen
        title={selected.driver.name}
        subtitle="Driver · auto-translated (demo)"
        avatar={selected.driver.name
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase()}
        phone={selected.driver.driverPhone}
        banner="Messages are auto-translated · Паёмҳо тарҷума мешаванд"
        placeholder="Write in English…"
        initial={[
          {
            id: 1,
            mine: false,
            text: 'Салом! Пагоҳ соати 6 меравем.',
            sub: 'Hello! We leave tomorrow at 6 am.',
          },
          {
            id: 2,
            mine: true,
            text: 'Great — I sent a seat request. Where exactly is the stand?',
          },
          {
            id: 3,
            mine: false,
            text: 'Автостансияи Бадахшон, назди бозор.',
            sub: 'Badakhshan stand, next to the bazaar.',
          },
        ]}
        reply={{ mine: false, text: 'Хуб ✓', sub: 'Okay ✓' }}
        onBack={() => setScreen(4)}
      />
    )
  }

  if (join && selected) {
    return (
      <TicketScreen
        schedule={selected}
        join={join}
        onChat={() => setScreen(5)}
        onRestart={() => {
          setJoin(null)
          setSelected(null)
          setScreen(1)
        }}
      />
    )
  }

  // Fallback: nothing selected yet
  return (
    <SearchScreen
      fromCity={fromCity}
      toCity={toCity}
      dateFilter={dateFilter}
      onDateFilter={setDateFilter}
      passengers={passengers}
      onPassengers={setPassengers}
      onSwap={swap}
      onPickRoute={(from, to) => {
        setFromCity(from)
        setToCity(to)
      }}
      onFindSeat={search}
      onHome={onHome}
    />
  )
}
