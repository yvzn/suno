import { useEffect, useRef, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';

import { findLocations } from '../services/api';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';

import './LocationSearchResults.css';

export function LocationSearchResults(props) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [searchResults, setSearchResults] = useState();
  const firstSearchResultRef = useRef();

  const search = () => {
    setSearchResults(undefined);
    setError(undefined);

    if (!props.query) {
      return;
    }

    setLoading(true);
    findLocations(props.query)
      .then(setSearchResults, setError)
      .finally(() => setLoading(false));
  };

  useEffect(search, [props.query]);

  useEffect(
    () => firstSearchResultRef.current && firstSearchResultRef.current.focus(),
    [firstSearchResultRef.current]
  );

  return (
    <>
      <LoadingIndicator isLoading={isLoading} />
      <ErrorMessage error={error} onRetry={search} />

      {searchResults && searchResults.length > 0 && (
        <section>
          <p>
            <Text id="journey.searchResults" fields={{ query: props.query }}>
              Matching locations
            </Text>
          </p>
          <ul>
            {searchResults.map((result, index) => (
              <li>
                <a
                  href="#"
                  onClick={() => props.onSelect(result)}
                  ref={index === 0 ? firstSearchResultRef : undefined}
                >
                  {result.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {searchResults && searchResults.length < 1 && (
        <section>
          <p>
            <Text
              id="journey.searchResultsEmpty"
              fields={{ query: props.query }}
            >
              No locations
            </Text>
          </p>
        </section>
      )}
    </>
  );
}

