import { IntlProvider } from 'preact-i18n';
import { Router } from 'preact-router';

import { Home } from './pages/Home';
import { CookieConsent } from './pages/CookieConsent';
import { Journey } from './pages/Journey';
import { Directions } from './pages/Directions';
import { NotFound } from './pages/NotFound';

import definition from './i18n/en.json';

import './app.css';

export function App() {
  return (
    <>
      <IntlProvider definition={definition}>
        <Router>
          <Home path="/" />
          <CookieConsent path="/cookie-consent" />
          <Journey path="/journey" />
          <Directions path="/directions" />
          <NotFound default />
        </Router>
      </IntlProvider>
    </>
  );
}
