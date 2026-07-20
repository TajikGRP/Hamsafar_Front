import { useState } from 'react'
import ChatScreen from '../components/ChatScreen'
import DriverHome from './DriverHome'
import AddRouteScreen from './AddRouteScreen'
import RoutesListScreen from './RoutesListScreen'
import RequestsScreen from './RequestsScreen'
import CarFullScreen from './CarFullScreen'
import { TJ_MONTHS } from '../data'
import type { SeatPrices } from '../data'

/* Driver flow (Tajik UI · EN captions):
   D0 Home → D1 Add route / D2 My routes → D3 Requests → D4 Chat → D5 Car full */
export default function DriverFlow({ onHome }: { onHome: () => void }) {
  const [screen, setScreen] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [seats, setSeats] = useState(6)
  const [dateChip, setDateChip] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [requestGone, setRequestGone] = useState(false)
  const [approved, setApproved] = useState(false)
  const [ac, setAc] = useState(true)
  const [year, setYear] = useState(2018)
  const [bags, setBags] = useState(4)
  const [prices, setPrices] = useState<SeatPrices>({
    front: 400,
    m1: 350,
    b2: 300,
  })

  const dateLabel =
    dateChip === 0
      ? 'Имрӯз'
      : dateChip === 1
        ? 'Фардо'
        : selectedDate
          ? `${selectedDate.getDate()} ${TJ_MONTHS[selectedDate.getMonth()].toLowerCase()}`
          : 'Дигар рӯз'

  const bumpPrice = (k: keyof SeatPrices, d: number) =>
    setPrices((p) => ({ ...p, [k]: Math.max(50, p[k] + d) }))

  // 1 front + 3 middle + 2 back seats
  const earnings = prices.front + 3 * prices.m1 + 2 * prices.b2

  const hasNewRequest = !requestGone && !approved

  const approve = () => {
    setApproved(true)
    setTimeout(() => setScreen(5), 700)
  }

  if (screen === 0) {
    return (
      <DriverHome
        hasNewRequest={hasNewRequest}
        onAddRoute={() => setScreen(1)}
        onMyRoutes={() => setScreen(2)}
        onHome={onHome}
      />
    )
  }

  if (screen === 1) {
    return (
      <AddRouteScreen
        dateChip={dateChip}
        setDateChip={setDateChip}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dateLabel={dateLabel}
        seats={seats}
        setSeats={setSeats}
        ac={ac}
        setAc={setAc}
        year={year}
        setYear={setYear}
        bags={bags}
        setBags={setBags}
        prices={prices}
        bumpPrice={bumpPrice}
        onBack={() => setScreen(0)}
        onPublish={() => setScreen(2)}
      />
    )
  }

  if (screen === 2) {
    return (
      <RoutesListScreen
        approved={approved}
        hasNewRequest={hasNewRequest}
        dateLabel={dateLabel}
        year={year}
        onBack={() => setScreen(0)}
        onOpenActive={() => setScreen(approved ? 5 : 3)}
        onAddRoute={() => setScreen(1)}
      />
    )
  }

  if (screen === 3) {
    return (
      <RequestsScreen
        approved={approved}
        requestGone={requestGone}
        prices={prices}
        dateLabel={dateLabel}
        onBack={() => setScreen(2)}
        onDecline={() => setRequestGone(true)}
        onApprove={approve}
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
            text: 'Hi! Is the front seat still free?',
            sub: 'Салом! Ҷои пеш холӣ аст?',
          },
          {
            id: 2,
            mine: true,
            text: 'Ҳа, холӣ аст. 400 сомонӣ.',
            sub: 'Yes, it is free. 400 somoni.',
          },
          {
            id: 3,
            mine: false,
            text: 'Great, I will request it now.',
            sub: 'Хуб, ҳозир дархост мекунам.',
          },
        ]}
        reply={{ mine: false, text: 'Perfect, thank you!', sub: 'Олӣ, раҳмат!' }}
        onBack={() => setScreen(3)}
      />
    )
  }

  return <CarFullScreen earnings={earnings} onMyRoutes={() => setScreen(2)} />
}
