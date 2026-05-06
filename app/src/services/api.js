import { serializeJourney } from "./serialize"

const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY || localStorage.getItem('apiKey')
const DEFAULT_TIMEOUT = 30_000
const RETRY_TIMEOUT_FACTOR = 2

function createFindLocationsApi(timeout) {
  return async function(searchQuery) {
    const params = new URLSearchParams()
    params.set("code", apiKey)
    params.set("q", searchQuery)

    const response = await httpGet(`${apiUrl}/geocoding?${params.toString()}`, timeout)

    const json = await response.json()
    return json.results
  }
}

const findLocationsApi = createFindLocationsApi(DEFAULT_TIMEOUT)
const findLocationsApiWithRetry = createFindLocationsApi(DEFAULT_TIMEOUT * RETRY_TIMEOUT_FACTOR)

function createGetDirectionsApi(timeout) {
  return async function({ from, to, startDate }) {
    const params = serializeJourney({ from, to, startDate })
    params.set("code", apiKey)

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

function httpGet(url, timeout = DEFAULT_TIMEOUT) {
  return fetchWithTimeout(url, timeout);
}

function fetchWithTimeout(resource, timeout) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, { signal: controller.signal }).finally(() => clearTimeout(id));
}

export { findLocationsApi as findLocations, findLocationsApiWithRetry as findLocationsWithRetry, getDirectionsApi as getDirections, getDirectionsApiWithRetry as getDirectionsWithRetry, healthCheckApi as healthCheck, sendFeedbackApi as sendFeedback }

async function sendFeedbackApi({ score, comment, technicalData }) {
  const params = new URLSearchParams()
  params.set("code", apiKey)

  const body = new URLSearchParams()
  body.set("s", score)
  if (comment) body.set("c", comment)
  if (technicalData) body.set("d", technicalData)

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  return fetch(`${apiUrl}/feedback?${params.toString()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    signal: controller.signal
  }).finally(() => clearTimeout(id));
}
