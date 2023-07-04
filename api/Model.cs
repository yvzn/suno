using System;
using System.Collections.Generic;

namespace suno;


internal record Coordinates
{
	public decimal lat { get; set; }
	public decimal lon { get; set; }
}

internal record Location
{
	public string name { get; set; }
	public Coordinates coord { get; set; }
}

internal record Leg
{
	public Location start { get; set; }
	public Location end { get; set; }
	public int durationInSeconds { get; set; }
}

internal record Trip
{
	public IEnumerable<Leg> legs { get; set; } = Array.Empty<Leg>();
}
