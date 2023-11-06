import { Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { AppTitle } from '../components/AppTitle';

export function Home() {
  return (
    <>
      <header>
        <AppTitle />
      </header>
      <main>
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
