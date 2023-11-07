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

public static class Directions
{
	private static readonly string azureMapsApiKey = Environment.GetEnvironmentVariable("AZURE_MAPS_API_KEY") ?? throw new Exception("AZURE_MAPS_API_KEY not set");

	private static readonly HttpClient httpClient = new();

	private static readonly JsonSerializerOptions jsonSerializerOptions = new() { Converters = { new JsonStringEnumConverter() } };

	[FunctionName("Directions")]
	public static async Task<IActionResult> Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "directions")] HttpRequest req,
		ILogger log)
	{
		string fromLatitude = req.Query["fa"];
		string fromLongitude = req.Query["fo"];
		string toLatitude = req.Query["ta"];
		string toLongitude = req.Query["to"];
		string startDate = req.Query["d"];

		if (!IsValidCoordinate(fromLatitude, fromLongitude, toLatitude, toLongitude) || !IsValidStartDate(startDate))
		{
			return new BadRequestResult();
		}

		if ("now".Equals(startDate, StringComparison.InvariantCulture))
		{
			startDate = "";
		}

		string azureMapsApiEndpoint = "https://atlas.microsoft.com/route/directions/json";

		string requestUrl = $"{azureMapsApiEndpoint}?" +
			$"api-version=1.0&subscription-key={azureMapsApiKey}&" +
			$"query={fromLatitude},{fromLongitude}:{toLatitude},{toLongitude}&" +
			$"departAt={startDate}&"
			// TODO instead of legs use guidance : instructionsType=coded
			;

		var response = await httpClient.GetAsync(requestUrl);

		if (!response.IsSuccessStatusCode)
		{
			log.LogError($"Azure Maps API request failed with status code: {response.StatusCode}");
			return new StatusCodeResult(StatusCodes.Status502BadGateway);
		}

		var jsonContent = await response.Content.ReadAsStreamAsync();

		var azureMapsResponse = await JsonSerializer.DeserializeAsync<AzureMapsDirectionsResponse>(jsonContent, jsonSerializerOptions);

		if (azureMapsResponse?.routes.Count is not > 0)
		{
			return new NotFoundObjectResult("Route not found.");
		}

		var legs = azureMapsResponse.routes
				.First().legs
				.Select(MapLeg)
				.ToList();

		var trip = new Trip
		{
			legs = legs
		};

		return new OkObjectResult(trip);
	}

	private static bool IsValidCoordinate(params string[] coordinates)
	{
		return coordinates.All(IsAnumber);

		static bool IsAnumber(string maybeAnumber) => decimal.TryParse(maybeAnumber, out _);
	}

	private static bool IsValidStartDate(string startDate) =>
		"now".Equals(startDate, StringComparison.InvariantCulture)
		|| DateTimeOffset.TryParse(startDate, out _);

	internal static Leg MapLeg(AzureMapsLeg azureMapsLeg)
	{
		return new Leg
		{
			start = MapCoordinates(azureMapsLeg.points.First()),
			end = MapCoordinates(azureMapsLeg.points.Last()),
			durationInSeconds = azureMapsLeg.summary.travelTimeInSeconds
		};
	}

	internal static Location MapCoordinates(AzureMapsPoint azureMapsPoint)
	{
		return new Location
		{
			name = "?",
			coord = new Coordinates
			{
				lat = azureMapsPoint.latitude,
				lon = azureMapsPoint.longitude
			}
		};
	}
}
