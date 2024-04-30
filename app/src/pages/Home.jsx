import { Text } from 'preact-i18n';
import { Link } from 'preact-router';

import { AppTitle } from '../components/AppTitle';

export function Home(props) {
  return (
    <>
      <header>
        <AppTitle />
      </header>
      <main>
        <p>
          <Text id="app.tagline"></Text>
        </p>
        {props.children}
      </main>
      <footer>
        <Link href="/journey"><Text id="nav.continue"></Text></Link>
      </footer>
    </>
  );
}
