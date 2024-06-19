export function serializeJourney({ from, to, startDate }) {
  let params = new URLSearchParams()

  params.set('f', from.name)
  params.set('fa', from.coord.lat)
  params.set('fo', from.coord.lon)

  params.set('t', to.name)
  params.set('ta', to.coord.lat)
  params.set('to', to.coord.lon)

  params.set('d', serializeDate(startDate))

  return params
}

export function deserializeJourney(searchParams) {
  const params = new URLSearchParams(searchParams)

  return {
    from: deserializeLocation(params.get('f'), params.get('fa'), params.get('fo')),
    to: deserializeLocation(params.get('t'), params.get('ta'), params.get('to')),
    startDate: deserializeDate(params.get('d'))
  }
}

function serializeDate(maybeSomeDate) {
  try {
    if (maybeSomeDate instanceof Date && !isNaN(maybeSomeDate)) {
      return maybeSomeDate.toISOString()
    }
  } catch (_) {
  }
  return maybeSomeDate
}

function deserializeLocation(maybeName, maybeLatitude, maybeLongitude) {
  if (maybeName && parseFloat(maybeLatitude) && parseFloat(maybeLongitude)) {
    return {
      name: maybeName,
      coord: {
        lat: maybeLatitude,
        lon: maybeLongitude,
      }
    }
  }
  return null
}

function deserializeDate(maybeSomeDate) {
  try {
    if (!maybeSomeDate) return 'now'
    const d = new Date(maybeSomeDate)
    if (!isNaN(d)) return d
  } catch (_) {
  }
  return 'now'
}