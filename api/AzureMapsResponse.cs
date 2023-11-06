using System;
using System.Collections.Generic;

namespace suno;

internal record AzureMapsResponse
{
    public string? type { get; set; }
    public IEnumerable<AzureMapsFeature> features { get; set; } = Array.Empty<AzureMapsFeature>();
}

internal record AzureMapsFeature
{
    public AzureMapsProperties? properties { get; set; }
    public AzureMapsGeometry? geometry { get; set; }
}

internal record AzureMapsProperties
{
    public AzureMapsAddress? address { get; set; }
}

internal record AzureMapsAddress
{
    public string? formattedAddress { get; set; }
}

internal record AzureMapsGeometry
{
    public IEnumerable<decimal> coordinates { get; set; } = Array.Empty<decimal>();
}
