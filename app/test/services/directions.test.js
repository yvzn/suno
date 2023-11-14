import { describe, expect, test } from 'vitest'
import { aggregateLegs } from '../../src/services/directions';

describe(aggregateLegs.name, () => {
    test('should aggregate similar legs', () => {
        const inputLegs = [
            { start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 10 },
            { start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 20 },
            { start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 30 },
            { start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 40 },
            { start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 50 },
        ];

        const result = aggregateLegs(inputLegs);

        expect(result).toEqual([
            { start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 150 },
        ]);
    });

    test('should merge coordinates when aggregating similar legs', () => {
        const inputLegs = [
            { start: { name: 'A', coord: { lat: 10, lon: 20 } }, end: { name: 'B', coord: { lat: 30, lon: 40 } }, durationInSeconds: 10 },
            { start: { name: 'A', coord: { lat: 30, lon: 40 } }, end: { name: 'B', coord: { lat: 50, lon: 60 } }, durationInSeconds: 20 },
            { start: { name: 'A', coord: { lat: 50, lon: 60 } }, end: { name: 'B', coord: { lat: 70, lon: 80 } }, durationInSeconds: 20 },
        ];

        const result = aggregateLegs(inputLegs);

        expect(result[0].start.coord).toEqual(inputLegs[0].start.coord);
        expect(result[0].end.coord).toEqual(inputLegs[2].end.coord);
    })

    test('should not aggregate distinct legs', () => {
        const inputLegs = [
            { start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 10 },
            { start: { name: 'C' }, end: { name: 'D' }, durationInSeconds: 20 },
            { start: { name: 'E' }, end: { name: 'F' }, durationInSeconds: 30 },
        ];

        const result = aggregateLegs(inputLegs);

        expect(result).toEqual(inputLegs);
    });

    test('should return an empty array if no legs', () => {
        const result = aggregateLegs([]);

        expect(result).toEqual([]);
    });

    test('should return an array with a single leg if only one leg', () => {
        const inputLegs = [{ start: { name: 'A' }, end: { name: 'B' }, durationInSeconds: 10 }];

        const result = aggregateLegs(inputLegs);

        expect(result).toEqual(inputLegs);
    });
});
