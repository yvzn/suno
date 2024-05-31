import { Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { PageTitle } from '../components/PageTitle';
import { DocumentTitle } from '../components/DocumentTitle';

const Title = withText('notFound.title')(PageTitle);
const SetDocumentTitle = withText('notFound.title')(DocumentTitle);

export function NotFound() {
  return (
    <>
      <header>
        <Title />
        <SetDocumentTitle />
      </header>
      <main>
        <p>
          <Text id="notFound.message"></Text>
        </p>
      </main>
      <footer>
        <Link href="/" className="btn-primary"><Text id="nav.home"></Text></Link>
      </footer>
    </>
  );
}
