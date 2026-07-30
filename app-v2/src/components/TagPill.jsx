import './TagPill.css'

export function TagPills({ children }) {
  return <div class="tag-pills">{children}</div>
}

export function TagPill({ variant, children }) {
  const className = variant === 'sun' ? 'tag-pill tag-pill--sun' : 'tag-pill'
  return <span class={className}>{children}</span>
}
