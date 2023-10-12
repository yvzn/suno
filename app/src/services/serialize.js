export function serializeJourney(from, to, startDate) {
  let journey = new URLSearchParams();

  journey.set('f', from.name)
  journey.set('fa', from.coord.lat)
  journey.set('fo', from.coord.lon)

  journey.set('t', to.name)
  journey.set('ta', to.coord.lat)
  journey.set('to', to.coord.lon)

  journey.set('d', (startDate instanceof Date ? startDate.toISOString() : startDate))

  return journey.toString();
}

export function deserializeJourney(searchParams) {
  const params = new URLSearchParams(searchParams);
  return {
    from: {
      name: params.get('f'),
      coord: {
        lat: params.get('fa'),
        lon: params.get('fo'),
      },
    },
    to: {
      name: params.get('t'),
      coord: {
        lat: params.get('ta'),
        lon: params.get('to'),
      },
    },
    startDate: deserializeDate(params.get('d'))
  };
}

function deserializeDate(param) {
  try {
    const d = new Date(param);
    if (!isNaN(d)) return d;
  } catch (_) {
  }
  return 'now'
}