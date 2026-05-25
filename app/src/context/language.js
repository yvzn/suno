import { createContext } from 'preact'

/**
 * Context that holds the currently active language code (e.g. 'en', 'fr').
 * Provided by the root App component; consumed by any component that needs
 * to pass the language to backend APIs.
 */
export const LanguageContext = createContext('en')
