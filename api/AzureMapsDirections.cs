using System;
using System.Collections.Generic;

namespace suno;

public class AzureMapsSummary
{
    public decimal lengthInMeters { get; set; }
    public int travelTimeInSeconds { get; set; }
    public int trafficDelayInSeconds { get; set; }
    public decimal trafficLengthInMeters { get; set; }
    public DateTimeOffset departureTime { get; set; }
    public DateTimeOffset arrivalTime { get; set; }
}

public class AzureMapsPoint
{
    public decimal latitude { get; set; }
    public decimal longitude { get; set; }
}

public class AzureMapsLeg
{
    public AzureMapsSummary summary { get; set; } = new();
    public ICollection<AzureMapsPoint> points { get; set; } = Array.Empty<AzureMapsPoint>();
}

public class AzureMapsSection
{
    public int startPointIndex { get; set; }
    public int endPointIndex { get; set; }
    public string? sectionType { get; set; }
    public string? travelMode { get; set; }
}

public class AzureMapsGuidanceInstruction
{
    public decimal? routeOffsetInMeters { get; set; }
    public int travelTimeInSeconds { get; set; }
    public AzureMapsPoint? point { get; set; }
    public int pointIndex { get; set; }
    public string? instructionType { get; set; }
    public string? street { get; set; }
    public string? signpostText { get; set; }
    public ICollection<string> roadNumbers { get; set; } = Array.Empty<string>();
    public bool possibleCombineWithNext { get; set; }
    public string? drivingSide { get; set; }
    public string? junctionType { get; set; }
    public decimal? turnAngleInDecimalDegrees { get; set; }
    public string? maneuver { get; set; }
}

public class AzureMapsGuidance
{
    public ICollection<AzureMapsGuidanceInstruction>? instructions { get; set; }
}

public class AzureMapsRoute
{
    public AzureMapsSummary summary { get; set; } = new();
    public ICollection<AzureMapsLeg> legs { get; set; } = Array.Empty<AzureMapsLeg>();
    public ICollection<AzureMapsSection> sections { get; set; } = Array.Empty<AzureMapsSection>();
    public AzureMapsGuidance? guidance { get; set; }
}

public class AzureMapsRouteRequest
{
    public string type { get; set; } = "FeatureCollection";
    public ICollection<AzureMapsRouteRequestFeature> features { get; set; } = Array.Empty<AzureMapsRouteRequestFeature>();
    public string? departAt { get; set; }
    public ICollection<string> routeOutputOptions { get; set; } = ["itinerary"];
}

public class AzureMapsRouteRequestFeature
{
    public string type { get; set; } = "Feature";
    public AzureMapsRouteRequestGeometry geometry { get; set; } = new();
    public AzureMapsRouteRequestProperties properties { get; set; } = new();
}

public class AzureMapsRouteRequestGeometry
{
    public string type { get; set; } = "Point";
    public ICollection<decimal> coordinates { get; set; } = Array.Empty<decimal>();
}

public class AzureMapsRouteRequestProperties
{
    public int pointIndex { get; set; }
    public string pointType { get; set; } = "waypoint";
}

public class AzureMapsDirectionsFeature
{
    public AzureMapsDirectionsGeometry? geometry { get; set; }
    public AzureMapsDirectionsProperties? properties { get; set; }
}

public class AzureMapsDirectionsGeometry
{
    public ICollection<decimal>? coordinates { get; set; }
}

public class AzureMapsDirectionsProperties
{
    public string? type { get; set; }
    public int? durationInSeconds { get; set; }
    public string? towardsRoadName { get; set; }
    public string? street { get; set; }
    public string? signpostText { get; set; }
    public ICollection<string>? signs { get; set; }
    public ICollection<string>? roadNumbers { get; set; }
    public string? exitIdentifier { get; set; }
    public string? maneuver { get; set; }
    public AzureMapsDirectionsInstruction? instruction { get; set; }
    public ICollection<AzureMapsRouteStep>? steps { get; set; }
}

public class AzureMapsDirectionsInstruction
{
    public string? maneuverType { get; set; }
}

public class AzureMapsRouteStep
{
    public ICollection<string>? names { get; set; }
}

public class AzureMapsDirectionsResponse
{
    public string? formatVersion { get; set; }
    public ICollection<AzureMapsRoute>? routes { get; set; }
    public ICollection<AzureMapsDirectionsFeature>? features { get; set; }
}