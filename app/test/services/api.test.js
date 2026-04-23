import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest'

const journey = {
  from: { name: 'From', coord: { lat: 1, lon: 2 } },
  to: { name: 'To', coord: { lat: 3, lon: 4 } },
  startDate: new Date().toISOString(),
}

describe('findLocations timeout', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.stubEnv('VITE_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] })
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  test('uses default timeout on initial request', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const { findLocations } = await import('../../src/services/api')

    await findLocations('Nantes')

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 30_000)
  })

  test('uses doubled timeout on retry request', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const { findLocationsWithRetry } = await import('../../src/services/api')

    await findLocationsWithRetry('Nantes')

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 60_000)
  })
})

describe('getDirections timeout', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.stubEnv('VITE_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ legs: [] })
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  test('uses default timeout on initial request', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const { getDirections } = await import('../../src/services/api')

    await getDirections(journey)

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 30_000)
  })

  test('uses doubled timeout on retry request', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const { getDirectionsWithRetry } = await import('../../src/services/api')

    await getDirectionsWithRetry(journey)

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 60_000)
  })
})
