import { AppBar } from '../components/AppBar'
import { Button } from '../components/Button'
import '../styles/layout.css'
import './NotFound.css'

export function NotFound() {
  return (
    <div class="page">
      <AppBar />
      <main class="not-found__content" aria-labelledby="nf-title">
        <div class="not-found__inner">
          <div class="not-found__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="5.5" stroke="var(--color-sun-dark)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="13.2" y1="13.2" x2="17" y2="17" stroke="var(--color-sun-dark)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6.5" y1="9" x2="11.5" y2="9" stroke="var(--color-sun-dark)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 class="screen-title" id="nf-title">Content not found</h1>
          <p class="not-found__body">
            The requested content has been moved or no longer exists. Please check the address or return to the home page.
          </p>

          <Button href="/" class="not-found__btn" aria-label="Return to Suno home page">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 1L1 6.5l5.5 5.5M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </Button>

          <p class="not-found__meta" role="note">Error 404</p>
        </div>
      </main>
    </div>
  )
}
