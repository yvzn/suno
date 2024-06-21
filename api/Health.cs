using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;

namespace suno;

public static class Health
{
	[Function("Health")]
	public static IActionResult Run(
		[HttpTrigger(AuthorizationLevel.Function, "get", Route = "health")] HttpRequest req)
	{
		req.HttpContext.Response.Headers.Append("Cache-Control", "no-store");
		req.HttpContext.Response.Headers.Append("X-Content-Type-Options", "nosniff");

		return new OkObjectResult(new { healthy = true, timestamp = DateTime.UtcNow });
	}
}
