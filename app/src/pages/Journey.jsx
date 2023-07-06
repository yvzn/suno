import { Text, withText } from 'preact-i18n';
import { useState } from 'preact/hooks';

import { LocationInput } from '../components/LocationInput';
import { LocationSearchResults } from '../components/LocationSearchResults';
import './Journey.css';

const InputFrom = withText('journey.from.label')(
  withText('journey.from.placeholder')(LocationInput)
);
const InputTo = withText('journey.to.label')(
  withText('journey.to.placeholder')(LocationInput)
);

export function Journey() {
  const [locationFrom, setLocationFrom] = useState('');
  const [locationTo, setLocationTo] = useState('');

  const [search, setSearch] = useState({});

  const onSubmitLocationFrom = (value) => {
    setLocationFrom(value);
    setSearch({ query: value, target: 'from' });
  };

  const onSubmitLocationTo = (value) => {
    setLocationTo(value);
    setSearch({ query: value, target: 'to' });
  };

  const onSelectLocation = (value) => {
    if (search.target === 'from') {
      setLocationFrom(value.name);
    }
    if (search.target === 'to') {
      setLocationTo(value.name);
    }
    setSearch({});
  };

  return (
    <>
      <main>
        <h1>
          <Text id="journey.title">Directions</Text>
        </h1>
        <InputFrom value={locationFrom} onSubmit={onSubmitLocationFrom} />
        <InputTo value={locationTo} onSubmit={onSubmitLocationTo} />
        <LocationSearchResults
          query={search.query}
          onSelect={onSelectLocation}
        />
      </main>
    </>
  );
}
