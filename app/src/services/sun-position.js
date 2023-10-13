import SunCalc from 'suncalc';

export function computeSunDirectionAggregated(itinerary, tripDate) {
    if (tripDate === 'now') tripDate = new Date();
    let durationSumInSeconds = 0;

    const SECTOR_COUNT = 8;
    const durationSumPerSectorInSeconds = Array(SECTOR_COUNT).fill(0);

    const SECTOR_SIZE = (2 * Math.PI) / SECTOR_COUNT;

    const DURATION_BUCKET_IN_SECONDS = 60 * 60;

    for (let leg of itinerary.legs) {
        const legDate = {
            start: new Date(tripDate.getTime() + durationSumInSeconds * 1000),
            end: new Date(
                tripDate.getTime() + (durationSumInSeconds + leg.durationInSeconds) * 1000
            ),
        };

        durationSumInSeconds += leg.durationInSeconds;

        // https://www.wikihow.com/Find-the-Angle-Between-Two-Vectors
        const u = { x: 0, y: -1 }; // vector pointing south
        const v = { x: leg.end.coord.lon - leg.start.coord.lon, y: leg.end.coord.lat - leg.start.coord.lat };

        const legAngle = Math.atan2(u.x * v.y - u.y * v.x, u.x * v.x + u.y * v.y);

        const bucketCount = Math.ceil(
            leg.durationInSeconds / DURATION_BUCKET_IN_SECONDS
        );
        const bucketIncrement = {
            lat: (leg.end.coord.lat - leg.start.coord.lat) / bucketCount,
            lon: (leg.end.coord.lon - leg.start.coord.lon) / bucketCount,
            durationInSeconds: leg.durationInSeconds / bucketCount,
        };
        for (let bucket = 0; bucket < bucketCount; ++bucket) {
            const bucketStart = {
                lat: leg.start.coord.lat + bucket * bucketIncrement.lat,
                lon: leg.start.coord.lon + bucket * bucketIncrement.lon,
            };
            const bucketDate = new Date(
                legDate.start.getTime() +
                bucket * bucketIncrement.durationInSeconds * 1000
            );

            const bucketSunPosition = SunCalc.getPosition(
                bucketDate,
                bucketStart.lat,
                bucketStart.lon
            );

            if (bucketSunPosition.altitude < 0) continue;

            let bucketAngle = legAngle - bucketSunPosition.azimuth;
            while (bucketAngle < 0) bucketAngle += 2 * Math.PI;
            while (bucketAngle > 2 * Math.PI) bucketAngle -= 2 * Math.PI;

            let bucketSector = Math.floor(bucketAngle / SECTOR_SIZE);

            durationSumPerSectorInSeconds[bucketSector] +=
                bucketIncrement.durationInSeconds;
        }
    }

    return durationSumPerSectorInSeconds;
}
