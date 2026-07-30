import { AppBar } from '../components/AppBar'
import { Badge } from '../components/Badge'
import { StepList, StepItem } from '../components/StepList'
import '../styles/layout.css'
import './Directions.css'

export function Directions() {
  const steps = [
    { text: 'Charing Cross → Trafalgar Square', time: '<1min', direction: 'front', sunExposed: true },
    { text: 'M4/E30 → M25', time: '14min', direction: 'rear', sunExposed: true },
    { text: 'M25 → M40', time: '26min', direction: 'left', sunExposed: true },
    { text: 'Knightsbridge → West Cromwell Rd', time: '9min', direction: 'none', sunExposed: false },
    { text: 'M40 → M42/E05', time: '1h 4min', direction: 'right', sunExposed: true },
    { text: 'M6/E05 → Aston Expressway', time: '9min', direction: 'rear', sunExposed: true },
  ]

  return (
    <div class="page">
      <AppBar rightElement={<a href="/journey" class="app-bar__edit" aria-label="Edit journey">Edit</a>} />
      <main class="page__content" aria-labelledby="directions-title">
        <h1 class="directions__section-title" id="directions-title">Directions</h1>

        <div class="directions__meta">
          <div class="directions__meta-left">
            London → Birmingham<br />20/04 · 10:00
          </div>
          <Badge variant="sun">Sun behind 85%</Badge>
        </div>

        <StepList>
          {steps.map((step, i) => (
            <StepItem
              key={i}
              direction={step.direction}
              sunExposed={step.sunExposed}
              text={step.text}
              time={step.time}
              isLast={i === steps.length - 1}
            />
          ))}
        </StepList>
      </main>
    </div>
  )
}
