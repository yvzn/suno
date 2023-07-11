import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';
import { Link, route } from 'preact-router';

export function Directions() {
  const [locationFrom, setLocationFrom] = useState({ name: undefined });
  const [locationTo, setLocationTo] = useState({ name: undefined });
  useEffect(() => {
    const searchParams = (location.search || '').replace(/^\?/, '');
    const { from, to } = deserializeJourney(searchParams);
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
          <Text id="directions.title">Directions</Text>
        </h1>
        <p>
          <Text
            id="directions.message"
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
      {locationFrom.coord && locationTo.coord && (
        <footer>
          <Link
            href={'/sun' + location.search}
            autoFocus={true}
          >
            <Text id="nav.continue">Continue</Text>
          </Link>
        </footer>
      )}
    </>
  );
}
