import { useEffect, useRef } from "preact/hooks"

import { getDirections } from '../services/api';
import { drawChart } from '../services/chart';


export function SunPositionChart(props) {
    const canvasRef = useRef()

    useEffect(() => {
        getDirections(props.journey).then(drawChart(canvasRef.current))
    }, [canvasRef.current])

    return (<canvas ref={canvasRef}></canvas>)
}