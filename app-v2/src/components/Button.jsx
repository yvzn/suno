import './Button.css'

export function Button({ variant = 'primary', children, href, ...props }) {
  const className = `btn btn--${variant}`

  if (href) {
    return (
      <a href={href} class={className} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" class={className} {...props}>
      {children}
    </button>
  )
}
