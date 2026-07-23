import CheckBadge from '../components/CheckBadge'
import { mapsUrlFor, telHref } from '../data'
import { fmtDateTime } from '../api'
import type { RideJoinResponse, RideScheduleResponse } from '../api'

/* P4 · Ticket — real booking request from the backend.
   Requests start as PENDING (or WAITLISTED) until the driver approves. */
export default function TicketScreen({
  schedule,
  join,
  onChat,
  onRestart,
}: {
  schedule: RideScheduleResponse
  join: RideJoinResponse
  onChat: () => void
  onRestart: () => void
}) {
  const driver = schedule.driver
  const vehicle = driver.vehicle

  const pending = join.status === 'PENDING'
  const waitlisted = join.status === 'WAITLISTED'

  const headline = pending
    ? 'Request sent!'
    : waitlisted
      ? 'Added to waitlist'
      : join.status === 'APPROVED'
        ? 'Seat confirmed!'
        : `Status: ${join.status}`

  const subline = pending
    ? 'The driver will confirm your places shortly.'
    : waitlisted
      ? `You are #${join.waitlistPosition ?? '–'} on the waitlist.`
      : 'Show this ticket at the stand.'

  return (
    <div className="screen">
      <div className="confirm-head">
        <CheckBadge />
        <h2>{headline}</h2>
        <p>{subline}</p>
      </div>

      <div className="card ticket">
        <div className="ticket-route">
          <strong>{join.meetingPlaceName ?? join.meetingAddress}</strong>
          <span>→</span>
          <strong>{join.destinationPlaceName ?? join.destinationAddress}</strong>
        </div>
        <p className="ticket-sub">
          {fmtDateTime(join.meetingAt)} · departs when full
        </p>
        <span className="badge-amber">
          {join.passengerCount} place{join.passengerCount > 1 ? 's' : ''} ·{' '}
          {join.totalFare} TJS · {join.status.toLowerCase()}
        </span>

        <div className="perforation" />

        <div className="ticket-section">
          <span className="field-label">Where</span>
          <strong>{join.meetingPlaceName ?? join.meetingAddress}</strong>
          <a
            href={mapsUrlFor(join.meetingAddress)}
            target="_blank"
            rel="noreferrer"
          >
            Open map ↗
          </a>
        </div>
        <div className="ticket-section">
          <span className="field-label">Who</span>
          <strong>
            {driver.name}
            {vehicle ? ` · ${vehicle.manufacturer ?? ''} ${vehicle.modelName}` : ''}
          </strong>
          {vehicle && <p>Plate {vehicle.licensePlate}</p>}
          <a href={telHref(driver.driverPhone)}>Call {driver.driverPhone} ✆</a>
        </div>
        <div className="ticket-section">
          <span className="field-label">Pay</span>
          <strong>{join.totalFare} TJS in cash to the driver</strong>
          <p>No online payment — you pay on the spot</p>
        </div>
      </div>

      <button className="text-link" onClick={onChat}>
        Message {driver.name.split(' ')[0]} — auto-translated
      </button>
      <p className="footer-note">
        {pending || waitlisted
          ? 'We’ll notify you when the driver approves.'
          : 'We’ll notify you when the car is full.'}
      </p>
      <button className="text-link muted" onClick={onRestart}>
        ‹ Back to search
      </button>
    </div>
  )
}
