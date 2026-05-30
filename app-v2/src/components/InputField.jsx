import './InputField.css'

export function InputField({
  label,
  value,
  placeholder = 'Enter a city…',
  type = 'departure',
  state = 'default',
  ariaLabel,
  onClick,
}) {
  const stateClass =
    state === 'focused' ? 'input-field__button--focused' :
    state === 'confirmed' ? 'input-field__button--confirmed' : ''

  const dotClass =
    type === 'departure' ? 'input-field__dot--departure' :
    state === 'confirmed' ? 'input-field__dot--destination-confirmed' :
    'input-field__dot--destination'

  const displayLabel = ariaLabel || (
    value
      ? `${label}: ${value}. Tap to change.`
      : `Select ${label.toLowerCase()} city`
  )

  return (
    <div class="input-field">
      <span class="input-field__label" id={`label-${type}`}>{label}</span>
      <button
        type="button"
        class={`input-field__button ${stateClass}`}
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-label={displayLabel}
        onClick={onClick}
      >
        <span class={`input-field__dot ${dotClass}`} aria-hidden="true" />
        <span class="input-field__value">{value || placeholder}</span>
        <span class="input-field__chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  )
}
