import SunCalc from 'suncalc';

// representing the number of heading sectors
// the full circle (2 * Math.PI) is divided into SECTOR_COUNT heading sectors
// representing the direction of the sun with respect to the car direction
const SECTOR_COUNT = 8;

// the angular size of each sector in radians
const SECTOR_SIZE = (2 * Math.PI) / SECTOR_COUNT;

const DURATION_BUCKET_IN_SECONDS = 15 * 60;

const VECTOR_POINTING_SOUTH = { x: 0, y: -1 };

/**
 * Computes the total duration of sunlight for each of eight heading sectors along a given itinerary's path.
 *
 * @param {Itinerary} itinerary - The itinerary for the journey.
 * @param {Date|string} startDate - The start date of the journey. If set to 'now', the current date and time will be used.
 * @returns {number[]} - An array of total sunlight durations for each compass sector, in seconds.
 */
export function computeSunPositions(itinerary, startDate) {
  if (startDate === 'now') startDate = new Date();

  const legDates = computeLegDates(itinerary.legs, startDate);

  const durationSumPerSectorInSeconds = Array(SECTOR_COUNT).fill(0);

  for (const [index, leg] of itinerary.legs.entries()) {
    const { start: legStartDate } = legDates[index];

    for (const bucket of bucketize(leg, legStartDate)) {
      const { bucketStart, bucketStartDate, durationInSeconds: bucketDurationInSeconds } = bucket;

      const bucketSunPosition = getSunPosition(bucketStartDate, bucketStart);

      if (bucketSunPosition.altitude >= 0) {
        const legVector = convertLegToVector(leg);
        const legAngle = computeAngleBetween(VECTOR_POINTING_SOUTH, legVector);
        const bucketAngle = normalizeAngle(bucketSunPosition.azimuth - legAngle);
        const bucketSector = convertAngleToSector(bucketAngle);

        durationSumPerSectorInSeconds[bucketSector] += bucketDurationInSeconds;
      }
    }
  }

  return durationSumPerSectorInSeconds;
}

/**
 * Generates buckets representing the sub-segments of a journey leg's path, allowing for the computation of sunlight duration within each bucket of DURATION_BUCKET_IN_SECONDS.
 *
 * @param {Leg} leg - The journey leg for which to generate sunlight buckets.
 * @param {Date} legStartDate - The start dates of the journey leg.
 * @yields {Object} An object representing a sunlight bucket within the journey leg path.
 * @property {Coordinates} bucketStart - The starting coordinates of the bucket.
 * @property {Date} bucketStartDate - The start date and time for the bucket.
 * @property {number} durationInSeconds - The duration of the bucket in seconds.
 */
export function* bucketize(leg, legStartDate) {
  const bucketCount = Math.ceil(leg.durationInSeconds / DURATION_BUCKET_IN_SECONDS) || 1;
  const bucketIncrement = calculateBucketIncrement(leg, bucketCount);

  for (let bucket = 0; bucket < bucketCount; ++bucket) {
    const bucketStart = {
      lat: leg.start.coord.lat + bucket * bucketIncrement.lat,
      lon: leg.start.coord.lon + bucket * bucketIncrement.lon
    };

    const bucketStartDate = new Date(legStartDate.getTime() + bucket * bucketIncrement.durationInSeconds * 1000);

    yield { bucketStart, bucketStartDate, durationInSeconds: bucketIncrement.durationInSeconds };
  }
}

function calculateBucketIncrement(leg, bucketCount) {
  return {
    lat: (leg.end.coord.lat - leg.start.coord.lat) / bucketCount,
    lon: (leg.end.coord.lon - leg.start.coord.lon) / bucketCount,
    durationInSeconds: leg.durationInSeconds / bucketCount
  };
}

function getSunPosition(timeAndDate, coords) {
  const { altitude, azimuth } = SunCalc.getPosition(timeAndDate, coords.lat, coords.lon);

  // suncalc.js returns the sun azimuth in radians, (direction along the horizon, measured from south to west)
  // e.g. 0 is south and Math.PI * 3/4 is northwest
  // https://github.com/mourner/suncalc#sun-position

  // with azimuth defined as the angle between a line due south and the shadow cast by a vertical rod
  // the angle is positive if the shadow is west of south and negative if it is east of south

  // our trigonometric computations are typically counterclockwise, so the azimuth value should be inverted

  return { altitude, azimuth: -1 * azimuth };
}

function convertLegToVector(leg) {
  return {
    x: leg.end.coord.lon - leg.start.coord.lon,
    y: leg.end.coord.lat - leg.start.coord.lat
  };
}

/**
 * Normalizes an angle in radians to the range [0, 2π).
 *
 * @param {number} angleInRadians - The angle in radians to be normalized.
 * @returns {number} The normalized angle within the [0, 2π) range.
 */
function normalizeAngle(angleInRadians) {
  var result = angleInRadians;
  while (result < 0) result += 2 * Math.PI;
  while (result > 2 * Math.PI) result -= 2 * Math.PI;
  return result;
}

/**
 * Calculates the heading sector based on an angle in radians.
 *
 * This function divides the full circle (2 * Math.PI) into SECTOR_COUNT heading sectors
 * and returns the sector index for the given angle.
 *
 * @param {number} angleInRadians - The angle in radians to calculate the sector for.
 * @returns {number} The index of the heading sector (0 to SECTOR_COUNT - 1) corresponding to the angle.
 */
function convertAngleToSector(angleInRadians) {
  return Math.floor(angleInRadians / SECTOR_SIZE);
}

/**
 * Calculate the start and end dates for each leg of an itinerary based on the provided start date and leg durations.
 *
 * @param {Array<Leg>} legs - An array of leg objects, each containing a `durationInSeconds` property.
 * @param {Date} startDate - The start date of the trip.
 *
 * @returns {Array<LegDates>} An array of objects with start and end dates for each leg.
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

/**
 * Computes the angle in radians between two 2D vectors (u and v).
 *
 * This function calculates the angle between two vectors using the arctangent
 * of the cross product and the dot product of the two vectors.
 *
 * @param {Object} u - The first 2D vector with properties x and y.
 * @param {number} u.x - The x-component of vector u.
 * @param {number} u.y - The y-component of vector u.
 * @param {Object} v - The second 2D vector with properties x and y.
 * @param {number} v.x - The x-component of vector v.
 * @param {number} v.y - The y-component of vector v.
 * @returns {number} The angle between the two vectors in radians, in the range [-π, π].
 *
 * @see {@link https://www.wikihow.com/Find-the-Angle-Between-Two-Vectors}
 */
export function computeAngleBetween(u, v) {
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

/**
 * @typedef {Object} LegDates
 * @property {Date} start - The start date.
 * @property {Date} end - The end date.
 */