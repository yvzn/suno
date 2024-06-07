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
        <section id="sun-position-chart">
            <figure>
                <figcaption>
                    <Text id="sun.chart.description"></Text>
                </figcaption>
                <div id="chart-container">
                    <canvas ref={canvasRef} tabIndex={0}>
                        <Text id="sun.chart.altText"></Text>
                    </canvas>
                </div>
            </figure>
        </section>
    )
}