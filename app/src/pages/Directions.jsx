import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { getDirections } from '../services/api';

import './Directions.css';

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
      <main>
        <h1>
          <Text id="directions.title">Directions</Text>
        </h1>
        <p>
          <Text
            id="directions.message"
            fields={{
              from: journey?.from?.name,
              to: journey?.to?.name,
            }}
          >
            Itinerary details
          </Text>
        </p>

        <LoadingIndicator isLoading={isLoading} />
        <ErrorMessage error={error} onRetry={fetchItinerary} />

        {itinerary && itinerary.legs && (
          <section>
            <dl>
              {itinerary.legs.map(
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
            autoFocus={true}
          >
            <Text id="directions.sun">Sun position</Text>
          </Link>
        </footer>
      )}
    </>
  );
}

function ItineraryLeg(props) {
  return (<>
    <dt>
      <Text
        id="directions.legDescription"
        fields={{
          from: props.leg.start.name,
          to: props.leg.end.name,
        }}
      >
        Leg description
      </Text>
    </dt>
    <dd>
      <LegDuration durationInSeconds={props.leg.durationInSeconds} />
    </dd>
  </>)
}

function LegDuration(props) {
  const durationInMinutes = Math.round(props.durationInSeconds / 60);
  if (durationInMinutes > 60) {
    const durationInHours = Math.floor(durationInMinutes / 60)
    return <>{durationInHours}h {durationInMinutes % 60}min</>
  }
  return <>{durationInMinutes}min</>
}
