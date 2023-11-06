import { useEffect, useRef } from "preact/hooks";
import { Text } from "preact-i18n";

import { drawChart } from '../services/chart';

import './SunPositionChart.css';

export function SunPositionChart(props) {
    const canvasRef = useRef()

    useEffect(() => {
        drawChart(canvasRef.current, props.positions)
    }, [canvasRef.current])

    return (
        <figure>
            <section id="chart-container">
                <canvas ref={canvasRef}></canvas>
            </section>
            <figcaption>
                <Text id="sun.description">Sun position in minutes</Text>
            </figcaption>
        </figure>
    )
}