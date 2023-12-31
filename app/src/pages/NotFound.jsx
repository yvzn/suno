import { Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { AppTitle } from '../components/AppTitle';

const Title = withText('notFound.title')(AppTitle);

export function NotFound() {
  return (
    <>
      <header>
        <Title />
      </header>
      <main>
        <p>
          <Text id="notFound.message"></Text>
        </p>
      </main>
      <footer>
        <Link href="/"><Text id="nav.home"></Text></Link>
      </footer>
    </>
  );
}
