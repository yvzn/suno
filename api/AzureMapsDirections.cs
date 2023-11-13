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
    public AzureMapsPoint point { get; set; } = new();
    public int pointIndex { get; set; }
    public string? instructionType { get; set; }
    public string? street { get; set; }
    public ICollection<string> roadNumbers { get; set; } = Array.Empty<string>();
    public bool possibleCombineWithNext { get; set; }
    public string? drivingSide { get; set; }
    public string? junctionType { get; set; }
    public decimal? turnAngleInDecimalDegrees { get; set; }
    public string? maneuver { get; set; }
}

public class AzureMapsGuidance
{
    public ICollection<AzureMapsGuidanceInstruction> instructions { get; set; } = Array.Empty<AzureMapsGuidanceInstruction>();
}

public class AzureMapsRoute
{
    public AzureMapsSummary summary { get; set; } = new();
    public ICollection<AzureMapsLeg> legs { get; set; } = Array.Empty<AzureMapsLeg>();
    public ICollection<AzureMapsSection> sections { get; set; } = Array.Empty<AzureMapsSection>();
    public AzureMapsGuidance guidance { get; set; } = new();
}

public class AzureMapsDirectionsResponse
{
    public string? formatVersion { get; set; }
    public ICollection<AzureMapsRoute> routes { get; set; } = Array.Empty<AzureMapsRoute>();
}