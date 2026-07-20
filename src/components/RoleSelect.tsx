import Mountains from './Mountains'
import type { Role } from '../data'

/* Landing page: pick Passenger or Driver */
export default function RoleSelect({ onPick }: { onPick: (r: Role) => void }) {
  return (
    <div className="screen">
      <Mountains />
      <div className="logo-block landing">
        <h1 className="logo">
          hamsafar<span className="logo-dot" />
        </h1>
        <p className="tagline">ҳамсафар — your companion for the journey</p>
      </div>

      <p className="section-label">Who are you? · Шумо кистед?</p>

      <button className="card role-card" onClick={() => onPick('passenger')}>
        <span className="role-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="7.5" r="4" />
            <path d="M4 20.5c0-4.2 3.6-6.5 8-6.5s8 2.3 8 6.5" />
          </svg>
        </span>
        <span className="role-text">
          <strong>Passenger</strong>
          <span>Сайёҳ · Book a seat, pay cash at the stand</span>
        </span>
        <span className="role-arrow">›</span>
      </button>

      <button className="card role-card" onClick={() => onPick('driver')}>
        <span className="role-icon amber">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 15v6M3.6 10.2L9.2 11.3M20.4 10.2L14.8 11.3" />
          </svg>
        </span>
        <span className="role-text">
          <strong>Ронанда · Driver</strong>
          <span>Эълони масир · Publish your route, fill your car</span>
        </span>
        <span className="role-arrow">›</span>
      </button>

      <p className="footer-note">
        No more waiting at the stand the day before.
        <br />
        <span className="muted">Дигар як рӯз пеш дар истгоҳ мунтазир нашавед.</span>
      </p>
    </div>
  )
}
