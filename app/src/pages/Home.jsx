import { MarkupText, Text, withText } from 'preact-i18n';

import { DocumentTitle } from '../components/DocumentTitle';
import { CustomLink } from '../components/CustomLink';

import './Home.css';

const SetDocumentTitle = withText('home.title')(DocumentTitle);

export function Home(props) {
  const contactHref = `${import.meta.env.VITE_APP_BASE}/contact.${props.language === 'fr' ? 'fr' : 'en'}.html`;

  return (
    <>
      <header>
        <h1>
          <Text id="home.titleLong" />
        </h1>
        <SetDocumentTitle />
      </header>
      <main id="home">
        <MarkupText id="home.content"></MarkupText>
        {props.children}
      </main>
      <footer id="home-footer">
        <CustomLink href="/journey" className="btn btn-primary pulse"><Text id="home.continue"></Text></CustomLink>
        <a href={contactHref} className="btn btn-secondary"><Text id="home.contact"></Text></a>
      </footer>
    </>
  );
}
