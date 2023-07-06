import { Text } from 'preact-i18n';
import { Link } from 'preact-router';

export function CookieConsent() {
  return (
    <>
      <main>
        <h1>
          <Text id="cookie.title">Cookies</Text>
        </h1>
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
