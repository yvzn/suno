import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const PORT = 7071

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(bodyParser.urlencoded({ extended: false }))

// --- Helpers ---

const SLOW_DELAY_MS = 2_000

function hasKeyword(req, keyword) {
  const q = req.query.q ?? ''
  const f = req.query.f ?? ''
  const c = req.body?.c ?? ''
  return q.includes(keyword) || f.includes(keyword) || c.includes(keyword)
}

async function applyBehaviours(req, res) {
  if (hasKeyword(req, 'error')) {
    res.status(500).json({ error: 'Simulated server error (keyword: error)' })
    return false
  }
  if (hasKeyword(req, 'slow')) {
    await new Promise(resolve => setTimeout(resolve, SLOW_DELAY_MS))
  }
  return true
}

// --- Mock data ---

const LOCATIONS = [
  { name: 'Nantes, Pays de la Loire, France',          coord: { lat: 47.2292, lon: -1.5470 } },
  { name: 'Angers, Pays de la Loire, France',          coord: { lat: 47.4736, lon: -0.5548 } },
  { name: 'Le Mans, Pays de la Loire, France',         coord: { lat: 48.0061, lon:  0.1996 } },
  { name: 'Tours, Centre-Val de Loire, France',        coord: { lat: 47.3941, lon:  0.6848 } },
  { name: 'Orléans, Centre-Val de Loire, France',      coord: { lat: 47.9029, lon:  1.9039 } },
  { name: 'Paris, Île-de-France, France',              coord: { lat: 48.8566, lon:  2.3511 } },
  { name: 'Lyon, Auvergne-Rhône-Alpes, France',        coord: { lat: 45.7640, lon:  4.8357 } },
  { name: 'Marseille, Provence-Alpes-Côte d\'Azur, France', coord: { lat: 43.2965, lon:  5.3698 } },
  { name: 'Toulouse, Occitanie, France',               coord: { lat: 43.6047, lon:  1.4442 } },
  { name: 'Bordeaux, Nouvelle-Aquitaine, France',      coord: { lat: 44.8378, lon: -0.5792 } },
  { name: 'Rennes, Bretagne, France',                  coord: { lat: 48.1173, lon: -1.6778 } },
  { name: 'Strasbourg, Grand Est, France',             coord: { lat: 48.5734, lon:  7.7521 } },
  { name: 'Lille, Hauts-de-France, France',            coord: { lat: 50.6292, lon:  3.0573 } },
  { name: 'Nice, Provence-Alpes-Côte d\'Azur, France', coord: { lat: 43.7102, lon:  7.2620 } },
]

function filterLocations(query) {
  if (!query) return LOCATIONS
  const q = query.toLowerCase()
  const matches = LOCATIONS.filter(l => l.name.split(',')[0].toLowerCase().includes(q))
  return matches.length ? matches : LOCATIONS
}

function buildDirectionsResponse(req) {
  const fromName = req.query.f  ?? 'Origin'
  const fromLat  = parseFloat(req.query.fa ?? 47.2292)
  const fromLon  = parseFloat(req.query.fo ?? -1.5470)
  const toName   = req.query.t  ?? 'Destination'
  const toLat    = parseFloat(req.query.ta ?? 48.8566)
  const toLon    = parseFloat(req.query.to ?? 2.3511)

  // Pick 4 intermediate waypoints for a 5-leg route
  const waypoints = LOCATIONS
    .filter(l => !l.name.startsWith(fromName) && !l.name.startsWith(toName))
    .slice(0, 4)

  const stops = [
    { name: fromName, coord: { lat: fromLat, lon: fromLon } },
    ...waypoints,
    { name: toName, coord: { lat: toLat, lon: toLon } },
  ]

  const durations = [3_600, 2_400, 5_400, 1_800, 7_200]

  return {
    legs: stops.slice(0, -1).map((stop, i) => ({
      start: stop,
      end: stops[i + 1],
      durationInSeconds: durations[i] ?? 3_600,
    })),
  }
}

// --- Routes ---

app.get('/api/geocoding', async (req, res) => {
  if (!await applyBehaviours(req, res)) return
  const results = filterLocations(req.query.q)
  res.json({ results })
})

app.get('/api/directions', async (req, res) => {
  if (!await applyBehaviours(req, res)) return
  res.json(buildDirectionsResponse(req))
})

app.get('/api/health', async (_req, res) => {
  res.json({ healthy: true, timestamp: new Date().toISOString() })
})

app.post('/api/feedback', async (req, res) => {
  if (!await applyBehaviours(req, res)) return
  
  const score = req.body.s
  
  if (!score) {
    res.status(400).json({ error: 'Missing required parameter: s (score).' })
    return
  }
  
  res.status(201).json({
    success: true,
    message: 'Feedback recorded',
    score: req.body.s,
    comment: req.body.c,
    technicalData: req.body.d,
    sourceUrl: req.body.u,
    userAgent: req.body.a,
  })
})

// --- Start ---

app.listen(PORT, () => {
  console.log(`Suno mock API listening on http://localhost:${PORT}`)
  console.log('  GET /geocoding?q=<query>       – location search')
  console.log('  GET /directions?f=...&t=...    – route directions')
  console.log('  POST /feedback                 – submit feedback')
  console.log('  GET /health                    – health check')
  console.log()
  console.log('Special keywords (in q= or f= params):')
  console.log('  "slow"  – adds a 2-second delay')
  console.log('  "error" – returns HTTP 500')
})
