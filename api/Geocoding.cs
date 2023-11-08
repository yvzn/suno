using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace suno;

public static class Geocoding
{
	private static readonly string azureMapsApiKey = Environment.GetEnvironmentVariable("AZURE_MAPS_API_KEY") ?? throw new Exception("AZURE_MAPS_API_KEY not set");

	private static readonly HttpClient httpClient = new();

	private static readonly JsonSerializerOptions jsonSerializerOptions = new() { Converters = { new JsonStringEnumConverter() } };

	[FunctionName("Geocoding")]
	public static async Task<IActionResult> Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "geocoding")] HttpRequest req,
		ILogger log)
	{
		string searchQuery = req.Query["q"];

		if (string.IsNullOrEmpty(searchQuery))
		{
			return new BadRequestResult();
		}

		string azureMapsApiEndpoint = $"https://atlas.microsoft.com/geocode?api-version=2023-06-01&query={searchQuery}&subscription-key={azureMapsApiKey}";

		var response = await httpClient.GetAsync(azureMapsApiEndpoint);

		if (!response.IsSuccessStatusCode)
		{
			log.LogError("Azure Maps API request failed with status code: {AzureMapsStatusCode}", response.StatusCode);
			return new StatusCodeResult(StatusCodes.Status502BadGateway);
		}

		var jsonContent = await response.Content.ReadAsStreamAsync();

		var azureMapsResponse = await JsonSerializer.DeserializeAsync<AzureMapsGeocodeResponse>(jsonContent, jsonSerializerOptions);

		var searchResults = azureMapsResponse?.features
			.Where(feature => feature.geometry.coordinates.Count is > 1)
			.OrderBy(feature => feature.properties.confidence)
			.GroupBy(feature => feature.properties.address.formattedAddress).Select(features => features.First())
			.Select(feature =>
			{
				var coordinates = feature.geometry.coordinates;
				return new Location
				{
					name = feature.properties.address.formattedAddress,
					coord = new Coordinates
					{
						lat = coordinates.ElementAt(1),
						lon = coordinates.ElementAt(0)
					}
				};
			}).ToArray();

		return new OkObjectResult(new { results = searchResults ?? Array.Empty<object>() });
	}
}
