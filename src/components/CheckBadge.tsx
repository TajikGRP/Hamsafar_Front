/* Big teal circle with a checkmark (confirmation screens) */
export default function CheckBadge() {
  return (
    <div className="check-badge">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path
          d="M6 16 L13 24 L27 8"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
