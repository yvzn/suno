import { useState } from 'preact/hooks'
import { AppBar } from '../components/AppBar'
import { Button } from '../components/Button'
import { LanguageToggle } from '../components/LanguageToggle'
import { TagPills, TagPill } from '../components/TagPill'
import '../styles/layout.css'
import './Home.css'

function RouteIcon({ selected }) {
  const color = selected ? '#FFFFFF' : '#9A9590'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10 Q5 4 10 4 Q15 4 17 10 Q15 16 10 16 Q5 16 3 10Z" stroke={color} strokeWidth="1.4" fill="none" />
      <path d="M10 4L10 16" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M3 10L17 10" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="10" cy="7" r="1.5" fill={color} />
      <path d="M7 14L10 10L13 14" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ParkingIcon({ selected }) {
  const color = selected ? '#7A4F00' : '#9A9590'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="12" height="12" rx="2.5" stroke={color} strokeWidth="1.4" fill="none" />
      <path d="M8 14L8 7L11 7C12.5 7 13.5 8 13.5 9.5C13.5 11 12.5 12 11 12L8 12" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SunIllustration() {
  return (
    <svg viewBox="0 0 120 56" width="120" height="56" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="50" rx="50" ry="4" fill="#FFF0B3" opacity="0.8" />
      <circle cx="60" cy="24" r="16" fill="var(--color-sun)" />
      <circle cx="60" cy="24" r="10" fill="var(--color-sun-dark)" />
      <line x1="60" y1="4" x2="60" y2="10" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="38" x2="60" y2="44" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="24" x2="46" y2="24" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
      <line x1="74" y1="24" x2="80" y2="24" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="9" x2="49" y2="13" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
      <line x1="71" y1="35" x2="75" y2="39" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="9" x2="71" y2="13" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
      <line x1="49" y1="35" x2="45" y2="39" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Home() {
  const [language, setLanguage] = useState('en')
  const [mode, setMode] = useState('route')

  return (
    <div class="page">
      <AppBar rightElement={<LanguageToggle value={language} onChange={setLanguage} />} />
      <main class="page__content" aria-labelledby="home-title">
        <div class="home__body">
          <div class="home__header">
            <h1 class="screen-title" id="home-title">
              Anticipate the sun<br />on your journey
            </h1>
            <p class="screen-subtitle">
              Real-time sun position along your route. Plan with confidence.
            </p>
          </div>

          <div class="home__mode-selector" role="radiogroup" aria-label="Select a mode">
            <span class="home__mode-label">Select a mode</span>
            <div class="home__mode-cards">
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'route'}
                class={`home__mode-card ${mode === 'route' ? 'home__mode-card--selected-route' : ''}`}
                onClick={() => setMode('route')}
              >
                <div class={`home__mode-icon ${mode === 'route' ? 'home__mode-icon--route-sel' : 'home__mode-icon--route-unsel'}`}>
                  <RouteIcon selected={mode === 'route'} />
                </div>
                <div class="home__mode-card-text">
                  <div class={`home__mode-card-title ${mode === 'route' ? 'home__mode-card-title--route' : ''}`}>Route</div>
                  <div class="home__mode-card-desc">Sun position along a journey</div>
                </div>
                <div class={`home__mode-check ${mode === 'route' ? 'home__mode-check--nav' : ''}`}>
                  {mode === 'route' && <CheckIcon />}
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={mode === 'parking'}
                class={`home__mode-card ${mode === 'parking' ? 'home__mode-card--selected-parking' : ''}`}
                onClick={() => setMode('parking')}
              >
                <div class={`home__mode-icon ${mode === 'parking' ? 'home__mode-icon--parking-sel' : 'home__mode-icon--parking-unsel'}`}>
                  <ParkingIcon selected={mode === 'parking'} />
                </div>
                <div class="home__mode-card-text">
                  <div class={`home__mode-card-title ${mode === 'parking' ? 'home__mode-card-title--parking' : ''}`}>Parking</div>
                  <div class="home__mode-card-desc">Best spot to stay in the shade</div>
                </div>
                <div class={`home__mode-check ${mode === 'parking' ? 'home__mode-check--sun' : ''}`}>
                  {mode === 'parking' && <CheckIcon />}
                </div>
              </button>
            </div>
          </div>

          <div class="home__illo">
            <SunIllustration />
          </div>

          <TagPills>
            <TagPill variant="sun">Live position</TagPill>
            <TagPill>Planning</TagPill>
            <TagPill>Comfort &amp; safety</TagPill>
          </TagPills>

          <Button href="/journey">Start</Button>
        </div>
      </main>
    </div>
  )
}
