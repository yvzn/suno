export function JourneySwapButton(props) {
  return (
    <button
      type="button"
      className="btn btn-secondary journey-swap-button"
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.description}
    >
      <span class="visually-hidden on-large-device">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M 17 7 L 17 18 L 20 15 M 17 18 L 14 15 M 7 17 L 7 6 L 10 9 M 7 6 L 4 9"></path>
        </svg>
      </span>
      <span class="visually-hidden on-small-device">{props.label}</span>
    </button>
  )
}
