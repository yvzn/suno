import { Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { PageTitle } from '../components/PageTitle';

const Title = withText('app.title')(PageTitle);

export function Home() {
  return (
    <>
      <main>
        <Title />
        <p>
          <Text id="app.tagline">Welcome</Text>
        </p>
      </main>
      <footer>
        <Link href="/cookie-consent"><Text id="nav.continue">Continue</Text></Link>
      </footer>
    </>
  );
}
