export function serializeJourney({ from, to, startDate }) {
  let params = new URLSearchParams();

  params.set('f', from.name);
  params.set('fa', from.coord.lat);
  params.set('fo', from.coord.lon);

  params.set('t', to.name);
  params.set('ta', to.coord.lat);
  params.set('to', to.coord.lon);

  params.set('d', (startDate instanceof Date ? startDate.toISOString() : startDate));

  return params;
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

function deserializeDate(maybeSomeDate) {
  try {
    const d = new Date(maybeSomeDate);
    if (!isNaN(d)) return d;
  } catch (_) {
  }
  return 'now'
}