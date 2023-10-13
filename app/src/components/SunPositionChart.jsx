import { useEffect, useRef, useState } from "preact/hooks";
import { Text } from 'preact-i18n';

import { getDirections } from '../services/api';
import { drawChart } from '../services/chart';
import { computeSunDirectionAggregated } from "../services/sun-position";


export function SunPositionChart(props) {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const canvasRef = useRef()

    const getDirectionsAndRenderChart = () => {
        setError(undefined);

        setLoading(true);
        getDirections(props.journey)
            .then((directions) => {
                const data = computeSunDirectionAggregated(directions, props.journey.startDate)
                return drawChart(canvasRef.current, data);
            }, setError)
            .finally(() => setLoading(false));
    }

    useEffect(getDirectionsAndRenderChart, [])

    return (<>
        {isLoading && (
            <section>
                <Text id="fetch.loading">Loading...</Text>
            </section>
        )}
        {error && (
            <section>
                <p>
                    <Text id="fetch.error">Error</Text>
                </p>
                <a href="#" onClick={getDirectionsAndRenderChart}>
                    <Text id="fetch.retry">Retry</Text>
                </a>
            </section>
        )}
        <canvas ref={canvasRef}></canvas>
    </>)
}