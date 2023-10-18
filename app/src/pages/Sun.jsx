import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

import { SunPositionChart } from '../components/SunPositionChart';
import { getDirections } from '../services/api';
import { computeSunPositions } from "../services/sun-position";

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
      <main>
        <h1>
          <Text id="sun.title">Sun position</Text>
        </h1>
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
        {isLoading && (
          <section>
            <Text id="fetch.loading">Loading...</Text>
          </section>
        )}
        {error && (
          <section>
            <p>
              <Text id="fetch.error">Error</Text>
            </p>
            <a href="#" onClick={fetchItinerary}>
              <Text id="fetch.retry">Retry</Text>
            </a>
          </section>
        )}
        {sunPosition && <SunPositionChart positions={sunPosition} />}
      </main>
      {journey && (
        <footer>
          <Link
            href={'/directions' + window.location.search}
            autoFocus={true}
          >
            <Text id="sun.directions">Directions</Text>
          </Link>
        </footer>
      )}
    </>
  );
}

function dateFormat(date) {
  if (date instanceof Date) {
    return 'at ' + new Intl.DateTimeFormat([], { dateStyle: 'short', timeStyle: 'short' }).format(date);
  }
  return date;
}