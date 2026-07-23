import Dots from '../components/Dots'
import { fmtDateTime, initialsOf } from '../api'
import type { RideJoinResponse, RideScheduleResponse } from '../api'

const timeAgo = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 1) return 'ҳозир'
  if (mins < 60) return `${mins} дақ пеш`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} соат пеш`
  return `${Math.round(hours / 24)} рӯз пеш`
}

/* D3 · Дархостҳо — real booking requests with approve / reject */
export default function RequestsScreen({
  schedule,
  joins,
  loading,
  busyJoinId,
  error,
  onBack,
  onApprove,
  onReject,
  onChat,
}: {
  schedule: RideScheduleResponse
  joins: RideJoinResponse[]
  loading: boolean
  busyJoinId: number | null
  error: string | null
  onBack: () => void
  onApprove: (joinId: number) => void
  onReject: (joinId: number) => void
  onChat: () => void
}) {
  const pending = joins.filter(
    (j) => j.status === 'PENDING' || j.status === 'WAITLISTED',
  )
  const approved = joins.filter((j) => j.status === 'APPROVED')
  const filled = Number(schedule.approvedPassengerCount)
  const total = Number(schedule.maxPassengerCount)

  return (
    <div className="screen">
      <div className="top-bar left">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <div className="page-head inline">
          <h2>Дархостҳо</h2>
          <p>Requests · {pending.length} нав</p>
        </div>
      </div>

      <div className="card seat-card compact">
        <div className="seat-status-head">
          <strong>
            {schedule.title ?? schedule.destinationAddress} ·{' '}
            {fmtDateTime(schedule.meetingAt)}
          </strong>
          <span className="pill-teal">
            {filled}/{total} пур
          </span>
        </div>
        <div className="ride-fill">
          <Dots filled={filled} total={total} />
          <span>
            {schedule.remainingPassengerCount} ҷои холӣ ·{' '}
            {schedule.remainingPassengerCount} free
          </span>
        </div>
      </div>

      {loading && <p className="footer-note">Бор мешавад… · Loading…</p>}

      {error && (
        <p className="footer-note strong">
          Хатогӣ: <span className="muted">{error}</span>
        </p>
      )}

      {!loading && pending.length === 0 && (
        <p className="footer-note">
          Дархости нав нест.
          <br />
          <span className="muted">No new requests right now.</span>
        </p>
      )}

      {pending.map((j) => (
        <div key={j.joinId} className="card request-card">
          <div className="ride-head">
            <span className="avatar amber">{initialsOf(j.user.name)}</span>
            <div className="ride-namebox">
              <strong>{j.user.name}</strong>
              <span>
                {j.passengerCount} ҷой · {j.luggageCount} бағоҷ
                {j.status === 'WAITLISTED'
                  ? ` · навбат №${j.waitlistPosition ?? '–'}`
                  : ''}
              </span>
            </div>
            <span className="time-ago">{timeAgo(j.joinedAt)}</span>
          </div>
          <span className="badge-amber">
            {j.passengerCount} × {j.unitFare} = {j.totalFare} сомонӣ
          </span>
          <p className="request-note">
            Паёмҳо ба тоҷикӣ тарҷума мешаванд · auto-translated
          </p>
          <button className="text-link chat-link" onClick={onChat}>
            Паём ба {j.user.name.split(' ')[0]} · Open chat ›
          </button>
          <div className="request-actions">
            <button
              className="btn-ghost"
              disabled={busyJoinId === j.joinId}
              onClick={() => onReject(j.joinId)}
            >
              Рад
            </button>
            <button
              className="cta compact"
              disabled={busyJoinId === j.joinId || j.status === 'WAITLISTED'}
              onClick={() => onApprove(j.joinId)}
            >
              {busyJoinId === j.joinId ? '…' : 'Тасдиқ ✓'}
            </button>
          </div>
        </div>
      ))}

      {approved.length > 0 && (
        <>
          <p className="section-label">Тасдиқшуда · Approved</p>
          {approved.map((j) => (
            <div key={j.joinId} className="card request-card">
              <div className="ride-head">
                <span className="avatar">{initialsOf(j.user.name)}</span>
                <div className="ride-namebox">
                  <strong>{j.user.name}</strong>
                  <span>
                    {j.passengerCount} ҷой · {j.totalFare} сомонӣ
                  </span>
                </div>
                <span className="time-ago">✓</span>
              </div>
            </div>
          ))}
        </>
      )}

      <p className="footer-note">
        Агар тасдиқ кунед, сайёҳ огоҳ мешавад.
        <br />
        <span className="muted">If you approve, the passenger is notified.</span>
      </p>
    </div>
  )
}
