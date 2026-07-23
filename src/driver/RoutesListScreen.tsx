import Dots from '../components/Dots'
import { fmtDateTime } from '../api'
import type { RideScheduleResponse } from '../api'

const STATUS_TJ: Record<string, string> = {
  OPEN: 'Кушода',
  CLOSED: 'Пӯшида',
  DEPARTED: 'Рафт',
  COMPLETED: 'Анҷом ёфт',
  CANCELLED: 'Бекор шуд',
}

/* D2 · Сафарҳои ман — real schedules from the backend */
export default function RoutesListScreen({
  schedules,
  loading,
  onBack,
  onOpen,
  onAddRoute,
}: {
  schedules: RideScheduleResponse[]
  loading: boolean
  onBack: () => void
  onOpen: (s: RideScheduleResponse) => void
  onAddRoute: () => void
}) {
  return (
    <div className="screen">
      <div className="top-bar left">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <div className="page-head inline">
          <h2>Сафарҳои ман</h2>
          <p>My routes · booking status</p>
        </div>
      </div>

      {loading && <p className="footer-note">Бор мешавад… · Loading…</p>}

      {!loading && schedules.length === 0 && (
        <p className="footer-note">
          Ҳоло сафар нест.
          <br />
          <span className="muted">No routes yet — add your first one.</span>
        </p>
      )}

      {schedules.map((s) => {
        const filled = Number(s.approvedPassengerCount)
        const total = Number(s.maxPassengerCount)
        const pending = Number(s.pendingPassengerCount)
        const done = s.status !== 'OPEN'
        const full = s.remainingPassengerCount === 0

        return (
          <button
            key={s.scheduleId}
            className={`card route-card${done ? ' done' : ''}`}
            onClick={() => onOpen(s)}
          >
            <div className="route-line">
              <strong>{s.title ?? `${s.meetingAddress} → ${s.destinationAddress}`}</strong>
              {done ? (
                <span className="pill-gray">{STATUS_TJ[s.status] ?? s.status}</span>
              ) : (
                <span className="pill-teal">
                  {filled}/{total} пур
                </span>
              )}
            </div>
            <span className="route-sub">
              {fmtDateTime(s.meetingAt)} · {s.fareAmount} сомонӣ / ҷой
            </span>
            <Dots filled={filled} total={total} />
            {pending > 0 && (
              <span className="badge-amber">
                {pending} дархости нав · {pending} new request
                {pending > 1 ? 's' : ''} ›
              </span>
            )}
            {full && !done && (
              <span className="route-done">Мошин пур шуд ✓ · Car is full</span>
            )}
          </button>
        )
      })}

      <button className="add-route" onClick={onAddRoute}>
        + Масири нав · Add route
      </button>
    </div>
  )
}
