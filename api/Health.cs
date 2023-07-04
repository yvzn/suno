using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace suno;

public static class Health
{
	[FunctionName("Health")]
	public static IActionResult Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "health")] HttpRequest req,
		ILogger log)
	{
		return new OkObjectResult(new { healthy = true, timestamp = DateTime.UtcNow });
	}
}
