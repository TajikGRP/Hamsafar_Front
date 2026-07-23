import { useState } from 'react'
import Calendar from '../components/Calendar'
import { TJ_MONTHS, cityLabel } from '../data'
import type { DriverResponse } from '../api'

/* D1 · Масири нав — create a real ride schedule:
   route, date (chips + calendar), departure hour, single per-seat price.
   Seat capacity comes from the driver's registered vehicle. */
export default function AddRouteScreen({
  driver,
  publishing,
  error,
  onBack,
  onPublish,
}: {
  driver: DriverResponse | null
  publishing: boolean
  error: string | null
  onBack: () => void
  onPublish: (opts: {
    fromCity: string
    toCity: string
    date: Date
    hour: number
    price: number
    description: string
  }) => void
}) {
  const [fromCity, setFromCity] = useState('Dushanbe')
  const [toCity, setToCity] = useState('Khorog')
  const [dateChip, setDateChip] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hour, setHour] = useState(6)
  const [price, setPrice] = useState(350)
  const [ac, setAc] = useState(true)

  const swap = () => {
    setFromCity(toCity)
    setToCity(fromCity)
  }

  const chosenDate = (): Date => {
    const d = new Date()
    if (dateChip === 1) d.setDate(d.getDate() + 1)
    if (dateChip === 2 && selectedDate) return new Date(selectedDate)
    return d
  }

  const dateLabel =
    dateChip === 0
      ? 'Имрӯз'
      : dateChip === 1
        ? 'Фардо'
        : selectedDate
          ? `${selectedDate.getDate()} ${TJ_MONTHS[selectedDate.getMonth()].toLowerCase()}`
          : 'Дигар рӯз'

  const publish = () =>
    onPublish({
      fromCity,
      toCity,
      date: chosenDate(),
      hour,
      price,
      description: `${ac ? 'A/C' : 'No A/C'} · departure ${String(hour).padStart(2, '0')}:00`,
    })

  return (
    <div className="screen">
      <button className="back-btn home" onClick={onBack} aria-label="Back">
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
            <span className="field-value">{cityLabel(fromCity)}</span>
          </div>
          <button className="swap-btn" onClick={swap} aria-label="Swap">
            ⇅
          </button>
        </div>
        <div className="divider" />
        <div className="field-row">
          <span className="pin pin-amber" />
          <div className="field">
            <span className="field-label">Ба · To</span>
            <span className="field-value">{cityLabel(toCity)}</span>
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
          <strong>Соати сафар</strong>
          <span>Departure hour</span>
        </div>
        <div className="stepper">
          <button
            className="step-btn"
            onClick={() => setHour((h) => Math.max(0, h - 1))}
            aria-label="Earlier"
          >
            −
          </button>
          <strong className="step-value">
            {String(hour).padStart(2, '0')}:00
          </strong>
          <button
            className="step-btn primary"
            onClick={() => setHour((h) => Math.min(23, h + 1))}
            aria-label="Later"
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
          <strong className="v-value">
            {driver
              ? `${driver.manufacturer ?? ''} ${driver.modelName}`.trim()
              : 'Loading…'}
          </strong>
        </div>
        <div className="divider" />
        <div className="vehicle-row">
          <span className="v-label">
            <strong>Ҷойҳо</strong>
            <small>Seats (from vehicle)</small>
          </span>
          <strong className="v-value">
            {driver ? driver.passengerCapacity : '–'}
          </strong>
        </div>
        <div className="divider" />
        <div className="vehicle-row">
          <span className="v-label">
            <strong>Ҷойи бағоҷ</strong>
            <small>Luggage · bags</small>
          </span>
          <strong className="v-value">
            {driver ? driver.maxLuggageCount : '–'}
          </strong>
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
      </div>

      <p className="section-label">Нарх барои ҳар ҷой · Сомонӣ</p>
      <div className="card price-card">
        <div className="price-row">
          <span>Нарх · Price per seat</span>
          <span className="mini-stepper">
            <button onClick={() => setPrice((p) => Math.max(50, p - 10))} aria-label="Lower price">
              −
            </button>
            <strong>{price}</strong>
            <button
              className="primary"
              onClick={() => setPrice((p) => p + 10)}
              aria-label="Raise price"
            >
              +
            </button>
          </span>
        </div>
      </div>

      {error && (
        <p className="footer-note strong">
          Хатогӣ: <span className="muted">{error}</span>
        </p>
      )}

      <button className="cta" onClick={publish} disabled={publishing || !driver}>
        {publishing ? 'Интизор…' : 'Эълон кардан'}
      </button>
      <p className="cta-caption">Publish route</p>

      <div className="note-strip center">
        <strong>Хизмат ройгон аст · Free for drivers</strong>
      </div>
    </div>
  )
}
