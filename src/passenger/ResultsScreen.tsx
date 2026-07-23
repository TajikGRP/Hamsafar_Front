import Dots from '../components/Dots'
import { cityLabel } from '../data'
import { fmtDateTime, initialsOf } from '../api'
import type { RideScheduleResponse } from '../api'
import type { DateFilter } from './PassengerFlow'

/* P2 · Results — live schedules from the backend */
export default function ResultsScreen({
  fromCity,
  toCity,
  dateFilter,
  passengers,
  schedules,
  loading,
  error,
  filter,
  onFilter,
  onBack,
  onSelectRide,
}: {
  fromCity: string
  toCity: string
  dateFilter: DateFilter
  passengers: number
  schedules: RideScheduleResponse[]
  loading: boolean
  error: string | null
  filter: number
  onFilter: (i: number) => void
  onBack: () => void
  onSelectRide: (s: RideScheduleResponse) => void
}) {
  const sorted = [...schedules].sort((a, b) => {
    if (filter === 1) return a.fareAmount - b.fareAmount
    if (filter === 2) return b.remainingPassengerCount - a.remainingPassengerCount
    return a.meetingAt.localeCompare(b.meetingAt)
  })

  const dateLabel =
    dateFilter === 'any' ? 'Any date' : dateFilter === 'today' ? 'Today' : 'Tomorrow'

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
          <span>
            {dateLabel} · {passengers} seat{passengers > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="chip-row">
        {['Soonest', 'Cheapest', 'Most seats'].map((label, i) => (
          <button
            key={label}
            className={`chip${filter === i ? ' active' : ''}`}
            onClick={() => onFilter(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="footer-note">Loading rides…</p>}

      {error && (
        <p className="footer-note strong">
          Could not reach the server.
          <br />
          <span className="muted">{error}</span>
        </p>
      )}

      {!loading && !error && sorted.length === 0 && (
        <p className="footer-note">
          No rides found for this route yet.
          <br />
          Try “Any date” or check back later.
        </p>
      )}

      {sorted.map((s) => {
        const filled = s.approvedPassengerCount
        const total = s.maxPassengerCount
        const fillingFast = s.remainingPassengerCount <= 2
        return (
          <button
            key={s.scheduleId}
            className="card ride-card"
            onClick={() => onSelectRide(s)}
          >
            <div className="ride-head">
              <span className="avatar">{initialsOf(s.driver.name)}</span>
              <div className="ride-namebox">
                <strong>{s.driver.name}</strong>
                <span>{fmtDateTime(s.meetingAt)}</span>
              </div>
              <div className="ride-price">
                <strong>{s.fareAmount}</strong>
                <span>TJS · per seat</span>
              </div>
            </div>
            <div className="ride-fill">
              <Dots filled={Number(filled)} total={Number(total)} />
              <span>
                {filled} of {total} filled
              </span>
            </div>
            <div className="divider" />
            <div className="ride-foot">
              <span>
                {s.driver.vehicle
                  ? `${s.driver.vehicle.manufacturer ?? ''} ${s.driver.vehicle.modelName}`.trim()
                  : 'Car'}
                {s.meetingPlaceName ? ` · ${s.meetingPlaceName}` : ''}
              </span>
              {fillingFast && <span className="badge-amber">Filling fast</span>}
            </div>
          </button>
        )
      })}

      <p className="footer-note">
        Cars leave when all seats fill.
        <br />
        Booking early helps everyone leave sooner.
      </p>
    </div>
  )
}
