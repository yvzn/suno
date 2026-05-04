import { Text } from 'preact-i18n';

import { aggregateSunPositions } from '../services/table';

import './LegSunDirection.css';

const headingKeys = [
    'sun.position.heading0',
    'sun.position.heading1',
    'sun.position.heading2',
    'sun.position.heading3',
];

export function LegSunDirection({ positions }) {
    const aggregated = aggregateSunPositions(positions);
    const hasValues = aggregated.some(d => d > 0);

    if (!hasValues) return null;

    return (
        <span className="leg-sun-icons">
            {aggregated.map((durationInSeconds, index) => {
                if (durationInSeconds <= 0) return null;
                return (
                    <svg
                        key={"sun-" + index}
                        viewBox="0 0 32 32"
                        data-heading={index}
                        className="leg-sun-icon"
                        role="img"
                    >
                        <title><Text id={headingKeys[index]}></Text></title>
                        <circle r="16" cx="16" cy="16" />
                    </svg>
                );
            })}
        </span>
    );
}
