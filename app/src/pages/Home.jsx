import { Text } from 'preact-i18n';
import { Link } from 'preact-router';

export function Home() {
  return (
    <>
      <main>
        <h1>
          <Text id="app.title">Suno</Text>
        </h1>
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
