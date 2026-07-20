import CheckBadge from '../components/CheckBadge'

/* D5 · Мошин пур шуд — car full: earnings summary & fellow travelers */
export default function CarFullScreen({
  earnings,
  onMyRoutes,
}: {
  earnings: number
  onMyRoutes: () => void
}) {
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
          <strong>6 / 6</strong>
        </div>
        <div className="divider" />
        <div className="summary-row">
          <span>Даромад · Earnings</span>
          <strong className="teal">{earnings.toLocaleString('ru-RU')} сомонӣ</strong>
        </div>
        <div className="divider" />
        <div className="summary-row">
          <span>Сайёҳон · Passengers</span>
          <strong className="teal sm">Огоҳ шуданд ✓</strong>
        </div>
      </div>

      <p className="section-label">Ҳамсафарон · Fellow travelers</p>
      <div className="avatar-row">
        {['АМ', 'ЗР', 'ҶТ', 'SM', 'МЗ', 'ДК'].map((p) => (
          <span key={p} className={`avatar lg${p === 'SM' ? ' amber' : ''}`}>
            {p}
          </span>
        ))}
      </div>

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
