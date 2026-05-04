using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace suno;

public class FeedbackEntity
{
	public string PartitionKey { get; set; } = "Feedback";
	public string RowKey { get; set; } = Guid.NewGuid().ToString();
	public string? Comment { get; set; }
	public string? TechnicalData { get; set; }
	public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
}

public class FeedbackOutput
{
	[HttpResult]
	public required IActionResult HttpResponse { get; set; }

	[TableOutput("Feedbacks", Connection = "FEEDBACK_STORAGE_CONNECTION_STRING")]
	public FeedbackEntity? TableEntity { get; set; }
}

public class Feedback(ILogger<Feedback> logger)
{
	private static readonly JsonSerializerOptions jsonSerializerOptions = new() { Converters = { new JsonStringEnumConverter() } };

	private const int MaxCommentLength = 2000;
	private const int MaxTechnicalDataLength = 4000;

	[Function("Feedback")]
	public async Task<FeedbackOutput> Run(
		[HttpTrigger(AuthorizationLevel.Function, "post", Route = "feedback")] HttpRequest req)
	{
		string? comment;
		string? technicalData;

		var contentType = req.ContentType ?? string.Empty;
		if (contentType.Contains("application/json", StringComparison.OrdinalIgnoreCase))
		{
			FeedbackRequest? body;
			try
			{
				body = await JsonSerializer.DeserializeAsync<FeedbackRequest>(req.Body, jsonSerializerOptions);
			}
			catch (JsonException ex)
			{
				logger.LogWarning("Invalid JSON body: {Message}", ex.Message);
				return new FeedbackOutput { HttpResponse = new BadRequestResult() };
			}

			comment = body?.Comment;
			technicalData = body?.TechnicalData;
		}
		else
		{
			// application/x-www-form-urlencoded
			var form = await req.ReadFormAsync();
			comment = form["c"];
			technicalData = form["t"];
		}

		if (string.IsNullOrWhiteSpace(comment))
		{
			return new FeedbackOutput { HttpResponse = new BadRequestResult() };
		}

		if (comment.Length > MaxCommentLength)
		{
			return new FeedbackOutput { HttpResponse = new BadRequestResult() };
		}

		if (technicalData?.Length > MaxTechnicalDataLength)
		{
			technicalData = technicalData[..MaxTechnicalDataLength];
		}

		req.HttpContext.Response.Headers.Append("X-Content-Type-Options", "nosniff");

		logger.LogInformation("Storing feedback from request {RequestId}", req.HttpContext.TraceIdentifier);

		var entity = new FeedbackEntity
		{
			Comment = comment,
			TechnicalData = technicalData,
		};

		return new FeedbackOutput
		{
			HttpResponse = new StatusCodeResult(StatusCodes.Status201Created),
			TableEntity = entity,
		};
	}
}

internal record FeedbackRequest
{
	[JsonPropertyName("c")]
	public string? Comment { get; set; }

	[JsonPropertyName("t")]
	public string? TechnicalData { get; set; }
}
