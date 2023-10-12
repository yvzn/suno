import { Text, withText } from 'preact-i18n';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router';

import { LocationInput } from '../components/LocationInput';
import { LocationSearchResults } from '../components/LocationSearchResults';
import { StartDateInput } from '../components/StartDateInput';
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
  const [startDate, setStartDate] = useState('now');

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

  const onChangeStartDate = (value) => {
    setStartDate(value);
  }

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
        {locationFrom.coord && locationTo.coord && (
          <StartDateInput
            value={startDate}
            onChange={onChangeStartDate} />
        )}
        <LocationSearchResults
          query={search.query}
          onSelect={onSelectLocation}
        />
      </main>
      {locationFrom.coord && locationTo.coord && startDate && (
        <footer>
          <Link
            href={'/sun?' + serializeJourney(locationFrom, locationTo, startDate)}
            autoFocus={true}
          >
            <Text id="nav.continue">Continue</Text>
          </Link>
        </footer>
      )}
    </>
  );
}
