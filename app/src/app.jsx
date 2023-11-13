import { IntlProvider } from 'preact-i18n';
import { Router, route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';

import { Home } from './pages/Home';
import { CookieConsent } from './pages/CookieConsent';
import { Journey } from './pages/Journey';
import { Sun } from './pages/Sun';
import { Directions } from './pages/Directions';
import { NotFound } from './pages/NotFound';
import { healthCheck } from './services/api';
import { LanguagePicker } from './components/LanguagePicker';

import english from './i18n/en.json';
import french from './i18n/fr.json';

import './app.css';

export function App() {
  const [translations, setTranslations] = useState(english);

  useEffect(() => {
    healthCheck();
  }, [])

  const handleLanguageChange = async (language) => {
    if (language === 'fr') {
      setTranslations(french);
      document.documentElement.setAttribute("lang", 'fr');
      route('/');
    } else {
      setTranslations(english);
      document.documentElement.setAttribute("lang", 'en');
      route('/');
    }
  }

  return (
    <>
      <IntlProvider definition={translations}>
        <Router>
          <Home path="/">
            <LanguagePicker onChange={handleLanguageChange} />
          </Home>
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

