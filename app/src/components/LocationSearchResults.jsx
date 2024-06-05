import { useEffect, useRef, useState } from 'preact/hooks'
import { Text } from 'preact-i18n'

import { findLocations } from '../services/api'
import { LoadingIndicator } from './LoadingIndicator'
import { ErrorMessage } from './ErrorMessage'

import './LocationSearchResults.css'

export function LocationSearchResults(props) {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [searchResults, setSearchResults] = useState()
  const displayedResultsRef = useRef()

  const search = () => {
    setSearchResults(undefined)
    setError(undefined)

    if (!props.query) {
      return
    }

    setLoading(true)
    findLocations(props.query)
      .then(setSearchResults, setError)
      .finally(() => setLoading(false))
  }

  useEffect(search, [props.query, props.sid])

  useEffect(() => {
    if (!displayedResultsRef.current) return
    displayedResultsRef.current.focus()
  }, [displayedResultsRef.current])

  const selectResult = (event) => {
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) return

    const selectedResult = document.querySelector('input[name="selected-result"]:checked')
    if (!selectedResult) return

    const result = searchResults[Number(selectedResult.value)]
    props.onSelect(result)
  }

  return (
    <div id="search-results">
      <LoadingIndicator isLoading={isLoading} />
      <ErrorMessage error={error} onRetry={search} />

      {searchResults && searchResults.length > 0 && (
        <section class="search-results-list" ref={displayedResultsRef} tabIndex={-1}>
          <p>
            <Text id="journey.searchResults" fields={{ query: props.query }}></Text>
          </p>
          <form onSubmit={selectResult}>
            {searchResults.map((result, index) => (
              <label key={"result-" + index}>
                <input type="radio" value={index} name="selected-result" required checked={false} />
                {result.name}
              </label>
            ))}
            <button type="submit" className="btn btn-primary">
              <Text id="journey.selectSearchResult"></Text>
            </button>
          </form>
        </section>
      )}
      {searchResults && searchResults.length < 1 && (
        <section class="search-results-list" ref={displayedResultsRef} tabIndex={-1}>
          <p>
            <Text
              id="journey.searchResultsEmpty"
              fields={{ query: props.query }}
            ></Text>
          </p>
        </section>
      )}
    </div>
  )
}

