import { useState } from 'react'
import './App.css'

type Role = 'passenger' | 'driver'
type SeatId = 'front' | 'm1' | 'b2'

const SEAT_INFO: Record<SeatId, { price: number; label: string }> = {
  front: { price: 400, label: 'Front seat' },
  m1: { price: 350, label: 'Middle seat' },
  b2: { price: 300, label: 'Back seat' },
}

const RIDES = [
  {
    id: 'bs',
    initials: 'BS',
    name: 'Bakhtiyor S.',
    rating: 4.8,
    rides: 56,
    from: 300,
    filled: 3,
    total: 6,
    car: 'Land Cruiser · Бадахшон (Badakhshan) stand',
    badge: 'Filling fast',
  },
  {
    id: 'fk',
    initials: 'FK',
    name: 'Firdavs K.',
    rating: 4.6,
    rides: 31,
    from: 280,
    filled: 2,
    total: 7,
    car: 'Starex minivan · Бадахшон (Badakhshan) stand',
    badge: null,
  },
  {
    id: 'kn',
    initials: 'KN',
    name: 'Karim N.',
    rating: 4.9,
    rides: 112,
    from: 300,
    filled: 1,
    total: 6,
    car: 'Land Cruiser · leaves tomorrow',
    badge: null,
  },
]

const CITY_TJ: Record<string, string> = {
  Dushanbe: 'Душанбе',
  Khorog: 'Хоруғ',
  Kulob: 'Кӯлоб',
  Khujand: 'Хуҷанд',
}

const cityLabel = (en: string) => `${CITY_TJ[en] ?? en} (${en})`

function Dots({ filled, total }: { filled: number; total: number }) {
  return (
    <span className="dots">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`dot${i < filled ? ' on' : ''}`} />
      ))}
    </span>
  )
}

function CheckBadge() {
  return (
    <div className="check-badge">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path
          d="M6 16 L13 24 L27 8"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

const DRIVER_PHONE = '+992 93 555 0117'

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
    </svg>
  )
}

type Msg = { id: number; mine: boolean; text: string; sub?: string }

function ChatScreen({
  title,
  subtitle,
  avatar,
  avatarAmber,
  phone,
  banner,
  initial,
  reply,
  placeholder,
  onBack,
}: {
  title: string
  subtitle: string
  avatar: string
  avatarAmber?: boolean
  phone?: string
  banner: string
  initial: Msg[]
  reply: Omit<Msg, 'id'>
  placeholder: string
  onBack: () => void
}) {
  const [msgs, setMsgs] = useState<Msg[]>(initial)
  const [draft, setDraft] = useState('')

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMsgs((m) => [...m, { id: Date.now(), mine: true, text }])
    setDraft('')
    setTimeout(
      () => setMsgs((m) => [...m, { ...reply, id: Date.now() + 1 }]),
      900,
    )
  }

  return (
    <div className="screen has-bottom-bar">
      <div className="top-bar left chat-top">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <span className={`avatar${avatarAmber ? ' amber' : ''}`}>{avatar}</span>
        <div className="chat-head">
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        {phone && (
          <a
            className="call-btn"
            href={`tel:${phone.replace(/\s/g, '')}`}
            aria-label="Call"
          >
            <PhoneIcon />
          </a>
        )}
      </div>

      <p className="translate-banner">{banner}</p>

      <div className="chat-list">
        {msgs.map((m) => (
          <div key={m.id} className={`bubble${m.mine ? ' mine' : ''}`}>
            <p>{m.text}</p>
            {m.sub && <span>{m.sub}</span>}
          </div>
        ))}
      </div>

      <div className="bottom-bar chat-input">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={placeholder}
        />
        <button className="send-btn" onClick={send} aria-label="Send">
          ➤
        </button>
      </div>
    </div>
  )
}

/* ============ PASSENGER FLOW (English UI) ============ */

