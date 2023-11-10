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
            <figcaption>
                <Text id="sun.description">Sun position in minutes</Text>
            </figcaption>
            <section id="chart-container">
                <canvas ref={canvasRef} tabIndex={0}>
                    <Text id="sun.altText">Sun position chart</Text>    
                </canvas>
            </section>
        </figure>
    )
}