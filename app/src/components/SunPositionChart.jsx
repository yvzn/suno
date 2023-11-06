import { useEffect, useRef } from "preact/hooks";

import { drawChart } from '../services/chart';

import './SunPositionChart.css';

export function SunPositionChart(props) {
    const canvasRef = useRef()

    useEffect(() => {
        drawChart(canvasRef.current, props.positions)
    }, [canvasRef.current])

    return (
        <section id="chart-container">
            <canvas ref={canvasRef}></canvas>
        </section>
    )
}