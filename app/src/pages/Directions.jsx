import { useEffect, useState } from 'preact/hooks';
import { Text, withText } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageTitle } from '../components/PageTitle';
import { DocumentTitle } from '../components/DocumentTitle';
import { ItinerarySummary } from '../components/ItinerarySummary';

import { getDirections } from '../services/api';
import { formatDurationInSeconds } from '../services/duration';
import { aggregateLegs } from '../services/directions';

import './Directions.css';

const Title = withText('directions.title')(PageTitle);
const SetDocumentTitle = withText('directions.title')(DocumentTitle);

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
        <SetDocumentTitle />
      </header>
      <main id="directions">
        <ItinerarySummary
          from={journey?.from?.name}
          to={journey?.to?.name} />

        <LoadingIndicator isLoading={isLoading} />
        <ErrorMessage error={error} onRetry={fetchItinerary} />

        <section aria-live="polite">
          {itinerary && itinerary.legs && (
            <dl>
              {aggregateLegs(itinerary.legs).map(
                (leg, index) => <ItineraryLeg leg={leg} key={"leg-" + index} />
              )}
            </dl>
          )}
        </section>
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

