import { useState } from 'react'
import { TJ_MONTHS, EN_MONTHS, TJ_DOW } from '../data'

/* Month-view date picker (Monday-first, Tajik labels, past days disabled) */
export default function Calendar({
  selected,
  onSelect,
}: {
  selected: Date | null
  onSelect: (d: Date) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [view, setView] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isPast = (d: number) => new Date(year, month, d) < today
  const isSel = (d: number) =>
    !!selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d
  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth())

  return (
    <div className="card calendar">
      <div className="cal-head">
        <button
          disabled={!canGoPrev}
          onClick={() => setView(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <strong>
          {TJ_MONTHS[month]} ({EN_MONTHS[month]}) {year}
        </strong>
        <button
          onClick={() => setView(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="cal-grid">
        {TJ_DOW.map((d) => (
          <span key={d} className="cal-dow">
            {d}
          </span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={`e${i}`} />
          ) : (
            <button
              key={d}
              className={`cal-day${isSel(d) ? ' sel' : ''}${isToday(d) ? ' today' : ''}`}
              disabled={isPast(d)}
              onClick={() => onSelect(new Date(year, month, d))}
            >
              {d}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
