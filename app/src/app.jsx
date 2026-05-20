import { IntlProvider } from 'preact-i18n'
import { Router } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'

import { Home } from './pages/Home'
import { Journey } from './pages/Journey'
import { Sun } from './pages/Sun'
import { Directions } from './pages/Directions'
import { NotFound } from './pages/NotFound'
import { Contact } from './pages/Contact'
import { healthCheck } from './services/api'
import { customRoute } from './services/router'
import { LanguagePicker } from './components/LanguagePicker'
import { LanguageContext } from './context/language'

export function App(props) {
  const [language, setLanguage] = useState(props.language)
  const [translations, setTranslations] = useState(definitions(props.language))

  useEffect(() => {
    healthCheck()
  }, [])

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    setTranslations(definitions(newLanguage))
    document.documentElement.setAttribute("lang", newLanguage)
    customRoute('/')
  }

  return (
    <>
      <LanguageContext.Provider value={language}>
        <IntlProvider definition={translations}>
          <Router>
            <Home path={`${import.meta.env.VITE_APP_BASE}/`}>
              <LanguagePicker value={language} onChange={handleLanguageChange} />
            </Home>
            <Journey path={`${import.meta.env.VITE_APP_BASE}/journey`} />
            <Sun path={`${import.meta.env.VITE_APP_BASE}/sun`} />
            <Directions path={`${import.meta.env.VITE_APP_BASE}/directions`} />
            <Contact path={`${import.meta.env.VITE_APP_BASE}/contact`} />
            <NotFound default />
          </Router>
        </IntlProvider>
      </LanguageContext.Provider>
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