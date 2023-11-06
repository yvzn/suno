import { Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { PageTitle } from '../components/PageTitle';

const Title = withText('cookie.title')(PageTitle);

export function CookieConsent() {
  return (
    <>
      <main>
        <Title />
        <p>
          <Text id="cookie.advisory">This website is using cookies</Text>
        </p>
      </main>
      <footer>
        <Link href="/journey"><Text id="cookie.accept">Accept</Text></Link>
      </footer>
    </>
  );
}
