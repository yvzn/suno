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

public static class Directions
{
	[FunctionName("Directions")]
	public static IActionResult Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "directions")] HttpRequest req,
		ILogger log)
	{
		return new OkObjectResult(new { legs });
	}

	private static Leg[] legs = new[] {
			new Leg() {
				start = new () {
					name = "Nantes",
					coord = new() {
						lat = 47.2292m,
						lon = -1.547m,
					}
				},
				end = new() {
					name = "Angers",
					coord = new() {
						lat = 47.4736m,
						lon = -0.5548m,
					}
				},
				durationInSeconds = 1 * 60 * 60
			},
			new() {
				start = new() {
					name = "Angers",
					coord = new() {
						lat = 47.4736m,
						lon = -0.5548m,
					}
				},
				end = new() {
					name = "Paris",
					coord = new() {
						lat = 48.8566m,
						lon = 2.3511m,
					}
				},
				durationInSeconds = (int)(3.5 * 60 * 60)
			},
	};
}
