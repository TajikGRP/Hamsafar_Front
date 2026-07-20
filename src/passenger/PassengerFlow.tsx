import { useState } from 'react'
import ChatScreen from '../components/ChatScreen'
import SearchScreen from './SearchScreen'
import ResultsScreen from './ResultsScreen'
import SeatSelectScreen from './SeatSelectScreen'
import TicketScreen from './TicketScreen'
import { DRIVER_PHONE } from '../data'
import type { SeatId } from '../data'

/* Passenger flow (English UI):
   P1 Search → P2 Results → P3 Seat select → P4 Ticket → P5 Chat */
export default function PassengerFlow({ onHome }: { onHome: () => void }) {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [fromCity, setFromCity] = useState('Dushanbe')
  const [toCity, setToCity] = useState('Khorog')
  const [filter, setFilter] = useState(0)
  const [seat, setSeat] = useState<SeatId>('front')

  const swap = () => {
    setFromCity(toCity)
    setToCity(fromCity)
  }

  if (screen === 1) {
    return (
      <SearchScreen
        fromCity={fromCity}
        toCity={toCity}
        onSwap={swap}
        onPickRoute={(from, to) => {
          setFromCity(from)
          setToCity(to)
        }}
        onFindSeat={() => setScreen(2)}
        onHome={onHome}
      />
    )
  }

  if (screen === 2) {
    return (
      <ResultsScreen
        fromCity={fromCity}
        toCity={toCity}
        filter={filter}
        onFilter={setFilter}
        onBack={() => setScreen(1)}
        onSelectRide={() => setScreen(3)}
      />
    )
  }

  if (screen === 3) {
    return (
      <SeatSelectScreen
        seat={seat}
        onSeat={setSeat}
        onBack={() => setScreen(2)}
        onRequest={() => setScreen(4)}
      />
    )
  }

  if (screen === 5) {
    return (
      <ChatScreen
        title="Bakhtiyor S."
        subtitle="★ 4.8 · usually replies in ~5 min"
        avatar="BS"
        phone={DRIVER_PHONE}
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
            text: 'Great — I booked the front seat. Where exactly is the stand?',
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

  return (
    <TicketScreen
      fromCity={fromCity}
      toCity={toCity}
      seat={seat}
      onChat={() => setScreen(5)}
      onRestart={() => setScreen(1)}
    />
  )
}