function PassengerFlow({ onHome }: { onHome: () => void }) {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [fromCity, setFromCity] = useState('Dushanbe')
  const [toCity, setToCity] = useState('Khorog')
  const [filter, setFilter] = useState(0)
  const [seat, setSeat] = useState<SeatId>('front')

  const swap = () => {
    setFromCity(toCity)
    setToCity(fromCity)
  }

  /* ---- P1 · Search ---- */
  if (screen === 1) {
    return (
      <div className="screen">
        <div className="mountains" aria-hidden="true">
          <svg viewBox="0 0 390 90" preserveAspectRatio="none">
            <path d="M0 74 L60 16 L110 62 L170 0 L230 64 L290 20 L350 66 L390 36 L390 90 L0 90 Z" fill="#0E6E78" opacity="0.07" />
          </svg>
        </div>
        <button className="back-btn home" onClick={onHome} aria-label="Change role">
          ‹
        </button>
        <div className="logo-block">
          <h1 className="logo">
            hamsafar<span className="logo-dot" />
          </h1>
          <p className="tagline">ҳамсафар — your companion for the journey</p>
        </div>

        <div className="card search-card">
          <div className="field-row">
            <span className="pin pin-teal" />
            <div className="field">
              <span className="field-label">From</span>
              <span className="field-value">{cityLabel(fromCity)}</span>
            </div>
            <button className="swap-btn" onClick={swap} aria-label="Swap cities">
              ⇅
            </button>
          </div>
          <div className="divider" />
          <div className="field-row">
            <span className="pin pin-amber" />
            <div className="field">
              <span className="field-label">To</span>
              <span className="field-value">{cityLabel(toCity)}</span>
            </div>
          </div>
          <div className="divider" />
          <div className="field-split">
            <div className="field">
              <span className="field-label">Date</span>
              <span className="field-value sm">Wed, Jul 22</span>
            </div>
            <div className="vdivider" />
            <div className="field">
              <span className="field-label">Seats</span>
              <span className="field-value sm">1 passenger</span>
            </div>
          </div>
        </div>

        <button className="cta" onClick={() => setScreen(2)}>
          Find a seat
        </button>

        <div className="note-strip">
          <strong>Locals pay 350–400 somoni to Хоруғ (Khorog).</strong>
          <span>On Hamsafar, so do you. No haggling.</span>
        </div>

        <p className="section-label">Popular routes</p>
        <div className="chip-row wrap">
          {['Khorog', 'Kulob', 'Khujand'].map((city) => (
            <button
              key={city}
              className="chip"
              onClick={() => {
                setFromCity('Dushanbe')
                setToCity(city)
              }}
            >
              {cityLabel('Dushanbe')} → {cityLabel(city)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* ---- P2 · Results ---- */
  if (screen === 2) {
    return (
      <div className="screen">
        <div className="top-bar">
          <button className="back-btn" onClick={() => setScreen(1)} aria-label="Back">
            ‹
          </button>
          <div className="top-bar-title">
            <strong>
              {cityLabel(fromCity)} → {cityLabel(toCity)}
            </strong>
            <span>Wed, Jul 22 · 1 seat</span>
          </div>
        </div>

        <div className="chip-row">
          {['Soonest', 'Cheapest', 'Top rated'].map((label, i) => (
            <button
              key={label}
              className={`chip${filter === i ? ' active' : ''}`}
              onClick={() => setFilter(i)}
            >
              {label}
            </button>
          ))}
        </div>

        {RIDES.map((r) => (
          <button key={r.id} className="card ride-card" onClick={() => setScreen(3)}>
            <div className="ride-head">
              <span className="avatar">{r.initials}</span>
              <div className="ride-namebox">
                <strong>{r.name}</strong>
                <span>
                  ★ {r.rating} · {r.rides} rides
                </span>
              </div>
              <div className="ride-price">
                <strong>from {r.from}</strong>
                <span>TJS · per seat</span>
              </div>
            </div>
            <div className="ride-fill">
              <Dots filled={r.filled} total={r.total} />
              <span>
                {r.filled} of {r.total} filled
              </span>
            </div>
            <div className="divider" />
            <div className="ride-foot">
              <span>{r.car}</span>
              {r.badge && <span className="badge-amber">{r.badge}</span>}
            </div>
          </button>
        ))}

        <p className="footer-note">
          Cars leave when all seats fill.
          <br />
          Booking early helps everyone leave sooner.
        </p>
      </div>
    )
  }

  /* ---- P3 · Choose your seat ---- */
  if (screen === 3) {
    return (
      <div className="screen has-bottom-bar">
        <div className="top-bar">
          <button className="back-btn" onClick={() => setScreen(2)} aria-label="Back">
            ‹
          </button>
          <div className="top-bar-title">
            <strong>Choose your seat</strong>
          </div>
        </div>

        <div className="driver-row">
          <span className="avatar lg">BS</span>
          <div>
            <strong>Bakhtiyor S.</strong>
            <span>★ 4.8 · Toyota Land Cruiser · 5124 BS 01</span>
            <span className="phone-line">{DRIVER_PHONE}</span>
          </div>
          <a
            className="call-btn"
            href={`tel:${DRIVER_PHONE.replace(/\s/g, '')}`}
            aria-label="Call driver"
          >
            <PhoneIcon />
          </a>
        </div>

        <div className="card seat-card">
          <div className="car-body">
            <svg className="windshield" viewBox="0 0 140 20" aria-hidden="true">
              <path d="M0 18 Q70 0 140 18" fill="none" stroke="#DDE7E8" strokeWidth="3" />
            </svg>
            <div className="seat-row">
              <div className="seat driver-seat">
                <span className="wheel" />
                <span className="seat-caption">Driver</span>
              </div>
              <button
                className={`seat${seat === 'front' ? ' selected' : ''}`}
                onClick={() => setSeat('front')}
              >
                <strong>400</strong>
                <small>Front</small>
              </button>
            </div>
            <div className="seat-row three">
              <button
                className={`seat${seat === 'm1' ? ' selected' : ''}`}
                onClick={() => setSeat('m1')}
              >
                <strong>350</strong>
              </button>
              <div className="seat taken">AM</div>
              <div className="seat taken">ZR</div>
            </div>
            <div className="seat-row two">
              <div className="seat taken">JT</div>
              <button
                className={`seat${seat === 'b2' ? ' selected' : ''}`}
                onClick={() => setSeat('b2')}
              >
                <strong>300</strong>
              </button>
            </div>
          </div>
          <div className="legend">
            <span>
              <i className="lg-box available" /> Available
            </span>
            <span>
              <i className="lg-box selected" /> Selected
            </span>
            <span>
              <i className="lg-box taken" /> Taken
            </span>
          </div>
        </div>

        <div className="card meet-card">
          <div className="map-thumb" aria-hidden="true">
            <span className="map-pin" />
          </div>
          <div className="meet-info">
            <span className="field-label">Meeting point</span>
            <strong>Автостансияи Бадахшон (Badakhshan Avtostansiya)</strong>
            <a
              href="https://maps.google.com/?q=Badakhshan+bus+station+Dushanbe"
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>

        <div className="bottom-bar">
          <div className="bottom-price">
            <span>{SEAT_INFO[seat].label}</span>
            <strong>{SEAT_INFO[seat].price} TJS · cash</strong>
          </div>
          <button className="cta compact" onClick={() => setScreen(4)}>
            Request seat
          </button>
        </div>
      </div>
    )
  }

  /* ---- P5 · Chat with driver ---- */
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

  /* ---- P4 · Ticket ---- */
  return (
    <div className="screen">
      <div className="confirm-head">
        <CheckBadge />
        <h2>Seat confirmed!</h2>
        <p>Show this ticket at the stand.</p>
      </div>

      <div className="card ticket">
        <div className="ticket-route">
          <strong>{cityLabel(fromCity)}</strong>
          <span>→</span>
          <strong>{cityLabel(toCity)}</strong>
        </div>
        <p className="ticket-sub">Wed, Jul 22 · departs when full</p>
        <span className="badge-amber">
          {SEAT_INFO[seat].label} · {SEAT_INFO[seat].price} TJS
        </span>

        <div className="perforation" />

        <div className="ticket-section">
          <span className="field-label">Where</span>
          <strong>Автостансияи Бадахшон (Badakhshan Avtostansiya)</strong>
          <a
            href="https://maps.google.com/?q=Badakhshan+bus+station+Dushanbe"
            target="_blank"
            rel="noreferrer"
          >
            Open map ↗
          </a>
        </div>
        <div className="ticket-section">
          <span className="field-label">Who</span>
          <strong>Bakhtiyor S. · white Land Cruiser</strong>
          <p>Plate 5124 BS 01 · ★ 4.8</p>
          <a href={`tel:${DRIVER_PHONE.replace(/\s/g, '')}`}>
            Call {DRIVER_PHONE} ✆
          </a>
        </div>
        <div className="ticket-section">
          <span className="field-label">Pay</span>
          <strong>{SEAT_INFO[seat].price} TJS in cash to the driver</strong>
          <p>No online payment — you pay on the spot</p>
        </div>
      </div>

      <button className="cta">Save ticket · works offline</button>
      <button className="text-link" onClick={() => setScreen(5)}>
        Message Bakhtiyor — auto-translated
      </button>
      <p className="footer-note">We'll notify you when the car is full.</p>
      <button className="text-link muted" onClick={() => setScreen(1)}>
        ‹ Back to search
      </button>
    </div>
  )
}

/* ============ CALENDAR ============ */

const TJ_MONTHS = [
  'Январ',
  'Феврал',
  'Март',
  'Апрел',
  'Май',
  'Июн',
  'Июл',
  'Август',
  'Сентябр',
  'Октябр',
  'Ноябр',
  'Декабр',
]
const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const TJ_DOW = ['Дш', 'Сш', 'Чш', 'Пш', 'Ҷм', 'Шб', 'Яш']

function Calendar({
  selected,
  onSelect,
}: {
  selected: Date | null
  onSelect: (d: Date) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [view, setView] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isPast = (d: number) => new Date(year, month, d) < today
  const isSel = (d: number) =>
    !!selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d
  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth())

  return (
    <div className="card calendar">
      <div className="cal-head">
        <button
          disabled={!canGoPrev}
          onClick={() => setView(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <strong>
          {TJ_MONTHS[month]} ({EN_MONTHS[month]}) {year}
        </strong>
        <button
          onClick={() => setView(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="cal-grid">
        {TJ_DOW.map((d) => (
          <span key={d} className="cal-dow">
            {d}
          </span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={`e${i}`} />
          ) : (
            <button
              key={d}
              className={`cal-day${isSel(d) ? ' sel' : ''}${isToday(d) ? ' today' : ''}`}
              disabled={isPast(d)}
              onClick={() => onSelect(new Date(year, month, d))}
            >
              {d}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

/* ============ DRIVER FLOW (Tajik UI · EN captions) ============ */

function DriverFlow({ onHome }: { onHome: () => void }) {
  // 0 driver home · 1 add route · 2 my routes list · 3 request approval · 4 chat · 5 car full
  const [screen, setScreen] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [seats, setSeats] = useState(6)
  const [dateChip, setDateChip] = useState(0)
  const [requestGone, setRequestGone] = useState(false)
  const [approved, setApproved] = useState(false)
  const [ac, setAc] = useState(true)
  const [year, setYear] = useState(2018)
  const [bags, setBags] = useState(4)
  const [prices, setPrices] = useState({ front: 400, m1: 350, b2: 300 })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const dateLabel =
    dateChip === 0
      ? 'Имрӯз'
      : dateChip === 1
        ? 'Фардо'
        : selectedDate
          ? `${selectedDate.getDate()} ${TJ_MONTHS[selectedDate.getMonth()].toLowerCase()}`
          : 'Дигар рӯз'

  const bumpPrice = (k: keyof typeof prices, d: number) =>
    setPrices((p) => ({ ...p, [k]: Math.max(50, p[k] + d) }))

  // 1 front + 3 middle + 2 back seats
  const earnings = prices.front + 3 * prices.m1 + 2 * prices.b2

  const approve = () => {
    setApproved(true)
    setTimeout(() => setScreen(5), 700)
  }

  /* ---- D0 · Driver home ---- */
  if (screen === 0) {
    return (
      <div className="screen">
        <button className="back-btn home" onClick={onHome} aria-label="Change role">
          ‹
        </button>
        <div className="page-head">
          <h2>Ронанда</h2>
          <p>Driver · What would you like to do?</p>
        </div>

        <button className="card role-card" onClick={() => setScreen(1)}>
          <span className="role-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="role-text">
            <strong>Масири нав</strong>
            <span>Add a new route · эълони сафар</span>
          </span>
          <span className="role-arrow">›</span>
        </button>

        <button className="card role-card" onClick={() => setScreen(2)}>
          <span className="role-icon amber">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </span>
          <span className="role-text">
            <strong>Сафарҳои ман</strong>
            <span>My routes · booking status</span>
          </span>
          {!requestGone && !approved && (
            <span className="badge-amber">1 нав</span>
          )}
          <span className="role-arrow">›</span>
        </button>
      </div>
    )
  }

  /* ---- D1 · Масири нав ---- */
  if (screen === 1) {
    return (
      <div className="screen">
        <button className="back-btn home" onClick={() => setScreen(0)} aria-label="Back">
          ‹
        </button>
        <div className="page-head">
          <h2>Масири нав</h2>
          <p>Add a new route</p>
        </div>

        <div className="card search-card">
          <div className="field-row">
            <span className="pin pin-teal" />
            <div className="field">
              <span className="field-label">Аз · From</span>
              <span className="field-value">Душанбе (Dushanbe)</span>
            </div>
            <button className="swap-btn" aria-label="Swap">
              ⇅
            </button>
          </div>
          <div className="divider" />
          <div className="field-row">
            <span className="pin pin-amber" />
            <div className="field">
              <span className="field-label">Ба · To</span>
              <span className="field-value">Хоруғ (Khorog)</span>
            </div>
          </div>
        </div>

        <p className="section-label">Сана · Date</p>
        <div className="chip-row">
          {['Имрӯз', 'Фардо', dateChip === 2 ? dateLabel : 'Дигар рӯз'].map(
            (label, i) => (
              <button
                key={i}
                className={`chip${dateChip === i ? ' active' : ''}`}
                onClick={() => setDateChip(i)}
              >
                {label}
              </button>
            ),
          )}
        </div>

        {dateChip === 2 && (
          <Calendar selected={selectedDate} onSelect={setSelectedDate} />
        )}

        <div className="card stepper-card">
          <div className="stepper-labels">
            <strong>Ҷойҳо</strong>
            <span>Seats</span>
          </div>
          <div className="stepper">
            <button
              className="step-btn"
              onClick={() => setSeats((s) => Math.max(1, s - 1))}
              aria-label="Fewer seats"
            >
              −
            </button>
            <strong className="step-value">{seats}</strong>
            <button
              className="step-btn primary"
              onClick={() => setSeats((s) => Math.min(8, s + 1))}
              aria-label="More seats"
            >
              +
            </button>
          </div>
        </div>

        <p className="section-label">Мошин · Vehicle</p>
        <div className="card price-card">
          <div className="vehicle-row">
            <span className="v-label">
              <strong>Мошин</strong>
              <small>Car</small>
            </span>
            <strong className="v-value">Toyota Land Cruiser</strong>
          </div>
          <div className="divider" />
          <div className="vehicle-row">
            <span className="v-label">
              <strong>Кондитсионер</strong>
              <small>Air conditioning</small>
            </span>
            <button
              className={`switch${ac ? ' on' : ''}`}
              onClick={() => setAc((v) => !v)}
              role="switch"
              aria-checked={ac}
              aria-label="Air conditioning"
            >
              <i />
            </button>
          </div>
          <div className="divider" />
          <div className="vehicle-row">
            <span className="v-label">
              <strong>Соли мошин</strong>
              <small>Year</small>
            </span>
            <span className="mini-stepper">
              <button onClick={() => setYear((y) => Math.max(2000, y - 1))} aria-label="Older">
                −
              </button>
              <strong>{year}</strong>
              <button
                className="primary"
                onClick={() => setYear((y) => Math.min(2026, y + 1))}
                aria-label="Newer"
              >
                +
              </button>
            </span>
          </div>
          <div className="divider" />
          <div className="vehicle-row">
            <span className="v-label">
              <strong>Ҷойи бағоҷ</strong>
              <small>Luggage · bags</small>
            </span>
            <span className="mini-stepper">
              <button onClick={() => setBags((b) => Math.max(0, b - 1))} aria-label="Fewer bags">
                −
              </button>
              <strong>{bags}</strong>
              <button
                className="primary"
                onClick={() => setBags((b) => Math.min(10, b + 1))}
                aria-label="More bags"
              >
                +
              </button>
            </span>
          </div>
        </div>

        <p className="section-label">Нарх барои ҳар ҷой · Сомонӣ</p>
        <div className="card price-card">
          {(
            [
              { k: 'front', tj: 'Пеш', en: 'Front', box: 'selected' },
              { k: 'm1', tj: 'Миёна', en: 'Middle', box: 'available' },
              { k: 'b2', tj: 'Қафо', en: 'Back', box: 'available' },
            ] as const
          ).map((row, i) => (
            <div key={row.k}>
              {i > 0 && <div className="divider" />}
              <div className="price-row">
                <i className={`lg-box ${row.box}`} />
                <span>
                  {row.tj} · {row.en}
                </span>
                <span className="mini-stepper">
                  <button onClick={() => bumpPrice(row.k, -10)} aria-label="Lower price">
                    −
                  </button>
                  <strong>{prices[row.k]}</strong>
                  <button
                    className="primary"
                    onClick={() => bumpPrice(row.k, 10)}
                    aria-label="Raise price"
                  >
                    +
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="cta" onClick={() => setScreen(2)}>
          Эълон кардан
        </button>
        <p className="cta-caption">Publish route</p>

        <div className="note-strip center">
          <strong>Хизмат ройгон аст · Free for drivers</strong>
        </div>
      </div>
    )
  }

  /* ---- D2 · Сафарҳои ман (My routes · booking list) ---- */
  if (screen === 2) {
    return (
      <div className="screen">
        <div className="top-bar left">
          <button className="back-btn" onClick={() => setScreen(0)} aria-label="Back">
            ‹
          </button>
          <div className="page-head inline">
            <h2>Сафарҳои ман</h2>
            <p>My routes · booking status</p>
          </div>
        </div>

        <button
          className="card route-card"
          onClick={() => setScreen(approved ? 5 : 3)}
        >
          <div className="route-line">
            <strong>Душанбе (Dushanbe) → Хоруғ (Khorog)</strong>
            <span className="pill-teal">{approved ? '6/6' : '3/6'} пур</span>
          </div>
          <span className="route-sub">
            {dateLabel} · Toyota Land Cruiser · {year}
          </span>
          <Dots filled={approved ? 6 : 3} total={6} />
          {!requestGone && !approved && (
            <span className="badge-amber">1 дархости нав · 1 new request ›</span>
          )}
          {approved && (
            <span className="route-done">Мошин пур шуд ✓ · Car is full</span>
          )}
        </button>

        <div className="card route-card done">
          <div className="route-line">
            <strong>Душанбе (Dushanbe) → Кӯлоб (Kulob)</strong>
            <span className="pill-gray">Анҷом ёфт</span>
          </div>
          <span className="route-sub">15 июл · 7/7 пур · 2 450 сомонӣ</span>
        </div>

        <div className="card route-card done">
          <div className="route-line">
            <strong>Душанбе (Dushanbe) → Хоруғ (Khorog)</strong>
            <span className="pill-gray">Анҷом ёфт</span>
          </div>
          <span className="route-sub">11 июл · 6/6 пур · 2 050 сомонӣ</span>
        </div>

        <button className="add-route" onClick={() => setScreen(1)}>
          + Масири нав · Add route
        </button>
      </div>
    )
  }

  /* ---- D3 · Дархостҳо (request approval) ---- */
  if (screen === 3) {
    return (
      <div className="screen">
        <div className="top-bar left">
          <button className="back-btn" onClick={() => setScreen(2)} aria-label="Back">
            ‹
          </button>
          <div className="page-head inline">
            <h2>Дархостҳо</h2>
            <p>Requests · {requestGone || approved ? '0' : '1'} нав</p>
          </div>
        </div>

        <div className="card seat-card compact">
          <div className="seat-status-head">
            <strong>Душанбе (Dushanbe) → Хоруғ (Khorog) · {dateLabel}</strong>
            <span className="pill-teal">{approved ? '4' : '3'}/6 пур</span>
          </div>
          <div className="car-body sm">
            <svg className="windshield" viewBox="0 0 140 20" aria-hidden="true">
              <path d="M0 18 Q70 0 140 18" fill="none" stroke="#DDE7E8" strokeWidth="3" />
            </svg>
            <div className="seat-row">
              <div className="seat driver-seat">
                <span className="wheel" />
              </div>
              <div className={`seat${approved ? ' taken' : requestGone ? '' : ' pending'}`}>
                {approved ? (
                  'SM'
                ) : requestGone ? (
                  <strong>{prices.front}</strong>
                ) : (
                  <small>нав</small>
                )}
              </div>
            </div>
            <div className="seat-row three">
              <div className="seat taken">АМ</div>
              <div className="seat taken">ЗР</div>
              <div className="seat">
                <strong>{prices.m1}</strong>
              </div>
            </div>
            <div className="seat-row two">
              <div className="seat taken">ҶТ</div>
              <div className="seat">
                <strong>{prices.b2}</strong>
              </div>
            </div>
          </div>
        </div>

        {!requestGone && !approved && (
          <div className="card request-card">
            <div className="ride-head">
              <span className="avatar amber">SM</span>
              <div className="ride-namebox">
                <strong>Sofia M.</strong>
                <span>Сайёҳ · English</span>
              </div>
              <span className="time-ago">2 дақ пеш</span>
            </div>
            <span className="badge-amber">Ҷои пеш · {prices.front} сомонӣ</span>
            <p className="request-note">
              Паёмҳо ба тоҷикӣ тарҷума мешаванд · auto-translated
            </p>
            <button className="text-link chat-link" onClick={() => setScreen(4)}>
              Паём ба Sofia · Open chat ›
            </button>
            <div className="request-actions">
              <button className="btn-ghost" onClick={() => setRequestGone(true)}>
                Рад
              </button>
              <button className="cta compact" onClick={approve}>
                Тасдиқ ✓
              </button>
            </div>
          </div>
        )}

        {approved && (
          <p className="footer-note strong">Тасдиқ шуд ✓ · Sofia огоҳ мешавад…</p>
        )}

        <p className="footer-note">
          Агар тасдиқ кунед, сайёҳ огоҳ мешавад.
          <br />
          <span className="muted">If you approve, the tourist is notified.</span>
        </p>
      </div>
    )
  }

  /* ---- D4 · Chat with passenger ---- */
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

  /* ---- D5 · Мошин пур шуд ---- */
  return (
    <div className="screen">
      <div className="confirm-head">
        <CheckBadge />
        <h2>Мошин пур шуд!</h2>
        <p>Car is full — no more waiting at the stand</p>
      </div>

      <div className="card summary-card">
        <div className="summary-row">
          <span>Ҷойҳо · Seats</span>
          <strong>6 / 6</strong>
        </div>
        <div className="divider" />
        <div className="summary-row">
          <span>Даромад · Earnings</span>
          <strong className="teal">{earnings.toLocaleString('ru-RU')} сомонӣ</strong>
        </div>
        <div className="divider" />
        <div className="summary-row">
          <span>Сайёҳон · Passengers</span>
          <strong className="teal sm">Огоҳ шуданд ✓</strong>
        </div>
      </div>

      <p className="section-label">Ҳамсафарон · Fellow travelers</p>
      <div className="avatar-row">
        {['АМ', 'ЗР', 'ҶТ', 'SM', 'МЗ', 'ДК'].map((p) => (
          <span key={p} className={`avatar lg${p === 'SM' ? ' amber' : ''}`}>
            {p}
          </span>
        ))}
      </div>

      <button className="cta">Сафарро оғоз кунед</button>
      <p className="cta-caption">Start the trip</p>

      <div className="note-strip center">
        <strong>Пас аз сафар сайёҳон ба шумо баҳо медиҳанд ★</strong>
      </div>
      <button className="text-link muted" onClick={() => setScreen(2)}>
        ‹ Сафарҳои ман (My routes)
      </button>
    </div>
  )
}

/* ============ ROLE SELECT (landing) ============ */

function RoleSelect({ onPick }: { onPick: (r: Role) => void }) {
  return (
    <div className="screen">
      <div className="mountains" aria-hidden="true">
        <svg viewBox="0 0 390 90" preserveAspectRatio="none">
          <path d="M0 74 L60 16 L110 62 L170 0 L230 64 L290 20 L350 66 L390 36 L390 90 L0 90 Z" fill="#0E6E78" opacity="0.07" />
        </svg>
      </div>
      <div className="logo-block landing">
        <h1 className="logo">
          hamsafar<span className="logo-dot" />
        </h1>
        <p className="tagline">ҳамсафар — your companion for the journey</p>
      </div>

      <p className="section-label">Who are you? · Шумо кистед?</p>

      <button className="card role-card" onClick={() => onPick('passenger')}>
        <span className="role-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="7.5" r="4" />
            <path d="M4 20.5c0-4.2 3.6-6.5 8-6.5s8 2.3 8 6.5" />
          </svg>
        </span>
        <span className="role-text">
          <strong>Passenger</strong>
          <span>Сайёҳ · Book a seat, pay cash at the stand</span>
        </span>
        <span className="role-arrow">›</span>
      </button>

      <button className="card role-card" onClick={() => onPick('driver')}>
        <span className="role-icon amber">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 15v6M3.6 10.2L9.2 11.3M20.4 10.2L14.8 11.3" />
          </svg>
        </span>
        <span className="role-text">
          <strong>Ронанда · Driver</strong>
          <span>Эълони масир · Publish your route, fill your car</span>
        </span>
        <span className="role-arrow">›</span>
      </button>

      <p className="footer-note">
        No more waiting at the stand the day before.
        <br />
        <span className="muted">Дигар як рӯз пеш дар истгоҳ мунтазир нашавед.</span>
      </p>
    </div>
  )
}

/* ============ APP SHELL ============ */

function App() {
  const [role, setRole] = useState<Role | null>(null)

  return (
    <div className="app">
      {role === null ? (
        <RoleSelect onPick={setRole} />
      ) : role === 'passenger' ? (
        <PassengerFlow onHome={() => setRole(null)} />
      ) : (
        <DriverFlow onHome={() => setRole(null)} />
      )}
    </div>
  )
}

export default App
