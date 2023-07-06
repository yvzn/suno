const apiUrl = 'https://suno.azurewebsites.net/api/geocoding?code=';

export async function findLocations(searchQuery) {
  const apiKey = localStorage.getItem('apiKey');
  const response = await fetch(apiUrl + apiKey);
  const json = await response.json();
  return json.results;
}
