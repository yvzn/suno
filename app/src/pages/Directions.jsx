import { useEffect, useState } from 'preact/hooks'
import { Text, withText } from 'preact-i18n'
import { deserializeJourney } from '../services/serialize'

import { LoadingIndicator } from '../components/LoadingIndicator'
import { ErrorMessage } from '../components/ErrorMessage'
import { PageTitle } from '../components/PageTitle'
import { DocumentTitle } from '../components/DocumentTitle'
import { ItinerarySummary } from '../components/ItinerarySummary'
import { CustomLink } from '../components/CustomLink'
import { LegSunDirection } from '../components/LegSunDirection'

import { getDirections, getDirectionsWithRetry } from '../services/api'
import { formatDurationInSeconds } from '../services/duration'
import { aggregateLegs } from '../services/directions'
import { computeSunPositionsPerLeg } from '../services/sun-position'
import { customRoute } from '../services/router'

import './Directions.css'

const Title = withText('directions.title')(PageTitle)
const SetDocumentTitle = withText('directions.title')(DocumentTitle)

export function Directions() {
  const [journey, setJourney] = useState()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)

  const [itinerary, setItinerary] = useState()
  const [sunPositionsPerLeg, setSunPositionsPerLeg] = useState()

  useEffect(() => {
    const journey = deserializeJourney(location.search)
    if (!journey.from || !journey.to || !journey.startDate) {
      customRoute('/journey')
    }
    setJourney(journey)
  }, [])

  const fetchItinerary = (fetchFn = getDirections) => {
    if (!journey) return
    setError(undefined)
    setItinerary(undefined)
    setSunPositionsPerLeg(undefined)
    setLoading(true)
    fetchFn(journey)
      .then(setItinerary, setError)
      .finally(() => setLoading(false))
  }

  useEffect(fetchItinerary, [journey])

  useEffect(() => {
    if (!itinerary || !journey?.startDate) return
    const aggregated = aggregateLegs(itinerary.legs)
    const positions = computeSunPositionsPerLeg({ legs: aggregated }, journey.startDate)
    setSunPositionsPerLeg(positions)
  }, [itinerary, journey])

  const fetchItineraryWithRetry = () => fetchItinerary(getDirectionsWithRetry);

  return (
    <>
      <header>
        <Title />
        <SetDocumentTitle />
      </header>
      <main id="directions">
        <ItinerarySummary
          from={journey?.from?.name}
          to={journey?.to?.name} />

        <LoadingIndicator isLoading={isLoading} />
        <ErrorMessage error={error} onRetry={fetchItineraryWithRetry} />

        <section aria-live="polite">
          {itinerary && itinerary.legs && (
            <dl>
              {aggregateLegs(itinerary.legs).map(
                (leg, index) => <ItineraryLeg
                  leg={leg}
                  sunPositions={sunPositionsPerLeg?.[index]}
                  key={"leg-" + index}
                />
              )}
            </dl>
          )}
        </section>
      </main>
      {journey && itinerary && (
        <footer>
          <CustomLink
            href={'/sun' + window.location.search}
            className="btn btn-primary"
          >
            <Text id="directions.sun"></Text>
          </CustomLink>
        </footer>
      )}
    </>
  )
}

function ItineraryLeg({ leg, sunPositions }) {
  const legDuration = formatDurationInSeconds(leg.durationInSeconds)
  return (<>
    <dt>
      <Text
        id="directions.legDescription"
        fields={{
          from: leg.start.name,
          to: leg.end.name,
        }}
      ></Text>
    </dt>
    <dd>
      {sunPositions && <LegSunDirection positions={sunPositions} />}
      {legDuration}
    </dd>
  </>)
}

