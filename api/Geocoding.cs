using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using Microsoft.Azure.Functions.Worker;

namespace suno;

public class Geocoding(ILogger<Directions> logger)
{
	private static readonly string azureMapsApiKey = Environment.GetEnvironmentVariable("AZURE_MAPS_API_KEY") ?? throw new Exception("AZURE_MAPS_API_KEY not set");

	private static readonly HttpClient httpClient = new();

	private static readonly JsonSerializerOptions jsonSerializerOptions = new() { Converters = { new JsonStringEnumConverter() } };

	[Function("Geocoding")]
	public async Task<IActionResult> Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "geocoding")] HttpRequest req)
	{
		string? searchQuery = req.Query["q"];

		if (string.IsNullOrEmpty(searchQuery))
		{
			return new BadRequestResult();
		}

		string azureMapsApiEndpoint = $"https://atlas.microsoft.com/geocode?api-version=2023-06-01&query={searchQuery}&subscription-key={azureMapsApiKey}";

		var response = await httpClient.GetAsync(azureMapsApiEndpoint);

		if (!response.IsSuccessStatusCode)
		{
			logger.LogError("Azure Maps API request failed with status code: {AzureMapsStatusCode}", response.StatusCode);
			return new StatusCodeResult(StatusCodes.Status502BadGateway);
		}

		var jsonContent = await response.Content.ReadAsStreamAsync();

		var azureMapsResponse = await JsonSerializer.DeserializeAsync<AzureMapsGeocodeResponse>(jsonContent, jsonSerializerOptions);

		var searchResults = azureMapsResponse?.features
			.Where(feature => feature.geometry.coordinates.Count is > 1)
			.OrderBy(feature => feature.properties.confidence)
			.DistinctBy(feature => feature.properties.address.formattedAddress)
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

		req.HttpContext.Response.Headers.Append("Cache-Control", "private, max-age=86400");
		req.HttpContext.Response.Headers.Append("X-Content-Type-Options", "nosniff");

		return new OkObjectResult(new { results = searchResults ?? Array.Empty<object>() });
	}
}

internal static class LinqExtensions
{
	public static IEnumerable<TSource> DistinctBy<TSource, TKey>
		(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
	{
		HashSet<TKey> seenKeys = new();
		foreach (TSource element in source)
		{
			if (seenKeys.Add(keySelector(element)))
			{
				yield return element;
			}
		}
	}
}
