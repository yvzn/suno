import './Spinner.css'

export function Spinner({ size = 'md', label = 'Loading' }) {
  const sizeMap = { sm: 16, md: 24, lg: 32 }
  const px = sizeMap[size] || 24

  return (
    <div class={`spinner spinner--${size}`} role="status" aria-label={label}>
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12" cy="12" r="9"
          stroke="var(--color-gray-2)"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="12" cy="12" r="9"
          stroke="var(--color-sun-dark)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="18 39"
        />
        <circle cx="12" cy="12" r="2.5" fill="var(--color-sun-dark)" />
      </svg>
    </div>
  )
}
