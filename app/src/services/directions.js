/**
 * Groups consecutive similar legs together by adding their durationInSeconds.
 * @param {Leg[]} legs - The input array of legs.
 * @returns {Leg[]} - The array of legs after aggregation.
 */
export function aggregateLegs(legs) {
    if (legs.length === 0) {
        return [];
    }

    const result = [legs[0]];

    for (let i = 1; i < legs.length; i++) {
        const currentLeg = legs[i];
        const previousLeg = result[result.length - 1];

        // Check if legs are similar (the end name only is enough)
        if (
            currentLeg.end.name === previousLeg.end.name
        ) {
            // Update durationInSeconds and end location
            previousLeg.durationInSeconds += currentLeg.durationInSeconds;
            previousLeg.end = currentLeg.end;
        } else {
            // Legs are not similar, push the current leg to the result array
            result.push(currentLeg);
        }
    }

    return result;
}

/**
* @typedef {Object} Coordinates
* @property {number} lat - The latitude value.
* @property {number} lon - The longitude value.
*/

/**
 * @typedef {Object} Location
 * @property {string} name - The location name.
 * @property {Coordinates} coord - The location coordinates.
 */

/**
 * @typedef {Object} Leg
 * @property {Location} start - The starting location of the leg.
 * @property {Location} end - The ending location of the leg.
 * @property {number} durationInSeconds - The duration of the leg in seconds.
 */