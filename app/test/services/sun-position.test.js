import { describe, expect, test } from 'vitest'

import { computeLegDates, computeAngleBetween, computeSunPositions, bucketize } from '../../src/services/sun-position';

describe(computeSunPositions.name, () => {
    test('compute sun positions bucketed by sector, going east around midday', () => {
        const tripDate = new Date('2023-08-01T12:00:00.000Z');
        const legs = [{
            start: Greenwich(),
            end: Woolwich(),
            durationInSeconds: 5 * 60
        }]

        const positions = computeSunPositions({ legs }, tripDate)

        // the itinerary goes east, the sun is south
        // the sun position (with respect to the itinerary) sould be in the rightmost buckets
        expect(positions).toEqual([0, 0, 0, 0, 0, 0, 5 * 60, 0]);
    })

    test('compute sun positions bucketed by sector, going west around midday', () => {
        const tripDate = new Date('2023-08-01T12:00:00.000Z');
        const legs = [{
            start: Woolwich(),
            end: Greenwich(),
            durationInSeconds: 5 * 60
        }]

        const positions = computeSunPositions({ legs }, tripDate)

        // the itinerary goes west, the sun is south
        // the sun position (with respect to the itinerary) sould be in the leftmost buckets
        expect(positions).toEqual([0, 0, 5 * 60, 0, 0, 0, 0, 0]);
    })

    test('compute sun positions bucketed by sector, going south around midday', () => {
        const tripDate = new Date('2023-08-01T12:00:00.000Z');
        const legs = [{
            start: Greenwich(),
            end: Bromley(),
            durationInSeconds: 5 * 60
        }]

        const positions = computeSunPositions({ legs }, tripDate)

        // the itinerary goes west, the sun is south
        // the sun position (with respect to the itinerary) sould be in the topmost buckets
        expect(positions).toEqual([5 * 60, 0, 0, 0, 0, 0, 0, 0]);
    })
});

describe(computeLegDates.name, () => {
    test('computes leg dates correctly', () => {
        const tripDate = new Date('2023-10-18T00:00:00.000Z'); // Your trip date

        const legs = [
            { durationInSeconds: 3600 }, // 1 hour in seconds
            { durationInSeconds: 1800 }, // 30 minutes in seconds
            { durationInSeconds: 7200 }, // 2 hours in seconds
        ];

        const legDates = computeLegDates(legs, tripDate);

        expect(legDates).toEqual([
            {
                start: new Date('2023-10-18T00:00:00.000Z'),
                end: new Date('2023-10-18T01:00:00.000Z'),
            },
            {
                start: new Date('2023-10-18T01:00:00.000Z'),
                end: new Date('2023-10-18T01:30:00.000Z'),
            },
            {
                start: new Date('2023-10-18T01:30:00.000Z'),
                end: new Date('2023-10-18T03:30:00.000Z'),
            },
        ]);
    });
});

describe(computeAngleBetween.name, function () {
    test('should return 0 when both vectors are the same', function () {
        const u = { x: 3, y: 4 };
        const result = computeAngleBetween(u, u);
        expect(result).toEqual(0);
    });

    test('should return Math.PI when vectors are opposite', function () {
        const u = { x: 1, y: 0 };
        const v = { x: -1, y: 0 };
        const result = computeAngleBetween(u, v);
        expect(result).toBeCloseTo(Math.PI, 4);
    });

    test('should return Math.PI/2 when vectors are perpendicular', function () {
        const u = { x: 1, y: 0 };
        const v = { x: 0, y: 1 };
        const result = computeAngleBetween(u, v);
        expect(result).toBeCloseTo(Math.PI / 2, 4);
    });

    test('should return an angle with proper direction (positive if counter-clockwise, negative if clockwise)', function () {
        const u = { x: 1, y: 0 };
        const v = { x: 0, y: 1 };
        const result = computeAngleBetween(v, u);
        expect(result).toBeCloseTo(- Math.PI / 2, 4);
    });

    test('should return the correct angle for arbitrary vectors', function () {
        const u = { x: 4, y: 0 };
        const v = { x: 3, y: 3 };
        const result = computeAngleBetween(u, v);
        expect(result).toBeCloseTo(Math.PI / 4, 4);
    });
});

describe(bucketize.name, () => {
    test('should yield the correct number of buckets for duration above MAX_BUCKET_DURATION_IN_SECONDS', () => {
        const leg = {
            start: Greenwich(),
            end: Woolwich(),
            durationInSeconds: 7200 // 2 hours
        };
        const legDate = new Date('2023-01-01T12:00:00Z')

        const generator = bucketize(leg, legDate, 60 * 60);
        const buckets = [...generator];

        expect(buckets).toHaveLength(2); // 2 buckets for 2 hours duration
    });

    test('should yield buckets with correct bucketStart and bucketStartDate values', () => {
        const leg = {
            start: Greenwich(),
            end: Woolwich(),
            durationInSeconds: 7200 // 2 hours
        };
        const legDate = new Date('2023-01-01T12:00:00Z')

        const generator = bucketize(leg, legDate, 60 * 60);
        const buckets = [...generator];

        // Check the values of the first bucket
        expect(buckets[0].bucketStart).toEqual({ lat: 51.5, lon: 0 });
        expect(buckets[0].bucketStartDate).toEqual(new Date('2023-01-01T12:00:00Z'));
        expect(buckets[0].durationInSeconds).toEqual(3600);

        // Check the values of the second bucket
        expect(buckets[1].bucketStart).toEqual({ lat: 51.5, lon: 0.05 });
        expect(buckets[1].bucketStartDate).toEqual(new Date('2023-01-01T13:00:00Z'));
        expect(buckets[1].durationInSeconds).toEqual(3600);
    });

    test('should yield a single bucket for duration equal to MAX_BUCKET_DURATION_IN_SECONDS', () => {
        const leg = {
            start: Greenwich(),
            end: Woolwich(),
            durationInSeconds: 3600 // 1 hour
        };
        const legDate = new Date('2023-01-01T12:00:00Z')

        const generator = bucketize(leg, legDate, 60 * 60);
        const buckets = [...generator];

        // Expecting 1 bucket for 1-hour duration
        expect(buckets).toHaveLength(1);
    });

    test('should yield the correct number of buckets for duration below MAX_BUCKET_DURATION_IN_SECONDS', () => {
        const leg = {
            start: Greenwich(),
            end: Woolwich(),
            durationInSeconds: 1800 // 30 minutes
        };
        const legDate = new Date('2023-01-01T12:00:00Z')

        const generator = bucketize(leg, legDate, 60 * 60);
        const buckets = [...generator];

        // Expecting 1 bucket for 30 minutes duration
        expect(buckets).toHaveLength(1);
    });
});


function Greenwich() {
    return ({
        coord: {
            lat: 51.5,
            lon: 0,
        },
    })
}

function Woolwich() {
    return ({
        coord: {
            lat: 51.5,
            lon: 0.1,
        },
    })
}

function Bromley() {
    return ({
        coord: {
            lat: 51.4,
            lon: 0,
        },
    })
}