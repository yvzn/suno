import './SummaryCard.css'

export function SummaryGrid({ children }) {
  return <div class="summary-grid">{children}</div>
}

export function SummaryCard({ direction, label, value, highlight }) {
  const dirIcons = { rear: '↑', right: '→', left: '←', front: '↓' }
  const cardClass = highlight ? 'summary-card summary-card--highlight' : 'summary-card'

  return (
    <div class={cardClass}>
      <div class={`summary-card__icon summary-card__icon--${direction}`} aria-hidden="true">
        {dirIcons[direction]}
      </div>
      <div>
        <div class="summary-card__label">{label}</div>
        <div class="summary-card__value">{value}</div>
      </div>
    </div>
  )
}
