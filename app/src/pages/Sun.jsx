import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

import { SunPositionChart } from '../components/SunPositionChart';

export function Sun() {
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
        {journey && <SunPositionChart journey={journey} />}
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
    return 'at ' + date.toLocaleDateString();
  }
  return date;
}