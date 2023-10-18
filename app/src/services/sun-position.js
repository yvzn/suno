import SunCalc from 'suncalc';

const SECTOR_COUNT = 8;
const SECTOR_SIZE = (2 * Math.PI) / SECTOR_COUNT;
const DURATION_BUCKET_IN_SECONDS = 60 * 60;

const VECTOR_POINTING_SOUTH = { x: 0, y: -1 };

export function computeSunPositions(itinerary, startDate) {
    if (startDate === 'now') startDate = new Date();

    const { legs } = itinerary;
    const legDates = computeLegDates(legs, startDate);

    const durationSumPerSectorInSeconds = Array(SECTOR_COUNT).fill(0);

    for (const [index, leg] of legs.entries()) {
        const legDate = legDates[index];

        const legVector = { x: leg.end.coord.lon - leg.start.coord.lon, y: leg.end.coord.lat - leg.start.coord.lat };
        const legAngle = computeAngleBetween(VECTOR_POINTING_SOUTH, legVector);

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

            let bucketAngle = bucketSunPosition.azimuth - legAngle;
            while (bucketAngle < 0) bucketAngle += 2 * Math.PI;
            while (bucketAngle > 2 * Math.PI) bucketAngle -= 2 * Math.PI;

            let bucketSector = Math.floor(bucketAngle / SECTOR_SIZE);

            durationSumPerSectorInSeconds[bucketSector] +=
                bucketIncrement.durationInSeconds;
        }
    }

    return durationSumPerSectorInSeconds;
}

export function computeLegDates(legs, startDate) {
    let start = startDate.getTime();

    return legs.map((leg) => {
        const end = start + leg.durationInSeconds * 1000;
        const legDates = { start: new Date(start), end: new Date(end) };
        start = end;
        return legDates;
    });
}

export function computeAngleBetween(u, v) {
    // https://www.wikihow.com/Find-the-Angle-Between-Two-Vectors
    return Math.atan2(u.x * v.y - u.y * v.x, u.x * v.x + u.y * v.y);
}