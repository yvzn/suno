import './StepList.css'

export function StepList({ children }) {
  return <ol class="step-list" aria-label="Route directions">{children}</ol>
}

function DirectionIcon({ direction }) {
  if (direction === 'none') {
    return (
      <div class="step-item__direction step-item__direction--none" aria-label="No sun exposure">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="2.5" stroke="var(--color-gray-2)" strokeWidth="1.2" />
          <line x1="4" y1="4" x2="8" y2="8" stroke="var(--color-gray-2)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  const arrows = {
    rear: <path d="M6 2.5L6 9.5M3.5 7L6 9.5L8.5 7" stroke="var(--color-sun-dark)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
    front: <path d="M6 9.5L6 2.5M3.5 5L6 2.5L8.5 5" stroke="var(--color-gray-3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
    left: <path d="M9.5 6L2.5 6M5 3.5L2.5 6L5 8.5" stroke="var(--color-sun-dark)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
    right: <path d="M2.5 6L9.5 6M7 3.5L9.5 6L7 8.5" stroke="var(--color-sun-dark)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  }

  const dirClass = direction === 'front' ? 'step-item__direction step-item__direction--none' : 'step-item__direction'

  return (
    <div class={dirClass} aria-label={`Sun from ${direction}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {arrows[direction]}
        {direction !== 'front' && <circle cx="6" cy="6" r="1.5" fill="var(--color-sun)" />}
      </svg>
    </div>
  )
}

export function StepItem({ direction = 'rear', sunExposed = true, text, time, isLast }) {
  return (
    <li class="step-item">
      <div class="step-item__tracker" aria-hidden="true">
        <span class={`step-item__dot ${sunExposed ? 'step-item__dot--sun' : 'step-item__dot--neutral'}`} />
        {!isLast && <span class="step-item__line" />}
      </div>
      <div class="step-item__content">
        <DirectionIcon direction={direction} />
        <span class="step-item__text">{text}</span>
        <span class="step-item__time">{time}</span>
      </div>
    </li>
  )
}
