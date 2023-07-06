import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';

import { findLocations } from '../services/api';

import './LocationSearchResults.css';

export function LocationSearchResults(props) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [searchResults, setSearchResults] = useState();

  const search = () => {
    if (!props.query) {
      setLoading(false);
      setSearchResults(undefined);
      return;
    }

    setLoading(true);
    findLocations(props.query)
      .then(setSearchResults)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(search, [props.query]);

  return (
    <>
      {isLoading && (
        <section>
          <Text id="nav.loading">Loading...</Text>
        </section>
      )}
      {error && (
        <section>
          <p>{error.toString()}</p>
          <a href="#" onClick={search}>
            <Text id="nav.retry">Retry</Text>
          </a>
        </section>
      )}
      {searchResults && (
        <section>
          <p>
            <Text id="journey.searchResults" fields={{ query: props.query }}>
              Matching locations
            </Text>
          </p>
          <ul>
            {searchResults.map((result) => (
              <li>
                <a href="#" onClick={() => props.onSelect(result)}>
                  {result.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
