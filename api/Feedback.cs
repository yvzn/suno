using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Azure;
using Azure.Data.Tables;

namespace suno;

public class Feedback(ILogger<Feedback> logger)
{
	[Function("Feedback")]
	public async Task<FeedbackOutput> Run(
		[HttpTrigger(AuthorizationLevel.Function, "post", Route = "feedback")] HttpRequest req)
	{
		req.HttpContext.Response.Headers.Append("X-Content-Type-Options", "nosniff");

		try
		{
			string requestBody;
			using (var reader = new System.IO.StreamReader(req.Body))
			{
				requestBody = await reader.ReadToEndAsync();
			}
			var requestParams = System.Web.HttpUtility.ParseQueryString(requestBody);

			string? score = requestParams["s"];
			string? comment = requestParams["c"];
			string? technicalData = requestParams["d"];
			string? sourceUrl = requestParams["u"];

			if (string.IsNullOrWhiteSpace(score))
			{
				return new FeedbackOutput
				{
					HttpResult = new BadRequestObjectResult("Missing required parameter: s (score).")
				};
			}

			var tableRow = new FeedbackTableEntity
			{
				PartitionKey = "Feedbacks",
				RowKey = Guid.NewGuid().ToString(),
				Score = score,
				Comment = string.IsNullOrWhiteSpace(comment) ? null : comment,
				TechnicalData = string.IsNullOrWhiteSpace(technicalData) ? null : technicalData,
				SourceUrl = string.IsNullOrWhiteSpace(sourceUrl) ? null : sourceUrl,
				CreatedAt = DateTimeOffset.UtcNow
			};

			logger.LogInformation("Feedback received");

			return new FeedbackOutput
			{
				TableRow = tableRow,
				HttpResult = new StatusCodeResult(StatusCodes.Status201Created)
			};
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Failed to process feedback request");
			return new FeedbackOutput
			{
				HttpResult = new StatusCodeResult(StatusCodes.Status503ServiceUnavailable)
			};
		}
	}
}

public class FeedbackOutput
{
	[TableOutput("Feedbacks", Connection = "FEEDBACK_STORAGE_CONNECTION_STRING")]
	public FeedbackTableEntity? TableRow { get; set; }

	[HttpResult]
	public IActionResult HttpResult { get; set; } = new StatusCodeResult(StatusCodes.Status500InternalServerError);
}

public class FeedbackTableEntity : ITableEntity
{
	public string PartitionKey { get; set; } = "Feedbacks";
	public string RowKey { get; set; } = string.Empty;
	public DateTimeOffset? Timestamp { get; set; }
	public ETag ETag { get; set; }

	public string? Score { get; set; }
	public string? Comment { get; set; }
	public string? TechnicalData { get; set; }
	public string? SourceUrl { get; set; }
	public DateTimeOffset CreatedAt { get; set; }
}
