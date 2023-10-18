import { useEffect, useRef } from "preact/hooks";

import { drawChart } from '../services/chart';

export function SunPositionChart(props) {
    const canvasRef = useRef()

    useEffect(() => {
        drawChart(canvasRef.current, props.positions)
    }, [canvasRef.current])

    return (<>
        <canvas ref={canvasRef}></canvas>
    </>)
}