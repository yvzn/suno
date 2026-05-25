using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;
using Microsoft.Azure.Functions.Worker;

namespace suno;

public class Directions(ILogger<Directions> logger)
{
	private static readonly string azureMapsApiKey = Environment.GetEnvironmentVariable("AZURE_MAPS_API_KEY") ?? throw new Exception("AZURE_MAPS_API_KEY not set");

	private static readonly HttpClient httpClient = new();

	private static readonly JsonSerializerOptions jsonSerializerOptions = new() { Converters = { new JsonStringEnumConverter() } };

	[Function("Directions")]
	public async Task<IActionResult> Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "directions")] HttpRequest req)
	{
		string? fromLatitude = req.Query["fa"];
		string? fromLongitude = req.Query["fo"];
		string? toLatitude = req.Query["ta"];
		string? toLongitude = req.Query["to"];
		string? startDate = req.Query["d"];

		if (!IsValidCoordinate(fromLatitude, fromLongitude, toLatitude, toLongitude))
		{
			return new BadRequestResult();
		}

		if (!IsValidStartDate(startDate))
		{
			return new BadRequestResult();
		}

		if ("now".Equals(startDate, StringComparison.InvariantCulture))
		{
			startDate = "";
		}

		string? language = I18n.GetValidLanguage(req.Query["lang"]);

		string azureMapsApiEndpoint = "https://atlas.microsoft.com/route/directions/json";

		var requestUrl = new UriBuilder(azureMapsApiEndpoint);
		var query = System.Web.HttpUtility.ParseQueryString(string.Empty);
		query["api-version"] = "1.0";
		query["subscription-key"] = azureMapsApiKey;
		query["query"] = $"{fromLatitude},{fromLongitude}:{toLatitude},{toLongitude}";
		query["departAt"] = startDate;
		query["instructionsType"] = "coded";
		if (language is not null)
		{
			query["language"] = language;
		}
		requestUrl.Query = query.ToString() ?? string.Empty;

		var request = new HttpRequestMessage(HttpMethod.Get, requestUrl.ToString());

		var response = await httpClient.SendAsync(request);

		if (!response.IsSuccessStatusCode)
		{
			logger.LogError("Azure Maps API request failed with status code: {StatusCode} response: {ResponseContent}", response.StatusCode, await response.Content.ReadAsStringAsync());
			return new StatusCodeResult(StatusCodes.Status502BadGateway);
		}

		var jsonContent = await response.Content.ReadAsStreamAsync();

		var azureMapsResponse = await JsonSerializer.DeserializeAsync<AzureMapsDirectionsResponse>(jsonContent, jsonSerializerOptions);

		if (azureMapsResponse?.routes.Count is not > 0)
		{
			return new NotFoundObjectResult("Route not found.");
		}

		var instructions = azureMapsResponse.routes.First().guidance.instructions;

		if (instructions.Count < 1)
		{
			return new NotFoundObjectResult("Route not found.");
		}

		var trip = new Trip
		{
			legs = MapInstructions(instructions).ToList()
		};

		req.HttpContext.Response.Headers.Append("Cache-Control", "private, max-age=3600");
		req.HttpContext.Response.Headers.Append("X-Content-Type-Options", "nosniff");

		return new OkObjectResult(trip);
	}

	private static bool IsValidCoordinate(params string?[] coordinates)
	{
		return coordinates.All(IsAnumber);

		static bool IsAnumber(string? maybeAnumber) => decimal.TryParse(maybeAnumber, CultureInfo.InvariantCulture, out _);
	}

	private static bool IsValidStartDate(string? maybeStartDate)
		=> "now".Equals(maybeStartDate, StringComparison.InvariantCulture)
			|| DateTimeOffset.TryParse(maybeStartDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out _);

	internal static IEnumerable<Leg> MapInstructions(IEnumerable<AzureMapsGuidanceInstruction> instructions)
	{
		AzureMapsGuidanceInstruction? previousInstruction = default;
		foreach (var currentInstruction in instructions)
		{
			if (previousInstruction is not null)
			{
				yield return new()
				{
					start = MapInstruction(previousInstruction),
					end = MapInstruction(currentInstruction),
					durationInSeconds = currentInstruction.travelTimeInSeconds - previousInstruction.travelTimeInSeconds,
				};
			}

			previousInstruction = currentInstruction;
		}
	}

	private static Location MapInstruction(AzureMapsGuidanceInstruction instruction)
		=> new()
		{
			name = MapStreetOrRoad(instruction),
			coord = MapCoordinates(instruction.point)
		};

	private static string? MapStreetOrRoad(AzureMapsGuidanceInstruction instruction)
	{
		if (!string.IsNullOrWhiteSpace(instruction.street))
		{
			return instruction.street;
		}

		if (instruction.roadNumbers.Count > 0)
		{
			return string.Join('/', instruction.roadNumbers);
		}

		if (!string.IsNullOrWhiteSpace(instruction.signpostText) && "TAKE_EXIT".Equals(instruction.maneuver))
		{
			return "exit: " + CultureInfo.InvariantCulture.TextInfo.ToTitleCase(instruction.signpostText.ToLowerInvariant());
		}

		return default;
	}

	internal static Coordinates MapCoordinates(AzureMapsPoint azureMapsPoint)
		=> new()
		{
			lat = azureMapsPoint.latitude,
			lon = azureMapsPoint.longitude
		};
}
