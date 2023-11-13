import { Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { AppTitle } from '../components/AppTitle';

const Title = withText('cookie.title')(AppTitle);

export function CookieConsent() {
  return (
    <>
      <header>
        <Title />
      </header>
      <main>
        <p>
          <Text id="cookie.advisory"></Text>
        </p>
      </main>
      <footer>
        <Link href="/journey"><Text id="cookie.accept"></Text></Link>
      </footer>
    </>
  );
}
