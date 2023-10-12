import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

export function Sun() {
  const [locationFrom, setLocationFrom] = useState({ name: undefined });
  const [locationTo, setLocationTo] = useState({ name: undefined });
  useEffect(() => {
    const { from, to } = deserializeJourney(location.search);
    if (!from.name || !to.name) {
      route('/journey');
    }
    setLocationFrom(from);
    setLocationTo(to);
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
              from: locationFrom.name,
              to: locationTo.name,
            }}
          >
            Itinerary details
          </Text>
        </p>
        <p>TODO</p>
      </main>
      {locationFrom.name && locationTo.name && (
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
