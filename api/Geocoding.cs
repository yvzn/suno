using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using System.Linq;

namespace suno;

public static class Geocoding
{
	private static readonly string azureMapsApiKey = Environment.GetEnvironmentVariable("AZURE_MAPS_API_KEY") ?? throw new Exception("AZURE_MAPS_API_KEY not set");

	private static readonly HttpClient httpClient = new();

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

		// Replace with your Azure Maps API subscription key
		string azureMapsApiEndpoint = $"https://atlas.microsoft.com/geocode?api-version=2023-06-01&query={searchQuery}&subscription-key={azureMapsApiKey}";

		var response = await httpClient.GetAsync(azureMapsApiEndpoint);

		if (!response.IsSuccessStatusCode)
		{
			log.LogError("Azure Maps API request failed with status code: {AzureMapsStatusCode}", response.StatusCode);
			return new StatusCodeResult(StatusCodes.Status502BadGateway);
		}

		var jsonContent = await response.Content.ReadAsStringAsync();
		var azureMapsResponse = JsonConvert.DeserializeObject<AzureMapsResponse>(jsonContent);

		if (azureMapsResponse?.features.Count() is not > 0)
		{
			return new NotFoundObjectResult("Location not found.");
		}

		var searchResults = azureMapsResponse.features
			.Where(feature => feature?.geometry?.coordinates?.Count() is > 1)
			.Select(feature =>
			{
				var coordinates = feature!.geometry!.coordinates;
				return new Location
				{
					name = feature?.properties?.address?.formattedAddress,
					coord = new Coordinates
					{
						lat = coordinates.ElementAt(1),
						lon = coordinates.ElementAt(0)
					}
				};
			}).ToArray();

		return new OkObjectResult(searchResults);
	}
}
