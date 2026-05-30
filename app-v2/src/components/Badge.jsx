import './Badge.css'

export function Badge({ variant = 'sun', children }) {
  return <span class={`badge badge--${variant}`}>{children}</span>
}
