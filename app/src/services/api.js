import { serializeJourney } from "./serialize"

const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY || localStorage.getItem('apiKey')

async function findLocationsApi(searchQuery) {
  const params = new URLSearchParams()
  params.set("code", apiKey)
  params.set("q", searchQuery)

  const response = await httpGet(`${apiUrl}/geocoding?${params.toString()}`)

  const json = await response.json()
  return json.results
}

function findLocationsMock(searchQuery) {
  const Nantes = {
    name: 'Nantes',
    coord: {
      lat: 47.2292,
      lon: -1.547,
    },
  }

  const Angers = {
    name: 'Angers',
    coord: {
      lat: 47.4736,
      lon: -0.5548,
    },
  }

  const Paris = {
    name: 'Paris',
    coord: {
      lat: 48.8566,
      lon: 2.3511,
    },
  }

  const results = [Nantes, Angers, Paris]

  if (searchQuery && searchQuery.indexOf("slow") > -1) {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(results)
      }, 2_000)
    })
  }

  return Promise.resolve(results)
}

async function getDirectionsApi({ from, to, startDate }) {
  const params = serializeJourney({ from, to, startDate })
  params.set("code", apiKey)

  const response = await httpGet(`${apiUrl}/directions?${params.toString()}`)

  const json = await response.json()
  return json
}

function getDirectionsMock(_journey) {
  const Nantes = {
    name: 'Nantes',
    coord: {
      lat: 47.2292,
      lon: -1.547,
    },
  }

  const Angers = {
    name: 'Angers',
    coord: {
      lat: 47.4736,
      lon: -0.5548,
    },
  }

  const Paris = {
    name: 'Paris',
    coord: {
      lat: 48.8566,
      lon: 2.3511,
    },
  }

  const results = {
    legs: [
      {
        start: Nantes,
        end: Angers,
        durationInSeconds: 3600
      },
      {
        start: Angers,
        end: Paris,
        durationInSeconds: 12600
      }
    ]
  }
  return Promise.resolve(results)
}

async function healthCheckApi() {
  const params = new URLSearchParams()
  params.set("code", apiKey)

  const response = await httpGet(`${apiUrl}/health?${params.toString()}`)

  const json = await response.json()
  return json
}

async function healthCheckMock() {
  return Promise.resolve({healthy: true, timestamp: new Date().toISOString()})
}

function httpGet(url) {
  return fetchWithTimeout(url, 30_000);
}

function fetchWithTimeout(resource, timeout) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, { signal: controller.signal }).finally(() => clearTimeout(id));
}

// export { findLocationsApi as findLocations, getDirectionsApi as getDirections, healthCheckApi as healthCheck }
// export { findLocationsMock as findLocations, getDirectionsMock as getDirections, healthCheckMock as healthCheck }

export { findLocationsApi as findLocations, getDirectionsApi as getDirections, healthCheckApi as healthCheck }
