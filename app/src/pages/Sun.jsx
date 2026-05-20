import { useEffect, useState } from 'preact/hooks';
import { Text, withText } from 'preact-i18n';
import { deserializeJourney } from '../services/serialize';

import { SunPositionChart } from '../components/SunPositionChart';
import { SunPositionTable } from '../components/SunPositionTable';
import { SunDurationTable } from '../components/SunDurationTable';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageTitle } from '../components/PageTitle';
import { DocumentTitle } from '../components/DocumentTitle';
import { ItinerarySummary } from '../components/ItinerarySummary';
import { CustomLink } from '../components/CustomLink';
import { HomeLink } from '../components/HomeLink';

import { getDirections, getDirectionsWithRetry } from '../services/api';
import { computeSunPositions } from "../services/sun-position";
import { aggregateSunPositions, computeTotalDuration, computeDurationWithSun } from '../services/table';
import { customRoute } from '../services/router'

const Title = withText('sun.title')(PageTitle);
const SetDocumentTitle = withText('sun.title')(DocumentTitle);

export function Sun() {
  const [journey, setJourney] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [itinerary, setItinerary] = useState();
  const [sunPositions, setSunPositions] = useState();

  useEffect(() => {
    const journey = deserializeJourney(location.search);
    if (!journey.from || !journey.to || !journey.startDate) {
      customRoute('/journey');
    }
    setJourney(journey)
  }, []);

  const fetchItinerary = (fetchFn = getDirections) => {
    if (!journey) return;
    setError(undefined);
    setLoading(true);
    fetchFn(journey)
      .then(setItinerary, setError)
      .finally(() => setLoading(false));
  }

  useEffect(fetchItinerary, [journey]);

  useEffect(() => {
    if (!itinerary) return;
    const positions = computeSunPositions(itinerary, journey.startDate)
    setSunPositions(positions);
  }, [itinerary]);

  const fetchItineraryWithRetry = () => fetchItinerary(getDirectionsWithRetry);

  return (
    <>
      <header>
        <Title aria-describedby="sun-tagline" />
        <SetDocumentTitle />
        <HomeLink />
      </header>
      <main id="sun">
        <section id="sun-tagline">
          <p><Text id="sun.tagline"></Text></p>
        </section>

        <ItinerarySummary
          from={journey?.from?.name}
          to={journey?.to?.name}
          startDate={journey?.startDate} />

        <LoadingIndicator isLoading={isLoading} />
        <ErrorMessage error={error} onRetry={fetchItineraryWithRetry} />

        {sunPositions && <SunPositionChart positions={sunPositions} />}
        {sunPositions && <SunPositionTable positions={aggregateSunPositions(sunPositions)} />}
        {sunPositions && itinerary && (
          <SunDurationTable
            totalDurationInSeconds={computeTotalDuration(itinerary)}
            durationWithSunInSeconds={computeDurationWithSun(sunPositions)}
          />
        )}
      </main>
      {journey && itinerary && (
        <footer>
          <CustomLink
            href={'/directions' + window.location.search}
            className="btn btn-secondary"
          >
            <Text id="sun.directions"></Text>
          </CustomLink>
        </footer>
      )}
    </>
  );
}
