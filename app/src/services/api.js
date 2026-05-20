import { serializeJourney } from "./serialize"

const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY || localStorage.getItem('apiKey')
const DEFAULT_TIMEOUT = 30_000
const RETRY_TIMEOUT_FACTOR = 2

/**
 * Maps frontend language codes to Azure Maps language codes.
 * Azure Maps requires full locale codes (e.g. 'en-US') while the app
 * uses short codes (e.g. 'en').
 */
const AZURE_MAPS_LANGUAGE_MAP = {
  'en': 'en-US',
  'fr': 'fr-FR',
}

/**
 * Returns the Azure Maps language code for a given frontend language code.
 * Returns undefined for unknown or missing language codes.
 * @param {string} [language]
 * @returns {string|undefined}
 */
function toAzureMapsLanguage(language) {
  return AZURE_MAPS_LANGUAGE_MAP[language]
}

function createFindLocationsApi(timeout) {
  return async function(searchQuery, language) {
    const params = new URLSearchParams()
    params.set("code", apiKey)
    params.set("q", searchQuery)
    const azureMapsLanguage = toAzureMapsLanguage(language)
    if (azureMapsLanguage) {
      params.set("lang", azureMapsLanguage)
    }

    const response = await httpGet(`${apiUrl}/geocoding?${params.toString()}`, timeout)

    const json = await response.json()
    return json.results
  }
}

const findLocationsApi = createFindLocationsApi(DEFAULT_TIMEOUT)
const findLocationsApiWithRetry = createFindLocationsApi(DEFAULT_TIMEOUT * RETRY_TIMEOUT_FACTOR)

function createGetDirectionsApi(timeout) {
  return async function({ from, to, startDate }, language) {
    const params = serializeJourney({ from, to, startDate })
    params.set("code", apiKey)
    const azureMapsLanguage = toAzureMapsLanguage(language)
    if (azureMapsLanguage) {
      params.set("lang", azureMapsLanguage)
    }

    const response = await httpGet(`${apiUrl}/directions?${params.toString()}`, timeout)

    const json = await response.json()
    return json
  }
}

const getDirectionsApi = createGetDirectionsApi(DEFAULT_TIMEOUT)
const getDirectionsApiWithRetry = createGetDirectionsApi(DEFAULT_TIMEOUT * RETRY_TIMEOUT_FACTOR)

async function healthCheckApi() {
  const params = new URLSearchParams()
  params.set("code", apiKey)

  const response = await httpGet(`${apiUrl}/health?${params.toString()}`)

  const json = await response.json()
  return json
}

function createSendFeedbackApi(timeout) {
  return async function({ score, comment, technicalData, userAgent, sourceUrl }) {
    const params = new URLSearchParams()
    params.set("code", apiKey)

    const body = new URLSearchParams()
    body.set("s", score)
    if (comment) body.set("c", comment)
    if (technicalData) body.set("d", technicalData)
    if (userAgent) body.set("a", userAgent)
    if (sourceUrl) body.set("u", sourceUrl)

    return httpPost(`${apiUrl}/feedback?${params.toString()}`, body.toString(), timeout)
  }
}

const sendFeedbackApi = createSendFeedbackApi(DEFAULT_TIMEOUT)
const sendFeedbackApiWithRetry = createSendFeedbackApi(DEFAULT_TIMEOUT * RETRY_TIMEOUT_FACTOR)

function httpGet(url, timeout = DEFAULT_TIMEOUT) {
  return fetchWithTimeout('GET', url, undefined, timeout);
}

function httpPost(url, body, timeout = DEFAULT_TIMEOUT) {
  return fetchWithTimeout('POST', url, body, timeout);
}

function fetchWithTimeout(method, resource, body, timeout) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const init = { method, signal: controller.signal };
  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    init.body = body;
  }
  return fetch(resource, init).finally(() => clearTimeout(id));
}

export { findLocationsApi as findLocations, findLocationsApiWithRetry as findLocationsWithRetry, getDirectionsApi as getDirections, getDirectionsApiWithRetry as getDirectionsWithRetry, healthCheckApi as healthCheck, sendFeedbackApi as sendFeedback, sendFeedbackApiWithRetry as sendFeedbackWithRetry }
