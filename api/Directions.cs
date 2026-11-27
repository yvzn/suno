using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;
using System.Text;
using Microsoft.Azure.Functions.Worker;

namespace suno;

public class Directions(ILogger<Directions> logger)
{
	private static readonly string azureMapsApiKey = Environment.GetEnvironmentVariable("AZURE_MAPS_API_KEY") ?? throw new Exception("AZURE_MAPS_API_KEY not set");

	private static readonly HttpClient httpClient = new();

	private static readonly JsonSerializerOptions jsonSerializerOptions = new()
	{
		Converters = { new JsonStringEnumConverter() },
		DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
	};

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

		string azureMapsApiEndpoint = "https://atlas.microsoft.com/route/directions";

		var requestUrl = new UriBuilder(azureMapsApiEndpoint);
		var query = System.Web.HttpUtility.ParseQueryString(string.Empty);
		query["api-version"] = "2025-01-01";
		query["subscription-key"] = azureMapsApiKey;
		requestUrl.Query = query.ToString() ?? string.Empty;

		var routeRequest = new AzureMapsRouteRequest
		{
			features =
			[
				CreateWaypoint(fromLongitude, fromLatitude, 0),
				CreateWaypoint(toLongitude, toLatitude, 1)
			],
			departAt = string.IsNullOrWhiteSpace(startDate) ? null : startDate
		};
		var request = new HttpRequestMessage(HttpMethod.Post, requestUrl.ToString())
		{
			Content = new StringContent(
				JsonSerializer.Serialize(routeRequest, jsonSerializerOptions),
				Encoding.UTF8,
				"application/geo+json")
		};
		if (language is not null)
		{
			request.Headers.AcceptLanguage.ParseAdd(language);
		}

		var response = await httpClient.SendAsync(request);

		if (!response.IsSuccessStatusCode)
		{
			logger.LogError("Azure Maps API request failed with status code: {StatusCode} response: {ResponseContent}", response.StatusCode, await response.Content.ReadAsStringAsync());
			return new StatusCodeResult(StatusCodes.Status502BadGateway);
		}

		var jsonContent = await response.Content.ReadAsStreamAsync();

		var azureMapsResponse = await JsonSerializer.DeserializeAsync<AzureMapsDirectionsResponse>(jsonContent, jsonSerializerOptions);

		var instructions = GetInstructions(azureMapsResponse);
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

	private static AzureMapsRouteRequestFeature CreateWaypoint(string? longitude, string? latitude, int pointIndex)
		=> new()
		{
			geometry = new()
			{
				coordinates =
				[
					decimal.Parse(longitude!, CultureInfo.InvariantCulture),
					decimal.Parse(latitude!, CultureInfo.InvariantCulture)
				]
			},
			properties = new() { pointIndex = pointIndex }
		};

	internal static IReadOnlyCollection<AzureMapsGuidanceInstruction> GetInstructions(AzureMapsDirectionsResponse? response)
	{
		var legacyInstructions = response?.routes?.FirstOrDefault()?.guidance?.instructions;
		if (legacyInstructions is not null)
		{
			return legacyInstructions.ToList();
		}

		var instructions = new List<AzureMapsGuidanceInstruction>();
		var elapsedSeconds = 0;
		foreach (var feature in response?.features ?? [])
		{
			var properties = feature.properties;
			if (!"ManeuverPoint".Equals(properties?.type, StringComparison.OrdinalIgnoreCase)
				&& !"Waypoint".Equals(properties?.type, StringComparison.OrdinalIgnoreCase))
			{
				continue;
			}

			var coordinates = feature.geometry?.coordinates?.ToList() ?? [];
			var stepNames = properties?.steps?.SelectMany(step => step.names ?? []).ToList() ?? [];
			instructions.Add(new()
			{
				travelTimeInSeconds = elapsedSeconds,
				point = coordinates.Count >= 2
					? new() { longitude = coordinates[0], latitude = coordinates[1] }
					: null,
				street = properties?.street ?? properties?.towardsRoadName,
				roadNumbers = properties?.roadNumbers?.ToList() ?? stepNames,
				signpostText = properties?.signpostText ?? properties?.signs?.FirstOrDefault() ?? properties?.exitIdentifier,
				maneuver = properties?.maneuver ?? properties?.instruction?.maneuverType
			});
			elapsedSeconds += properties?.durationInSeconds ?? 0;
		}

		return instructions;
	}

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

		if (instruction.roadNumbers?.Count > 0)
		{
			return string.Join('/', instruction.roadNumbers);
		}

		if (!string.IsNullOrWhiteSpace(instruction.signpostText)
			&& instruction.maneuver is not null
			&& instruction.maneuver.Replace("_", string.Empty).Equals("TAKEEXIT", StringComparison.OrdinalIgnoreCase))
		{
			return "exit: " + CultureInfo.InvariantCulture.TextInfo.ToTitleCase(instruction.signpostText.ToLowerInvariant());
		}

		return default;
	}

	internal static Coordinates? MapCoordinates(AzureMapsPoint? azureMapsPoint)
	{
		if (azureMapsPoint is null)
		{
			return default;
		}

		return new()
		{
			lat = azureMapsPoint.latitude,
			lon = azureMapsPoint.longitude
		};
	}
}
