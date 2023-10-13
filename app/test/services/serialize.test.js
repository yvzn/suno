import { describe, expect, test } from 'vitest'

import { deserializeJourney, serializeJourney } from '../../src/services/serialize'

describe(serializeJourney.name, () => {
    test('serialize valid journey', () => {
        const from = LeCroisic();
        const to = Angers();
        const startDate = 'now';

        const actual = serializeJourney({from, to, startDate});

        expect(String(actual)).toBe('f=Le+Croisic&fa=47.2292&fo=-1.547&t=Angers&ta=47.4736&to=-0.5548&d=now');
    });
});

describe(deserializeJourney.name, () => {
    test('deserialize valid journey', () => {
        const journey = 'f=Le+Croisic&fa=47.2292&fo=-1.547&t=Angers&ta=47.4736&to=-0.5548&d=now';

        const actual = deserializeJourney(journey);

        expect(actual).toEqual(
            {
                from: LeCroisic(),
                to: Angers(),
                startDate: 'now'
            }
        )
    });
});

function LeCroisic() {
    return ({
        name: 'Le Croisic',
        coord: {
            lat: '47.2292',
            lon: '-1.547',
        },
    })
}

function Angers() {
    return ({
        name: 'Angers',
        coord: {
            lat: '47.4736',
            lon: '-0.5548',
        },
    })
}