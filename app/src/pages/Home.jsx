import { MarkupText, Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { DocumentTitle } from '../components/DocumentTitle';

const SetDocumentTitle = withText('home.title')(DocumentTitle);

export function Home(props) {
  return (
    <>
      <header>
        <h1><Text id="home.titleLong" /></h1>
        <SetDocumentTitle />
      </header>
      <main id="home">
        <MarkupText id="home.content"></MarkupText>
        {props.children}
      </main>
      <footer>
        <Link href="/journey" className="btn btn-primary pulse"><Text id="home.continue"></Text></Link>
      </footer>
    </>
  );
}
