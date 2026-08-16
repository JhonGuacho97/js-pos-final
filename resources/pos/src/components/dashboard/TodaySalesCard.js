import React from 'react';
import { useSelector } from 'react-redux';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { getFormattedMessage } from '../../shared/sharedMethod';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const RANGE_TITLE_KEYS = {
    today: 'dashboard.today-sales.title',
    yesterday: 'dashboard.today-sales.title.yesterday',
    '7d': 'dashboard.today-sales.title.7d',
    '15d': 'dashboard.today-sales.title.15d',
    '30d': 'dashboard.today-sales.title.30d',
    '60d': 'dashboard.today-sales.title.60d',
    '90d': 'dashboard.today-sales.title.90d',
};

const TodaySalesCard = () => {
    const { frontSetting, todayOverview, todayHourlyBreakdown } = useSelector((state) => state);
    const currency = frontSetting?.value?.currency_symbol || '$';

    const totalSales = Number(todayOverview?.total_sales) || 0;
    const deltaPercent = todayOverview?.total_sales_vs_avg_percent;
    const hasDelta = deltaPercent !== null && deltaPercent !== undefined;
    const isPositive = hasDelta && Number(deltaPercent) >= 0;
    const avgBasket = Number(todayOverview?.avg_basket) || 0;
    const itemsSold = Number(todayOverview?.items_sold) || 0;
    const range = todayOverview?.range || 'today';

    const deltaLabelKey = range === 'today' ? 'dashboard.today-sales.vs-avg.label' : 'dashboard.today-sales.vs-previous.label';

    const granularity = todayHourlyBreakdown?.granularity || 'hourly';
    const labels = todayHourlyBreakdown?.labels || [];
    const sales = todayHourlyBreakdown?.sales || [];

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
                displayColors: false,
                callbacks: {
                    title: (items) => (granularity === 'hourly' ? `${items[0].label}:00` : items[0].label),
                    label: (item) => `${currency} ${Number(item.raw).toFixed(2)}`,
                },
            },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
        elements: { point: { radius: 0, hoverRadius: 4 } },
    };

    const data = {
        labels,
        datasets: [
            {
                data: sales,
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
        <div className="today-sales-card">
            <div className="today-sales-card-header">
                <span className="today-sales-card-title">
                    {range === 'custom' ? (
                        <>{getFormattedMessage('dashboard.today-sales.title.custom')} {todayOverview?.start_date} — {todayOverview?.end_date}</>
                    ) : (
                        getFormattedMessage(RANGE_TITLE_KEYS[range] || 'dashboard.today-sales.title')
                    )}
                </span>
                {hasDelta && (
                    <span className={`today-sales-card-delta ${isPositive ? 'stat-card-delta-up' : 'stat-card-delta-down'}`}>
                        <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} />
                        {Math.abs(Number(deltaPercent)).toFixed(1)}%
                        <span className="today-sales-card-delta-label"> {getFormattedMessage(deltaLabelKey)}</span>
                    </span>
                )}
            </div>
            <div className="today-sales-card-value">{currency} {totalSales.toFixed(2)}</div>
            <div className="today-sales-card-sparkline">
                <Line options={options} data={data} />
            </div>
            <div className="today-sales-card-footer">
                <div className="today-sales-card-metric">
                    <span className="today-sales-card-metric-label">{getFormattedMessage('dashboard.stat.avg-basket.label')}</span>
                    <span className="today-sales-card-metric-value">{currency} {avgBasket.toFixed(2)}</span>
                </div>
                <div className="today-sales-card-metric">
                    <span className="today-sales-card-metric-label">{getFormattedMessage('dashboard.stat.items-sold.label')}</span>
                    <span className="today-sales-card-metric-value">{itemsSold.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default TodaySalesCard;
