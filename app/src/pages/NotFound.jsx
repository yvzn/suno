import { Text } from 'preact-i18n';
import { Link } from 'preact-router';

export function NotFound() {
  return (
    <>
      <main>
        <h1>
          <Text id="notFound.title">Suno</Text>
        </h1>
        <p>
          <Text id="notFound.message">Not found</Text>
        </p>
      </main>
      <footer>
        <Link href="/"><Text id="nav.home">Home page</Text></Link>
      </footer>
    </>
  );
}
