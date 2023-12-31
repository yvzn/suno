import { useEffect, useState } from 'preact/hooks';
import { Text, withText } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { AppTitle } from '../components/AppTitle';
import { ItinerarySummary } from '../components/ItinerarySummary';
import { getDirections } from '../services/api';
import { formatDurationInSeconds } from '../services/duration';
import { aggregateLegs } from '../services/directions';

import './Directions.css';

const Title = withText('directions.title')(AppTitle);

export function Directions() {
  const [journey, setJourney] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [itinerary, setItinerary] = useState();

  useEffect(() => {
    const journey = deserializeJourney(location.search);
    if (!journey.from || !journey.to || !journey.startDate) {
      route('/journey');
    }
    setJourney(journey)
  }, []);

  const fetchItinerary = () => {
    if (!journey) return;
    setError(undefined);
    setLoading(true);
    getDirections(journey)
      .then(setItinerary, setError)
      .finally(() => setLoading(false));
  }

  useEffect(fetchItinerary, [journey]);

  return (
    <>
      <header>
        <Title />
      </header>
      <main id="directions" aria-live="polite">
        <ItinerarySummary
          from={journey?.from?.name}
          to={journey?.to?.name} />

        <LoadingIndicator isLoading={isLoading} />
        <ErrorMessage error={error} onRetry={fetchItinerary} />

        {itinerary && itinerary.legs && (
          <section>
            <dl>
              {aggregateLegs(itinerary.legs).map(
                (leg, index) => <ItineraryLeg leg={leg} key={"leg-" + index} />
              )}
            </dl>
          </section>
        )}
      </main>
      {journey && (
        <footer>
          <Link
            href={'/sun' + window.location.search}
          >
            <Text id="directions.sun"></Text>
          </Link>
        </footer>
      )}
    </>
  );
}

function ItineraryLeg(props) {
  const legDuration = formatDurationInSeconds(props.leg.durationInSeconds)
  return (<>
    <dt>
      <Text
        id="directions.legDescription"
        fields={{
          from: props.leg.start.name,
          to: props.leg.end.name,
        }}
      ></Text>
    </dt>
    <dd>
      {legDuration}
    </dd>
  </>)
}

