import './RouteCard.css'

export function RouteCard({ children }) {
  return <div class="route-card">{children}</div>
}

export function RouteCardTitle({ children }) {
  return <h2 class="route-card__title">{children}</h2>
}

export function RouteCardFields({ departure, destination, onSwap }) {
  return (
    <div class="route-card__fields">
      <div class="route-card__track" aria-hidden="true">
        <span class="route-card__track-dot route-card__track-dot--departure" />
        <span class="route-card__track-line" />
        <span class="route-card__track-dot route-card__track-dot--destination" />
      </div>
      <div class="route-card__inputs">
        {departure}
        {destination}
      </div>
      <button
        type="button"
        class="route-card__swap"
        aria-label="Swap departure and destination"
        onClick={onSwap}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 5L3 10" stroke="var(--color-gray-3)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M1.5 8.5L3 10L4.5 8.5" stroke="var(--color-gray-3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 9L11 4" stroke="var(--color-gray-3)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9.5 5.5L11 4L12.5 5.5" stroke="var(--color-gray-3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export function RouteCardDivider() {
  return <hr class="route-card__divider" />
}

export function RouteCardFooter({ children }) {
  return <div class="route-card__footer">{children}</div>
}
