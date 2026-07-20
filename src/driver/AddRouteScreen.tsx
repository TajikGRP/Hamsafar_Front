import type { Dispatch, SetStateAction } from 'react'
import Calendar from '../components/Calendar'
import type { SeatPrices } from '../data'

/* D1 · Масири нав — create a route: date (chips + calendar),
   seats, vehicle info (A/C, year, luggage) and per-seat prices */
export default function AddRouteScreen({
  dateChip,
  setDateChip,
  selectedDate,
  setSelectedDate,
  dateLabel,
  seats,
  setSeats,
  ac,
  setAc,
  year,
  setYear,
  bags,
  setBags,
  prices,
  bumpPrice,
  onBack,
  onPublish,
}: {
  dateChip: number
  setDateChip: (i: number) => void
  selectedDate: Date | null
  setSelectedDate: (d: Date) => void
  dateLabel: string
  seats: number
  setSeats: Dispatch<SetStateAction<number>>
  ac: boolean
  setAc: Dispatch<SetStateAction<boolean>>
  year: number
  setYear: Dispatch<SetStateAction<number>>
  bags: number
  setBags: Dispatch<SetStateAction<number>>
  prices: SeatPrices
  bumpPrice: (k: keyof SeatPrices, d: number) => void
  onBack: () => void
  onPublish: () => void
}) {
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

      <button className="cta" onClick={onPublish}>
        Эълон кардан
      </button>
      <p className="cta-caption">Publish route</p>

      <div className="note-strip center">
        <strong>Хизмат ройгон аст · Free for drivers</strong>
      </div>
    </div>
  )
}
