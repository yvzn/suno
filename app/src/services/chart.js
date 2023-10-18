import { Chart, PolarAreaController, ArcElement, RadialLinearScale } from 'chart.js';

import carImage from '/car.svg';

Chart.register(PolarAreaController, ArcElement, RadialLinearScale);

export function drawChart(canvasElement, chartData) {
    if (canvasElement) {
        renderChart(canvasElement, chartData);
    }
}

const backgroundImage = new Image();
backgroundImage.src = carImage;

const customBackgroundImagePlugin = {
    id: 'customCanvasBackgroundImage',
    beforeDraw: (chart) => {
        if (backgroundImage.complete) {
            const { ctx } = chart;
            const { width, height } = chart.chartArea;
            ctx.drawImage(backgroundImage, 0, 0, width, height);
        } else {
            backgroundImage.onload = () => chart.draw();
        }
    }
};

function renderChart(canvasElement, chartData) {
    return new Chart(canvasElement, {
        type: 'polarArea',
        data: {
            datasets: [
                {
                    data: chartData,
                    backgroundColor: ['#ffb703aa'],
                },
            ],
        },
        options: {
            scales: {
                r: {
                    display: false,
                },
            },
        },
        plugins: [customBackgroundImagePlugin],
    });
}
