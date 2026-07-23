import Mountains from '../components/Mountains'
import { cityLabel } from '../data'
import type { DateFilter } from './PassengerFlow'

/* P1 · Search — route, date filter, passenger count */
export default function SearchScreen({
  fromCity,
  toCity,
  dateFilter,
  onDateFilter,
  passengers,
  onPassengers,
  onSwap,
  onPickRoute,
  onFindSeat,
  onHome,
}: {
  fromCity: string
  toCity: string
  dateFilter: DateFilter
  onDateFilter: (f: DateFilter) => void
  passengers: number
  onPassengers: (n: number) => void
  onSwap: () => void
  onPickRoute: (from: string, to: string) => void
  onFindSeat: () => void
  onHome: () => void
}) {
  const dateOptions: { key: DateFilter; label: string }[] = [
    { key: 'any', label: 'Any date' },
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
  ]

  return (
    <div className="screen">
      <Mountains />
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
          <button className="swap-btn" onClick={onSwap} aria-label="Swap cities">
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
            <span className="field-label">Seats</span>
            <span className="mini-stepper">
              <button
                onClick={() => onPassengers(Math.max(1, passengers - 1))}
                aria-label="Fewer passengers"
              >
                −
              </button>
              <strong>{passengers}</strong>
              <button
                className="primary"
                onClick={() => onPassengers(Math.min(6, passengers + 1))}
                aria-label="More passengers"
              >
                +
              </button>
            </span>
          </div>
        </div>
      </div>

      <p className="section-label">Date</p>
      <div className="chip-row">
        {dateOptions.map((o) => (
          <button
            key={o.key}
            className={`chip${dateFilter === o.key ? ' active' : ''}`}
            onClick={() => onDateFilter(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <button className="cta" onClick={onFindSeat}>
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
            onClick={() => onPickRoute('Dushanbe', city)}
          >
            {cityLabel('Dushanbe')} → {cityLabel(city)}
          </button>
        ))}
      </div>
    </div>
  )
}
