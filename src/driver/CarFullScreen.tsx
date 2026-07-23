import CheckBadge from '../components/CheckBadge'
import { initialsOf } from '../api'
import type { RideJoinResponse, RideScheduleResponse } from '../api'

/* D5 · Мошин пур шуд — car full: real earnings & approved passengers */
export default function CarFullScreen({
  schedule,
  joins,
  onMyRoutes,
}: {
  schedule: RideScheduleResponse
  joins: RideJoinResponse[]
  onMyRoutes: () => void
}) {
  const approved = joins.filter((j) => j.status === 'APPROVED')
  const earnings = approved.reduce((sum, j) => sum + j.totalFare, 0)
  const filled = Number(schedule.approvedPassengerCount)
  const total = Number(schedule.maxPassengerCount)

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
          <strong>
            {filled} / {total}
          </strong>
        </div>
        <div className="divider" />
        <div className="summary-row">
          <span>Даромад · Earnings</span>
          <strong className="teal">
            {earnings.toLocaleString('ru-RU')} сомонӣ
          </strong>
        </div>
        <div className="divider" />
        <div className="summary-row">
          <span>Сайёҳон · Passengers</span>
          <strong className="teal sm">Огоҳ шуданд ✓</strong>
        </div>
      </div>

      {approved.length > 0 && (
        <>
          <p className="section-label">Ҳамсафарон · Fellow travelers</p>
          <div className="avatar-row">
            {approved.map((j) => (
              <span key={j.joinId} className="avatar lg amber">
                {initialsOf(j.user.name)}
              </span>
            ))}
          </div>
        </>
      )}

      <button className="cta">Сафарро оғоз кунед</button>
      <p className="cta-caption">Start the trip</p>

      <div className="note-strip center">
        <strong>Пас аз сафар сайёҳон ба шумо баҳо медиҳанд ★</strong>
      </div>
      <button className="text-link muted" onClick={onMyRoutes}>
        ‹ Сафарҳои ман (My routes)
      </button>
    </div>
  )
}
