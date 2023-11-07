using System;
using System.Collections.Generic;

namespace suno;

public record AzureMapsGeometry
{
    public string? type { get; set; }
    public ICollection<decimal> coordinates { get; set; } = Array.Empty<decimal>();
}

public record AzureMapsCountryRegion
{
    public string? name { get; set; }
    public string? ISO { get; set; }
}

public record AzureMapsAdminDistrict
{
    public string? shortName { get; set; }
}

public record AzureMapsGeocodePoint
{
    public string? calculationMethod { get; set; }
    public ICollection<string> usageTypes { get; set; } = Array.Empty<string>();
    public AzureMapsGeometry geometry { get; set; } = new();
}

public record AzureMapsAddress
{
    public string? locality { get; set; }
    public AzureMapsCountryRegion countryRegion { get; set; } = new();
    public ICollection<AzureMapsAdminDistrict> adminDistricts { get; set; } = Array.Empty<AzureMapsAdminDistrict>();
    public string? formattedAddress { get; set; }
}

public enum AzureMapsConfidence
{
    High = 0,
    Medium,
    Low,
}

public record AzureMapsProperties
{
    public string? type { get; set; }
    public AzureMapsConfidence confidence { get; set; }
    public ICollection<string> matchCodes { get; set; } = Array.Empty<string>();
    public ICollection<AzureMapsGeocodePoint> geocodePoints { get; set; } = Array.Empty<AzureMapsGeocodePoint>();
    public AzureMapsAddress address { get; set; } = new();
}

public record AzureMapsFeature
{
    public string? type { get; set; }
    public AzureMapsGeometry geometry { get; set; } = new();
    public ICollection<decimal> bbox { get; set; } = Array.Empty<decimal>();
    public AzureMapsProperties properties { get; set; } = new();
}

public record AzureMapsGeocodeResponse
{
    public string? type { get; set; }
    public ICollection<AzureMapsFeature> features { get; set; } = Array.Empty<AzureMapsFeature>();
}
