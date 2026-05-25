namespace suno;

public static class I18n
{
	private static readonly Dictionary<string, string> allowedLanguages = new()
	{
		{ "en", "en-US" },
		{ "fr", "fr-FR" },
	};

	internal static string? GetValidLanguage(string? language)
	{
		if (string.IsNullOrEmpty(language))
		{
			return null;
		}

		return allowedLanguages.TryGetValue(language, out string? value) ? value : null;
	}
}
