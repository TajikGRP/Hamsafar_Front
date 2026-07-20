import Dots from '../components/Dots'
import { RIDES, cityLabel } from '../data'

/* P2 · Results — available cars with driver info, price & fill status */
export default function ResultsScreen({
  fromCity,
  toCity,
  filter,
  onFilter,
  onBack,
  onSelectRide,
}: {
  fromCity: string
  toCity: string
  filter: number
  onFilter: (i: number) => void
  onBack: () => void
  onSelectRide: (id: string) => void
}) {
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack} aria-label="Back">
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
            onClick={() => onFilter(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {RIDES.map((r) => (
        <button
          key={r.id}
          className="card ride-card"
          onClick={() => onSelectRide(r.id)}
        >
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
