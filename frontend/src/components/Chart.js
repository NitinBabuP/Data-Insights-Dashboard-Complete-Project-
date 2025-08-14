import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Chart({ chartData }) {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: `${chartData.y_label} vs ${chartData.x_label}`,
                data: chartData.values,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: chartData.y_label
                }
            },
            x: {
                 title: {
                    display: true,
                    text: chartData.x_label
                }
            }
        },
    };

    return <Line data={data} options={options} />;
}

export default Chart;

---
