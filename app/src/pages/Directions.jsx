import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

export function Directions() {
  const [journey, setJourney] = useState();

  useEffect(() => {
    const journey = deserializeJourney(location.search);
    if (!journey.from || !journey.to || !journey.startDate) {
      route('/journey');
    }
    setJourney(journey)
  }, []);

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
        <p>TODO</p>
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
