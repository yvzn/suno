import './TimeChip.css'

export function TimeChips({ children }) {
  return <div class="time-chips">{children}</div>
}

export function TimeChip({ icon, children, ariaLabel }) {
  return (
    <button type="button" class="time-chip" aria-label={ariaLabel}>
      {icon && <span class="time-chip__icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
