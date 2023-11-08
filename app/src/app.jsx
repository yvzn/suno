import { IntlProvider } from 'preact-i18n';
import { Router } from 'preact-router';
import { useEffect } from 'preact/hooks';

import { Home } from './pages/Home';
import { CookieConsent } from './pages/CookieConsent';
import { Journey } from './pages/Journey';
import { Sun } from './pages/Sun';
import { Directions } from './pages/Directions';
import { NotFound } from './pages/NotFound';
import { healthCheck } from './services/api';

import definition from './i18n/en.json';


import './app.css';

export function App() {
  useEffect(() => {
    healthCheck();
  }, [])

  return (
    <>
      <IntlProvider definition={definition}>
        <Router>
          <Home path="/" />
          <CookieConsent path="/cookie-consent" />
          <Journey path="/journey" />
          <Sun path="/sun" />
          <Directions path="/directions" />
          <NotFound default />
        </Router>
      </IntlProvider>
    </>
  );
}
