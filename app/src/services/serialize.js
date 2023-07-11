import { parseSearchParams } from './parser';

export function serializeJourney(from, to) {
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

  return journey;
}

export function deserializeJourney(string) {
  const params = parseSearchParams(string);
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
  };
}
