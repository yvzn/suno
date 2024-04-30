import { IntlProvider } from 'preact-i18n'
import { Router, route } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'

import { Home } from './pages/Home'
import { Journey } from './pages/Journey'
import { Sun } from './pages/Sun'
import { Directions } from './pages/Directions'
import { NotFound } from './pages/NotFound'
import { healthCheck } from './services/api'
import { LanguagePicker } from './components/LanguagePicker'

import './app.css'

export function App(props) {
  const [translations, setTranslations] = useState(definitions(props.language))

  useEffect(() => {
    healthCheck()
  }, [])

  const handleLanguageChange = (language) => {
    setTranslations(definitions(language))
    document.documentElement.setAttribute("lang", language)
    route('/')
  }

  return (
    <>
      <IntlProvider definition={translations}>
        <Router>
          <Home path="/">
            <LanguagePicker onChange={handleLanguageChange} />
          </Home>
          <Journey path="/journey" />
          <Sun path="/sun" />
          <Directions path="/directions" />
          <NotFound default />
        </Router>
      </IntlProvider>
    </>
  )
}

import english from './i18n/en.json'
import french from './i18n/fr.json'

function definitions(language) {
  if (language === 'fr') {
    return french
  }
  return english
}