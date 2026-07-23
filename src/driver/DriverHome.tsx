/* D0 · Driver home — choose between creating a route and viewing bookings */
export default function DriverHome({
  pendingCount,
  error,
  onAddRoute,
  onMyRoutes,
  onHome,
}: {
  pendingCount: number
  error: string | null
  onAddRoute: () => void
  onMyRoutes: () => void
  onHome: () => void
}) {
  return (
    <div className="screen">
      <button className="back-btn home" onClick={onHome} aria-label="Change role">
        ‹
      </button>
      <div className="page-head">
        <h2>Ронанда</h2>
        <p>Driver · What would you like to do?</p>
      </div>

      {error && (
        <p className="footer-note strong">
          Server error: <span className="muted">{error}</span>
        </p>
      )}

      <button className="card role-card" onClick={onAddRoute}>
        <span className="role-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="role-text">
          <strong>Масири нав</strong>
          <span>Add a new route · эълони сафар</span>
        </span>
        <span className="role-arrow">›</span>
      </button>

      <button className="card role-card" onClick={onMyRoutes}>
        <span className="role-icon amber">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </span>
        <span className="role-text">
          <strong>Сафарҳои ман</strong>
          <span>My routes · booking status</span>
        </span>
        {pendingCount > 0 && (
          <span className="badge-amber">{pendingCount} нав</span>
        )}
        <span className="role-arrow">›</span>
      </button>
    </div>
  )
}
