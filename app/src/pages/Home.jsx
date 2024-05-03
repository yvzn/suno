import { MarkupText, Text, withText } from 'preact-i18n';
import { Link } from 'preact-router';

import { AppTitle } from '../components/AppTitle';

const Title = withText('home.title')(AppTitle);

export function Home(props) {
  return (
    <>
      <header>
        <Title />
      </header>
      <main id="home">
        <MarkupText id="home.content"></MarkupText>
        {props.children}
      </main>
      <footer>
        <Link href="/journey"><Text id="home.continue"></Text></Link>
      </footer>
    </>
  );
}
