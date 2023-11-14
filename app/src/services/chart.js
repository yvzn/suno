import { Chart, PolarAreaController, ArcElement, RadialLinearScale, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { formatDurationInMinutes } from './duration';

import carImage from '/car.svg';

Chart.register(PolarAreaController, ArcElement, RadialLinearScale, Tooltip, ChartDataLabels);

export function drawChart(canvasElement, chartData) {
    if (canvasElement) {
        // chart.js uses a clockwise order for polar charts
        const polarChartData = [...chartData].reverse();
        const chartDataInMinutes = polarChartData.map(seconds => Math.round(seconds / 60));

        renderChart(canvasElement, chartDataInMinutes);
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
                    label: 'duration',
                    backgroundColor: ['#ffb703aa'],
                },
            ],
        },
        options: {
            scales: {
                r: {
                    display: true,
                    ticks: {
                        callback: function (value, _index, _ticks) {
                            return value + "min";
                        }
                    }
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.dataset.data[context.dataIndex];
                            return ` ${label}: ${formatDurationInMinutes(value)}`;
                        }
                    }
                },
                datalabels: {
                    formatter: function (value, context) {
                        return value && (value > Math.max(...context.dataset.data) * .1) ? formatDurationInMinutes(value) : "";
                    }
                }
            }
        },
        plugins: [customBackgroundImagePlugin],
    });
}
