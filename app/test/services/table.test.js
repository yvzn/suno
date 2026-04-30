import { describe, expect, test } from 'vitest'

import { aggregateSunPositions, computeDurationWithSun, computeTotalDuration } from '../../src/services/table';

describe(aggregateSunPositions.name, () => {
    test('aggregates 8 sectors into 4 directions', () => {
        const positions = [100, 200, 300, 400, 500, 600, 700, 800];
        const result = aggregateSunPositions(positions);
        expect(result).toHaveLength(4);
        expect(result.reduce((sum, v) => sum + v, 0)).toBe(
            positions.reduce((sum, v) => sum + v, 0)
        );
    });

    test('returns zeros when all positions are zero', () => {
        const positions = Array(8).fill(0);
        const result = aggregateSunPositions(positions);
        expect(result).toEqual([0, 0, 0, 0]);
    });
});

describe(computeTotalDuration.name, () => {
    test('sums all leg durations', () => {
        const itinerary = {
            legs: [
                { durationInSeconds: 3600 },
                { durationInSeconds: 1800 },
                { durationInSeconds: 7200 },
            ]
        };
        expect(computeTotalDuration(itinerary)).toBe(12600);
    });

    test('returns 0 for an empty legs array', () => {
        const itinerary = { legs: [] };
        expect(computeTotalDuration(itinerary)).toBe(0);
    });
});

describe(computeDurationWithSun.name, () => {
    test('sums all sector durations', () => {
        const sunPositions = [100, 0, 200, 0, 300, 0, 400, 0];
        expect(computeDurationWithSun(sunPositions)).toBe(1000);
    });

    test('returns 0 when no sun in any sector', () => {
        const sunPositions = Array(8).fill(0);
        expect(computeDurationWithSun(sunPositions)).toBe(0);
    });

    test('returns correct sum for all-day trip', () => {
        const sunPositions = [600, 600, 600, 600, 600, 600, 600, 600];
        expect(computeDurationWithSun(sunPositions)).toBe(4800);
    });
});
