import { Text, withText } from 'preact-i18n'
import { useRef, useState } from 'preact/hooks'
import { Link } from 'preact-router'

import { LocationInput } from '../components/LocationInput'
import { LocationSearchResults } from '../components/LocationSearchResults'
import { StartDateInput } from '../components/StartDateInput'
import { PageTitle } from '../components/PageTitle'
import { DocumentTitle } from '../components/DocumentTitle'

import { serializeJourney } from '../services/serialize'

import './Journey.css'

const Title = withText('journey.title')(PageTitle)
const SetDocumentTitle = withText('journey.title')(DocumentTitle)
const InputFrom = withText('journey.from.label')(
  withText('journey.from.placeholder')(LocationInput)
)
const InputTo = withText('journey.to.label')(
  withText('journey.to.placeholder')(LocationInput)
)

export function Journey() {
  return (
    <>
      <header>
        <Title aria-describedby="journey-tagline" />
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
  })
  const [locationTo, setLocationTo] = useState({ name: '', coord: undefined })
  const [search, setSearch] = useState({ sid: Math.random() })
  const [startDate, setStartDate] = useState('now')

  const inputToRef = useRef()

  const onChangeLocationFrom = (value) => {
    setLocationFrom({ name: value, coord: undefined })
    setSearch({ sid: Math.random(), query: value, target: 'from' })
  }

  const onChangeLocationTo = (value) => {
    setLocationTo({ name: value, coord: undefined })
    setSearch({ sid: Math.random(), query: value, target: 'to' })
  }

  const onSelectLocation = (value) => {
    if (search.target === 'from') {
      setLocationFrom(value)
      inputToRef.current && inputToRef.current.focus()
    }
    if (search.target === 'to') {
      setLocationTo(value)
    }
    setSearch({ sid: Math.random() })
  }

  const onChangeStartDate = (value) => {
    setStartDate(value)
  }

  return (
    <>
      <main id="journey">
        <section id="journey-tagline">
          <p><Text id="journey.tagline"></Text></p>
        </section>
        <InputFrom
          nameValue={locationFrom.name}
          coordValue={locationFrom.coord}
          onChange={onChangeLocationFrom}
          disabled={search.target === 'to'}
          primary={!locationFrom.coord && !search.target}
        />
        <InputTo
          nameValue={locationTo.name}
          coordValue={locationTo.coord}
          onChange={onChangeLocationTo}
          disabled={search.target === 'from'}
          forwardRef={inputToRef}
          primary={locationFrom.coord && !locationTo.coord && !search.target}
        />
        {locationFrom.coord && locationTo.coord && (
          <StartDateInput
            value={startDate}
            onChange={onChangeStartDate} />
        )}
        <LocationSearchResults
          query={search.query}
          sid={search.sid}
          onSelect={onSelectLocation}
        />
      </main>
      {locationFrom.coord && locationTo.coord && startDate && (
        <footer>
          <Link
            href={'/sun?' + serializeJourney({ from: locationFrom, to: locationTo, startDate })}
            className="btn-primary"
          >
            <Text id="nav.continue"></Text>
          </Link>
        </footer>
      )}
    </>
  )
}
