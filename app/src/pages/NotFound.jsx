import { Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { AppTitle } from '../components/AppTitle';

const Title = withText('notFound.title')(AppTitle);

export function NotFound() {
  return (
    <>
      <main>
        <Title />
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
