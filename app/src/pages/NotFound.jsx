import { Text, withText } from 'preact-i18n';

import { PageTitle } from '../components/PageTitle';
import { DocumentTitle } from '../components/DocumentTitle';
import { CustomLink } from '../components/CustomLink';

const Title = withText('notFound.title')(PageTitle);
const SetDocumentTitle = withText('notFound.title')(DocumentTitle);

export function NotFound() {
  const contactHref = `${import.meta.env.VITE_APP_BASE}/contact.en.html`;

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
        <a href={contactHref} className="btn btn-secondary"><Text id="notFound.contact"></Text></a>
      </footer>
    </>
  );
}
