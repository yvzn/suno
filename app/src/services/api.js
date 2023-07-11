const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY || localStorage.getItem('apiKey');

export async function findLocations(searchQuery) {
  const response = await fetch(`${apiUrl}?code=${apiKey}&q=${encodeURIComponent(searchQuery)}`);
  const json = await response.json();
  return json.results;
}

export function findLocations__(searchQuery) {
  const Nantes = {
    name: 'Nantes',
    coord: {
      lat: 47.2292,
      lon: -1.547,
    },
  };

  const Angers = {
    name: 'Angers',
    coord: {
      lat: 47.4736,
      lon: -0.5548,
    },
  };

  const Paris = {
    name: 'Paris',
    coord: {
      lat: 48.8566,
      lon: 2.3511,
    },
  };

  const results = [Nantes, Angers, Paris];
  return Promise.resolve(results);
}
