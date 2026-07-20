import type { SeatPrices } from '../data'

/* D3 · Дархостҳо — request approval: live seat map + accept/decline */
export default function RequestsScreen({
  approved,
  requestGone,
  prices,
  dateLabel,
  onBack,
  onDecline,
  onApprove,
  onChat,
}: {
  approved: boolean
  requestGone: boolean
  prices: SeatPrices
  dateLabel: string
  onBack: () => void
  onDecline: () => void
  onApprove: () => void
  onChat: () => void
}) {
  return (
    <div className="screen">
      <div className="top-bar left">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <div className="page-head inline">
          <h2>Дархостҳо</h2>
          <p>Requests · {requestGone || approved ? '0' : '1'} нав</p>
        </div>
      </div>

      <div className="card seat-card compact">
        <div className="seat-status-head">
          <strong>Душанбе (Dushanbe) → Хоруғ (Khorog) · {dateLabel}</strong>
          <span className="pill-teal">{approved ? '4' : '3'}/6 пур</span>
        </div>
        <div className="car-body sm">
          <svg className="windshield" viewBox="0 0 140 20" aria-hidden="true">
            <path d="M0 18 Q70 0 140 18" fill="none" stroke="#DDE7E8" strokeWidth="3" />
          </svg>
          <div className="seat-row">
            <div className="seat driver-seat">
              <span className="wheel" />
            </div>
            <div className={`seat${approved ? ' taken' : requestGone ? '' : ' pending'}`}>
              {approved ? (
                'SM'
              ) : requestGone ? (
                <strong>{prices.front}</strong>
              ) : (
                <small>нав</small>
              )}
            </div>
          </div>
          <div className="seat-row three">
            <div className="seat taken">АМ</div>
            <div className="seat taken">ЗР</div>
            <div className="seat">
              <strong>{prices.m1}</strong>
            </div>
          </div>
          <div className="seat-row two">
            <div className="seat taken">ҶТ</div>
            <div className="seat">
              <strong>{prices.b2}</strong>
            </div>
          </div>
        </div>
      </div>

      {!requestGone && !approved && (
        <div className="card request-card">
          <div className="ride-head">
            <span className="avatar amber">SM</span>
            <div className="ride-namebox">
              <strong>Sofia M.</strong>
              <span>Сайёҳ · English</span>
            </div>
            <span className="time-ago">2 дақ пеш</span>
          </div>
          <span className="badge-amber">Ҷои пеш · {prices.front} сомонӣ</span>
          <p className="request-note">
            Паёмҳо ба тоҷикӣ тарҷума мешаванд · auto-translated
          </p>
          <button className="text-link chat-link" onClick={onChat}>
            Паём ба Sofia · Open chat ›
          </button>
          <div className="request-actions">
            <button className="btn-ghost" onClick={onDecline}>
              Рад
            </button>
            <button className="cta compact" onClick={onApprove}>
              Тасдиқ ✓
            </button>
          </div>
        </div>
      )}

      {approved && (
        <p className="footer-note strong">Тасдиқ шуд ✓ · Sofia огоҳ мешавад…</p>
      )}

      <p className="footer-note">
        Агар тасдиқ кунед, сайёҳ огоҳ мешавад.
        <br />
        <span className="muted">If you approve, the tourist is notified.</span>
      </p>
    </div>
  )
}
