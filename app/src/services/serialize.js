import { parseSearchParams } from './parser';

export function serializeJourney(from, to, startDate) {
  let journey = '';

  journey += 'f=';
  journey += encodeURIComponent(from.name);
  journey += '&fa=';
  journey += from.coord.lat;
  journey += '&fo=';
  journey += from.coord.lon;

  journey += '&t=';
  journey += encodeURIComponent(to.name);
  journey += '&ta=';
  journey += to.coord.lat;
  journey += '&to=';
  journey += to.coord.lon;

  journey += '&d=';
  journey += (startDate instanceof Date ? startDate.toISOString() : startDate);

  return journey;
}

export function deserializeJourney(searchParams) {
  const params = parseSearchParams(searchParams);
  return {
    from: {
      name: params['f'],
      coord: {
        lat: params['fa'],
        lon: params['fo'],
      },
    },
    to: {
      name: params['t'],
      coord: {
        lat: params['ta'],
        lon: params['to'],
      },
    },
    startDate: deserializeDate(params['d'])
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