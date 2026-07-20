/* Seat-fill progress dots (e.g. "3 of 6 filled") */
export default function Dots({ filled, total }: { filled: number; total: number }) {
  return (
    <span className="dots">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`dot${i < filled ? ' on' : ''}`} />
      ))}
    </span>
  )
}
