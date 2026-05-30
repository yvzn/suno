import { AppBar } from '../components/AppBar'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { SummaryGrid, SummaryCard } from '../components/SummaryCard'
import '../styles/layout.css'
import './Sun.css'

function PolarChart() {
  return (
    <svg viewBox="0 0 110 110" width="110" height="110" aria-label="Polar chart showing sun position distribution" role="img">
      <circle cx="55" cy="55" r="50" fill="none" stroke="var(--color-gray-2)" strokeWidth="0.5" />
      <circle cx="55" cy="55" r="35" fill="none" stroke="var(--color-gray-2)" strokeWidth="0.5" />
      <circle cx="55" cy="55" r="20" fill="none" stroke="var(--color-gray-2)" strokeWidth="0.5" />
      <path d="M55 55 L30 92 A52 52 0 0 1 10 58 Z" fill="var(--color-sun)" fillOpacity="0.9" />
      <path d="M55 55 L8 52 A50 50 0 0 1 15 32 Z" fill="var(--color-sun)" fillOpacity="0.5" />
      <path d="M55 55 L57 5 A50 50 0 0 1 64 6 Z" fill="var(--color-sun)" fillOpacity="0.3" />
      <rect x="45" y="38" width="20" height="34" rx="2" fill="var(--color-gray-3)" fillOpacity="0.12" />
      <rect x="49" y="34" width="12" height="6" rx="1.5" fill="var(--color-gray-3)" fillOpacity="0.10" />
      <line x1="55" y1="5" x2="55" y2="105" stroke="var(--color-gray-2)" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="5" y1="55" x2="105" y2="55" stroke="var(--color-gray-2)" strokeWidth="0.5" strokeDasharray="3 3" />
    </svg>
  )
}

export function Sun() {
  return (
    <div class="page">
      <AppBar rightElement={<a href="/journey" class="app-bar__edit" aria-label="Edit journey">Edit</a>} />
      <main class="page__content" aria-labelledby="sun-title">
        <h1 class="sun__section-title" id="sun-title">Cumulative durations</h1>

        <div class="sun__route-info">
          London → Birmingham · 20/04 · 10:00
        </div>

        <div class="sun__chart">
          <PolarChart />
        </div>

        <SummaryGrid>
          <SummaryCard direction="rear" label="Rear" value="2h 10min" highlight />
          <SummaryCard direction="right" label="Right" value="12min" />
          <SummaryCard direction="left" label="Left" value="8min" />
          <SummaryCard direction="front" label="Front" value="1min" />
        </SummaryGrid>

        <Button variant="secondary" href="/directions">
          View directions →
        </Button>
      </main>
    </div>
  )
}
