import { Text, withText } from 'preact-i18n';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router';

import { LocationInput } from '../components/LocationInput';
import { LocationSearchResults } from '../components/LocationSearchResults';
import { StartDateInput } from '../components/StartDateInput';
import { PageTitle } from '../components/PageTitle';
import { DocumentTitle } from '../components/DocumentTitle';

import { serializeJourney } from '../services/serialize';

const Title = withText('journey.title')(PageTitle);
const SetDocumentTitle = withText('journey.title')(DocumentTitle);
const InputFrom = withText('journey.from.label')(
  withText('journey.from.placeholder')(
    withText('journey.from.tooltip')(LocationInput)
  )
);
const InputTo = withText('journey.to.label')(
  withText('journey.to.placeholder')(
    withText('journey.to.tooltip')(LocationInput)
  )
);

export function Journey() {
  return (
    <>
      <header>
        <Title />
        <SetDocumentTitle />
      </header>
      <JourneyForm />
    </>
  )
}

function JourneyForm() {
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
      <main id="journey">
        <section>
          <p><Text id="journey.tagline"></Text></p>
        </section>
        <InputFrom
          nameValue={locationFrom.name}
          coordValue={locationFrom.coord}
          onChange={onChangeLocationFrom}
          disabled={search.target === 'to'}
        />
        <InputTo
          nameValue={locationTo.name}
          coordValue={locationTo.coord}
          onChange={onChangeLocationTo}
          disabled={search.target === 'from'}
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
            href={'/sun?' + serializeJourney({ from: locationFrom, to: locationTo, startDate })}
          >
            <Text id="nav.continue"></Text>
          </Link>
        </footer>
      )}
    </>
  );
}
