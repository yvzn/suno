import { useEffect, useState } from 'preact/hooks';
import { Text, withText } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

import { SunPositionChart } from '../components/SunPositionChart';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { AppTitle } from '../components/AppTitle';
import { getDirections } from '../services/api';
import { computeSunPositions } from "../services/sun-position";

const Title = withText('sun.title')(AppTitle);

export function Sun() {
  const [journey, setJourney] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [itinerary, setItinerary] = useState();
  const [sunPosition, setSunPosition] = useState();

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

  useEffect(() => {
    if (!itinerary) return;
    const positions = computeSunPositions(itinerary, journey.startDate)
    setSunPosition(positions);
  }, [itinerary]);

  return (
    <>
      <header>
        <Title />
      </header>
      <main id="sun" aria-live="polite">
        <p>
          <Text
            id="sun.message"
            fields={{
              from: journey?.from?.name,
              to: journey?.to?.name,
              startDate: dateFormat(journey?.startDate)
            }}
          >
            Itinerary details
          </Text>
        </p>

        <LoadingIndicator isLoading={isLoading} />
        <ErrorMessage error={error} onRetry={fetchItinerary} />

        {sunPosition && <SunPositionChart positions={sunPosition} />}
      </main>
      <footer>
        <Link
          href={'/journey' + window.location.search}
        >
          <Text id="sun.editJourney">Edit</Text>
        </Link>
        <Link
          href={'/directions' + window.location.search}
        >
          <Text id="sun.directions">Directions</Text>
        </Link>
      </footer>
    </>
  );
}

function dateFormat(date) {
  if (date instanceof Date) {
    return 'at ' + new Intl.DateTimeFormat([], { dateStyle: 'short', timeStyle: 'short' }).format(date);
  }
  return date;
}