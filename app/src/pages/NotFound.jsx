import { Text, withText } from 'preact-i18n';

import { PageTitle } from '../components/PageTitle';
import { DocumentTitle } from '../components/DocumentTitle';
import { CustomLink } from '../components/CustomLink';

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
        <CustomLink href="/" className="btn btn-primary"><Text id="notFound.home"></Text></CustomLink>
      </footer>
    </>
  );
}
