import { Text, withText } from 'preact-i18n';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router';

import { LocationInput } from '../components/LocationInput';
import { LocationSearchResults } from '../components/LocationSearchResults';
import { serializeJourney } from '../services/serialize';
import './Journey.css';

const InputFrom = withText('journey.from.label')(
  withText('journey.from.placeholder')(LocationInput)
);
const InputTo = withText('journey.to.label')(
  withText('journey.to.placeholder')(LocationInput)
);

export function Journey() {
  const [locationFrom, setLocationFrom] = useState({
    name: '',
    coord: undefined,
  });
  const [locationTo, setLocationTo] = useState({ name: '', coord: undefined });
  const [search, setSearch] = useState({});

  const onChangeLocationFrom = (value) => {
    setLocationFrom({ name: value, coord: undefined });
    setSearch({ query: value, target: 'from' });
  };

  const onChangeLocationTo = (value) => {
    setLocationTo({ name: value, coord: undefined });
    setSearch({ query: value, target: 'to' });
  };

  const onSelectLocation = (value) => {
    if (search.target === 'from') {
      setLocationFrom(value);
    }
    if (search.target === 'to') {
      setLocationTo(value);
    }
    setSearch({});
  };

  return (
    <>
      <main>
        <h1>
          <Text id="journey.title">Directions</Text>
        </h1>
        <InputFrom
          nameValue={locationFrom.name}
          coordValue={locationFrom.coord}
          onChange={onChangeLocationFrom}
          autoFocus={!locationFrom.coord}
        />
        <InputTo
          nameValue={locationTo.name}
          coord={locationTo.coord}
          onChange={onChangeLocationTo}
          autoFocus={locationFrom.coord && !locationTo.coord}
        />
        <LocationSearchResults
          query={search.query}
          onSelect={onSelectLocation}
        />
      </main>
      {locationFrom.coord && locationTo.coord && (
        <footer>
          <Link
            href={'/directions?' + serializeJourney(locationFrom, locationTo)}
            autoFocus={true}
          >
            <Text id="nav.continue">Continue</Text>
          </Link>
        </footer>
      )}
    </>
  );
}
