import SunCalc from 'suncalc';

// representing the number of compass sectors (N, NE, E, SE, S, SW, W, NW)
const SECTOR_COUNT = 8;

// the angular size of each sector in radians
const SECTOR_SIZE = (2 * Math.PI) / SECTOR_COUNT;

const DURATION_BUCKET_IN_SECONDS = 60 * 60;

const VECTOR_POINTING_SOUTH = { x: 0, y: -1 };

/**
 * Computes the total duration of sunlight for each of eight sectors defined by compass directions (N, NE, E, SE, S, SW, W, NW) along a given itinerary's path.
 *
 * @param {Itinerary} itinerary - The itinerary for the journey.
 * @param {Date|string} startDate - The start date of the journey. If set to 'now', the current date and time will be used.
 * @returns {number[]} - An array of total sunlight durations for each compass sector.
 */
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

/**
 * Calculate the start and end dates for each leg of an itinerary based on the provided start date and leg durations.
 *
 * @param {Array<Leg>} legs - An array of leg objects, each containing a `durationInSeconds` property.
 * @param {Date} startDate - The start date of the trip.
 *
 * @returns {Array<{ start: Date, end: Date }>} An array of objects with start and end dates for each leg.
 */
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

/**
 * @typedef {Object} Coordinates
 * @property {number} lat - The latitude value.
 * @property {number} lon - The longitude value.
 */

/**
 * @typedef {Object} Location
 * @property {Coordinates} coord - The location coordinates.
 */

/**
 * @typedef {Object} Leg
 * @property {Location} start - The starting location of the leg.
 * @property {Location} end - The ending location of the leg.
 * @property {number} durationInSeconds - The duration of the leg in seconds.
 */

/**
 * @typedef {Object} Itinerary
 * @property {Leg[]} legs - An array of legs that make up the journey itinerary.
 */
