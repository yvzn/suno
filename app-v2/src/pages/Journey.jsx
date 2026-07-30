import { AppBar } from '../components/AppBar'
import { Button } from '../components/Button'
import { InputField } from '../components/InputField'
import { TimeChips, TimeChip } from '../components/TimeChip'
import { RouteCard, RouteCardTitle, RouteCardFields, RouteCardDivider, RouteCardFooter } from '../components/RouteCard'
import '../styles/layout.css'
import './Journey.css'

export function Journey() {
  return (
    <div class="page">
      <AppBar rightElement={<span class="app-bar__step" aria-label="Step 1 of 3">Step 1 / 3</span>} />
      <main class="page__content" aria-labelledby="journey-title">
        <h1 class="journey__section-title" id="journey-title">Your itinerary</h1>

        <RouteCard>
          <RouteCardFields
            departure={
              <InputField
                label="Departure"
                value="London, England"
                type="departure"
                state="confirmed"
              />
            }
            destination={
              <InputField
                label="Destination"
                placeholder="Enter a city…"
                type="destination"
                state="default"
              />
            }
            onSwap={() => {}}
          />
          <RouteCardDivider />
          <RouteCardFooter>
            <TimeChips>
              <TimeChip icon="▶" ariaLabel="Departure mode">Depart at…</TimeChip>
              <TimeChip icon="▤" ariaLabel="Select date">20/04/2026</TimeChip>
              <TimeChip icon="◷" ariaLabel="Select time">10:00</TimeChip>
            </TimeChips>
          </RouteCardFooter>
        </RouteCard>

        <Button href="/sun">Continue →</Button>
      </main>
    </div>
  )
}
