import PhoneIcon from '../components/PhoneIcon'
import { SEAT_INFO, DRIVER_PHONE, MAPS_URL, telHref } from '../data'
import type { SeatId } from '../data'

/* P3 · Choose your seat — interactive seat map, meeting point, call driver */
export default function SeatSelectScreen({
  seat,
  onSeat,
  onBack,
  onRequest,
}: {
  seat: SeatId
  onSeat: (s: SeatId) => void
  onBack: () => void
  onRequest: () => void
}) {
  return (
    <div className="screen has-bottom-bar">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <div className="top-bar-title">
          <strong>Choose your seat</strong>
        </div>
      </div>

      <div className="driver-row">
        <span className="avatar lg">BS</span>
        <div>
          <strong>Bakhtiyor S.</strong>
          <span>★ 4.8 · Toyota Land Cruiser · 5124 BS 01</span>
          <span className="phone-line">{DRIVER_PHONE}</span>
        </div>
        <a className="call-btn" href={telHref(DRIVER_PHONE)} aria-label="Call driver">
          <PhoneIcon />
        </a>
      </div>

      <div className="card seat-card">
        <div className="car-body">
          <svg className="windshield" viewBox="0 0 140 20" aria-hidden="true">
            <path d="M0 18 Q70 0 140 18" fill="none" stroke="#DDE7E8" strokeWidth="3" />
          </svg>
          <div className="seat-row">
            <div className="seat driver-seat">
              <span className="wheel" />
              <span className="seat-caption">Driver</span>
            </div>
            <button
              className={`seat${seat === 'front' ? ' selected' : ''}`}
              onClick={() => onSeat('front')}
            >
              <strong>400</strong>
              <small>Front</small>
            </button>
          </div>
          <div className="seat-row three">
            <button
              className={`seat${seat === 'm1' ? ' selected' : ''}`}
              onClick={() => onSeat('m1')}
            >
              <strong>350</strong>
            </button>
            <div className="seat taken">AM</div>
            <div className="seat taken">ZR</div>
          </div>
          <div className="seat-row two">
            <div className="seat taken">JT</div>
            <button
              className={`seat${seat === 'b2' ? ' selected' : ''}`}
              onClick={() => onSeat('b2')}
            >
              <strong>300</strong>
            </button>
          </div>
        </div>
        <div className="legend">
          <span>
            <i className="lg-box available" /> Available
          </span>
          <span>
            <i className="lg-box selected" /> Selected
          </span>
          <span>
            <i className="lg-box taken" /> Taken
          </span>
        </div>
      </div>

      <div className="card meet-card">
        <div className="map-thumb" aria-hidden="true">
          <span className="map-pin" />
        </div>
        <div className="meet-info">
          <span className="field-label">Meeting point</span>
          <strong>Автостансияи Бадахшон (Badakhshan Avtostansiya)</strong>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            Open in Google Maps ↗
          </a>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="bottom-price">
          <span>{SEAT_INFO[seat].label}</span>
          <strong>{SEAT_INFO[seat].price} TJS · cash</strong>
        </div>
        <button className="cta compact" onClick={onRequest}>
          Request seat
        </button>
      </div>
    </div>
  )
}
