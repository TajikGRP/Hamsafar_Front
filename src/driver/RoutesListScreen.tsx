import Dots from '../components/Dots'

/* D2 · Сафарҳои ман — booking status list (active + past routes) */
export default function RoutesListScreen({
  approved,
  hasNewRequest,
  dateLabel,
  year,
  onBack,
  onOpenActive,
  onAddRoute,
}: {
  approved: boolean
  hasNewRequest: boolean
  dateLabel: string
  year: number
  onBack: () => void
  onOpenActive: () => void
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

      <button className="card route-card" onClick={onOpenActive}>
        <div className="route-line">
          <strong>Душанбе (Dushanbe) → Хоруғ (Khorog)</strong>
          <span className="pill-teal">{approved ? '6/6' : '3/6'} пур</span>
        </div>
        <span className="route-sub">
          {dateLabel} · Toyota Land Cruiser · {year}
        </span>
        <Dots filled={approved ? 6 : 3} total={6} />
        {hasNewRequest && (
          <span className="badge-amber">1 дархости нав · 1 new request ›</span>
        )}
        {approved && (
          <span className="route-done">Мошин пур шуд ✓ · Car is full</span>
        )}
      </button>

      <div className="card route-card done">
        <div className="route-line">
          <strong>Душанбе (Dushanbe) → Кӯлоб (Kulob)</strong>
          <span className="pill-gray">Анҷом ёфт</span>
        </div>
        <span className="route-sub">15 июл · 7/7 пур · 2 450 сомонӣ</span>
      </div>

      <div className="card route-card done">
        <div className="route-line">
          <strong>Душанбе (Dushanbe) → Хоруғ (Khorog)</strong>
          <span className="pill-gray">Анҷом ёфт</span>
        </div>
        <span className="route-sub">11 июл · 6/6 пур · 2 050 сомонӣ</span>
      </div>

      <button className="add-route" onClick={onAddRoute}>
        + Масири нав · Add route
      </button>
    </div>
  )
}
