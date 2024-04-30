
/**
 * Aggregates the total duration of sunlight by a predefined set of angles.
 * 
 * @param {number[]} sunPositions - An array of total sunlight durations for each compass sector, in seconds.
 * @returns {number[]} - An array of sunlight durations by corresponding angle, in seconds.
 */
export function aggregateSunPositions(sunPositions) {
    const aggregated = Array(4).fill(0)
    for(let index = 0; index < sunPositions.length; ++index) {
        aggregated[mapIndexToGroup(index)] += sunPositions[index]
    }
    return aggregated
}


function mapIndexToGroup(index) {
    // Indexes 1 and 2 are mapped to group 1
    // Indexes 3 and 4 are mapped to group 2
    // Indexes 5 and 6 are mapped to group 3
    // Indexes 7 and 0 are mapped to group 0
    return modulo((index + 1) / 2, 4)
}

function modulo(n, m) {
    // https://dustinpfister.github.io/2017/09/02/js-whats-wrong-with-modulo/
    return (Math.floor(n) % m + m) % m
}

