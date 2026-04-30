import { useEffect, useRef, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';

import { drawChart } from '../services/chart';
import { aggregateSunPositions } from '../services/table';
import { formatDurationInMinutes } from '../services/duration';

import './LegSunDirection.css';

const rotationByHeading = ['-135deg', '-225deg', '-315deg', '-45deg'];
const headingKeys = [
    'sun.position.heading0',
    'sun.position.heading1',
    'sun.position.heading2',
    'sun.position.heading3',
];

export function LegSunDirection({ positions, legIndex }) {
    const containerRef = useRef();
    const canvasRef = useRef();
    const [chartRendered, setChartRendered] = useState(false);

    useEffect(() => {
        if (chartRendered) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setChartRendered(true);
                }
            },
            { rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [chartRendered]);

    useEffect(() => {
        if (chartRendered && canvasRef.current) {
            drawChart(canvasRef.current, positions);
        }
    }, [chartRendered]);

    const aggregated = aggregateSunPositions(positions);
    const hasValues = aggregated.some(d => d > 0);
    const captionId = `leg-sun-caption-${legIndex}`;

    return (
        <div ref={containerRef} className="leg-sun-direction">
            <figure className="leg-sun-figure">
                <figcaption id={captionId}>
                    <Text id="sun.chart.description"></Text>
                </figcaption>
                <div className="leg-sun-chart-container">
                    {chartRendered ? (
                        <canvas
                            ref={canvasRef}
                            tabIndex={0}
                            aria-labelledby={captionId}
                        >
                            <Text id="sun.chart.altText"></Text>
                        </canvas>
                    ) : (
                        <div
                            className="leg-sun-chart-placeholder"
                            aria-hidden="true"
                        ></div>
                    )}
                </div>
            </figure>
            {hasValues ? (
                <table className="leg-sun-table">
                    <caption>
                        <Text id="sun.position.description"></Text>
                    </caption>
                    <tbody>
                        <tr>
                            <td></td>
                            <th scope="col"><Text id="sun.position.direction"></Text></th>
                            <th scope="col"><Text id="sun.position.duration"></Text></th>
                        </tr>
                        {aggregated.map((durationInSeconds, index) => {
                            if (durationInSeconds <= 0) return null;
                            return (
                                <tr key={"position-" + index}>
                                    <td>
                                        <svg
                                            viewBox="0 0 32 32"
                                            style={{ '--heading-rotation': rotationByHeading[index] }}
                                            role="presentation"
                                            aria-hidden="true"
                                        >
                                            <title></title>
                                            <circle r="16" cx="16" cy="16" />
                                        </svg>
                                    </td>
                                    <td>
                                        <Text id={headingKeys[index]}></Text>
                                    </td>
                                    <td>
                                        {formatDurationInMinutes(Math.round(durationInSeconds / 60))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p className="leg-sun-empty">
                    <Text id="sun.positionsEmpty"></Text>
                </p>
            )}
        </div>
    );
}
