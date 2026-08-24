import React from 'react';
import ReactECharts from 'echarts-for-react';
import { formatNumber, getFormattedMessage } from '../../shared/sharedMethod';

// Ancla en el azul primario del sistema (#2F6FED, ver _variables.scss)
// en vez de un naranja ajeno al resto del dashboard.
const COLORS = ['#2F6FED', '#8b5cf6', '#14b8a6', '#f0b429', '#ec4899', '#22c55e', '#9ca3af'];

const CategoryMixDonut = ({ categories, total, currency = '$' }) => {
    const rows = categories || [];

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: (params) => `${params.name}: ${currency} ${formatNumber(params.value, 2, 2)} (${params.percent}%)`,
        },
        color: COLORS,
        series: [
            {
                type: 'pie',
                radius: ['62%', '85%'],
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                data: rows.map((row) => ({ value: row.total, name: row.category_name })),
            },
        ],
    };

    return (
        <div className="category-mix-donut">
            <div className="category-mix-donut-chart">
                <ReactECharts option={option} style={{ height: 220, width: 220 }} />
                <div className="category-mix-donut-center">
                    <div className="category-mix-donut-center-value">{currency} {formatNumber(total, 2, 2)}</div>
                    <div className="category-mix-donut-center-label">{getFormattedMessage('dashboard.category-mix.total.label')}</div>
                </div>
            </div>
            <div className="category-mix-donut-legend">
                {rows.map((row, index) => (
                    <div className="category-mix-donut-legend-row" key={row.category_name}>
                        <span className="category-mix-donut-legend-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="category-mix-donut-legend-name">{row.category_name}</span>
                        <span className="category-mix-donut-legend-value">{currency} {formatNumber(row.total, 2, 2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryMixDonut;
