import './AppBar.css'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="1" x2="8" y2="3" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="13" x2="8" y2="15" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="8" x2="3" y2="8" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="8" x2="15" y2="8" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2.93" y1="2.93" x2="4.34" y2="4.34" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.66" y1="11.66" x2="13.07" y2="13.07" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13.07" y1="2.93" x2="11.66" y2="4.34" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.34" y1="11.66" x2="2.93" y2="13.07" stroke="#7A4F00" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function AppBar({ rightElement }) {
  return (
    <header class="app-bar">
      <a href="/" class="app-bar__logo" aria-label="Suno — go to home">
        <div class="app-bar__logo-mark">
          <SunIcon />
        </div>
        <span class="app-bar__logo-name">Suno</span>
      </a>
      {rightElement && <div class="app-bar__right">{rightElement}</div>}
    </header>
  )
}
