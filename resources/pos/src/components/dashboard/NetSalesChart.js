import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatNumber } from '../../shared/sharedMethod';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Formatea directo desde el string "YYYY-MM-DD" sin pasar por Date/dayjs,
// para no arrastrar el mismo bug de huso horario ya corregido en otras
// partes de esta app (parseo naive de fecha-solo desplaza el día en
// zonas UTC-negativas como Ecuador).
const formatDateLabel = (dateStr) => {
    const [, month, day] = dateStr.split('-');
    return `${day} ${MONTHS[parseInt(month, 10) - 1]}`;
};

const formatCompactCurrency = (value, currency) => {
    const num = Number(value) || 0;
    return `${currency} ${formatNumber(num, 0, Math.abs(num) >= 1000 ? 1 : 0)}`;
};

const NetSalesChart = ({ dates, current, previous, currency = '$' }) => {
    const labels = (dates || []).map(formatDateLabel);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e1e2e',
                titleColor: '#a8a8b8',
                bodyColor: '#ffffff',
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: (item) => `${item.dataset.label}: ${currency} ${formatNumber(item.raw, 2, 2)}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: '#9ca3af', font: { size: 11 }, maxRotation: 0, autoSkip: true },
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                border: { display: false },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 11 },
                    callback: (v) => formatCompactCurrency(v, currency),
                },
            },
        },
        elements: { point: { radius: 0, hoverRadius: 4 } },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Anterior',
                data: previous || [],
                borderColor: '#c9cdd6',
                borderDash: [4, 4],
                borderWidth: 1.5,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#c9cdd6',
            },
            {
                label: 'Actual',
                data: current || [],
                borderColor: '#2F6FED',
                backgroundColor: 'rgba(47, 111, 237, 0.12)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#2F6FED',
            },
        ],
    };

    return (
        <div style={{ position: 'relative', height: '260px' }}>
            <Line options={options} data={data} />
        </div>
    );
};

export default NetSalesChart;
