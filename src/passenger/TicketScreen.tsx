import CheckBadge from '../components/CheckBadge'
import { SEAT_INFO, DRIVER_PHONE, MAPS_URL, cityLabel, telHref } from '../data'
import type { SeatId } from '../data'

/* P4 · Ticket — confirmation with where / who / pay info */
export default function TicketScreen({
  fromCity,
  toCity,
  seat,
  onChat,
  onRestart,
}: {
  fromCity: string
  toCity: string
  seat: SeatId
  onChat: () => void
  onRestart: () => void
}) {
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
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            Open map ↗
          </a>
        </div>
        <div className="ticket-section">
          <span className="field-label">Who</span>
          <strong>Bakhtiyor S. · white Land Cruiser</strong>
          <p>Plate 5124 BS 01 · ★ 4.8</p>
          <a href={telHref(DRIVER_PHONE)}>Call {DRIVER_PHONE} ✆</a>
        </div>
        <div className="ticket-section">
          <span className="field-label">Pay</span>
          <strong>{SEAT_INFO[seat].price} TJS in cash to the driver</strong>
          <p>No online payment — you pay on the spot</p>
        </div>
      </div>

      <button className="cta">Save ticket · works offline</button>
      <button className="text-link" onClick={onChat}>
        Message Bakhtiyor — auto-translated
      </button>
      <p className="footer-note">We'll notify you when the car is full.</p>
      <button className="text-link muted" onClick={onRestart}>
        ‹ Back to search
      </button>
    </div>
  )
}
