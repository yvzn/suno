using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace suno;

public static class Geocoding
{
	[FunctionName("Geocoding")]
	public static IActionResult Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "geocoding")] HttpRequest req,
		ILogger log)
	{
		return new OkObjectResult(new { results });
	}

	private static Location[] results = new [] {
		new Location() {
			name = "Nantes",
			coord = new() {
				lat = 47.2292m,
				lon = -1.547m,
			}
		},
		new() {
			name = "Angers",
			coord = new() {
				lat = 47.4736m,
				lon = -0.5548m,
			}
		},
		new() {
			name = "Paris",
			coord = new() {
				lat = 48.8566m,
				lon = 2.3511m,
			}
		}
	};
}
