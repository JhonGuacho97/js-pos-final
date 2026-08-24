import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber, getFormattedMessage } from '../../shared/sharedMethod';
import { fetchSalesHeatmap } from '../../store/action/salesHeatmapAction';

const DAY_LABELS = {
    Mon: 'Lun', Tue: 'Mar', Wed: 'Mié', Thu: 'Jue', Fri: 'Vie', Sat: 'Sáb', Sun: 'Dom',
};

const DAY_LABELS_FULL = {
    Mon: 'dashboard.heatmap.day.monday',
    Tue: 'dashboard.heatmap.day.tuesday',
    Wed: 'dashboard.heatmap.day.wednesday',
    Thu: 'dashboard.heatmap.day.thursday',
    Fri: 'dashboard.heatmap.day.friday',
    Sat: 'dashboard.heatmap.day.saturday',
    Sun: 'dashboard.heatmap.day.sunday',
};

// Escala de intensidad usando el azul primario del sistema ($cyan/#2F6FED
// en resources/pos/src/assets/scss/components/_variables.scss), no un
// color ajeno al resto del dashboard.
const SWATCHES = ['#eaf1fd', '#c3d9fb', '#8fb7f7', '#5b8ff2', '#2F6FED'];

const intensityColor = (value, max) => {
    if (!max || value <= 0) {
        return SWATCHES[0];
    }
    const ratio = value / max;
    if (ratio <= 0.15) return SWATCHES[0];
    if (ratio <= 0.35) return SWATCHES[1];
    if (ratio <= 0.6) return SWATCHES[2];
    if (ratio <= 0.85) return SWATCHES[3];
    return SWATCHES[4];
};

const TOOLTIP_WIDTH = 260;
const TOOLTIP_HEIGHT_ESTIMATE = 260;

const SalesHeatmap = () => {
    const dispatch = useDispatch();
    const { frontSetting, salesHeatmap } = useSelector((state) => state);
    const currency = frontSetting?.value?.currency_symbol || '$';
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        dispatch(fetchSalesHeatmap());
    }, [dispatch]);

    const days = salesHeatmap?.days || [];
    const hours = salesHeatmap?.hours || [];
    const salesMatrix = salesHeatmap?.sales || [];
    const transactionsMatrix = salesHeatmap?.transactions || [];
    const itemsMatrix = salesHeatmap?.items || [];
    const max = salesHeatmap?.max || 0;

    const weekTotal = salesMatrix.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);

    const handleMouseEnter = (event, dayIndex, hourIndex) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.right;
        const left = spaceRight > TOOLTIP_WIDTH + 16 ? rect.right + 10 : rect.left - TOOLTIP_WIDTH - 10;
        const spaceBelow = window.innerHeight - rect.top;
        const top = spaceBelow > TOOLTIP_HEIGHT_ESTIMATE
            ? rect.top
            : Math.max(8, window.innerHeight - TOOLTIP_HEIGHT_ESTIMATE - 8);
        setHovered({ dayIndex, hourIndex, left, top });
    };

    const renderTooltip = () => {
        if (!hovered) {
            return null;
        }
        const { dayIndex, hourIndex, left, top } = hovered;
        const day = days[dayIndex];
        const hour = hours[hourIndex];
        const sales = salesMatrix[dayIndex]?.[hourIndex] || 0;
        const transactions = transactionsMatrix[dayIndex]?.[hourIndex] || 0;
        const items = itemsMatrix[dayIndex]?.[hourIndex] || 0;
        const dayTotal = (salesMatrix[dayIndex] || []).reduce((a, b) => a + b, 0);
        const avgSale = transactions > 0 ? sales / transactions : 0;
        const shareOfDay = dayTotal > 0 ? (sales / dayTotal) * 100 : 0;
        const shareOfWeek = weekTotal > 0 ? (sales / weekTotal) * 100 : 0;
        const vsPeak = max > 0 ? (sales / max) * 100 : 0;
        const nextHour = String((parseInt(hour, 10) + 1) % 24).padStart(2, '0');

        return (
            <div className="heatmap-tooltip" style={{ left, top }}>
                <div className="heatmap-tooltip-header">
                    <span className="heatmap-tooltip-day">{getFormattedMessage(DAY_LABELS_FULL[day] || day)}</span>
                    <span className="heatmap-tooltip-time">{hour}:00 — {nextHour}:00</span>
                </div>
                <div className="heatmap-tooltip-sales-row">
                    <span className="heatmap-tooltip-dot" />
                    <span className="heatmap-tooltip-sales-label">{getFormattedMessage('dashboard.heatmap.tooltip.sales.label')}</span>
                    <span className="heatmap-tooltip-sales-value">{currency} {formatNumber(sales, 2, 2)}</span>
                </div>
                <div className="heatmap-tooltip-row">
                    <span>{getFormattedMessage('dashboard.heatmap.tooltip.transactions.label')}</span>
                    <span>{formatNumber(transactions, 0, 0)}</span>
                </div>
                <div className="heatmap-tooltip-row">
                    <span>{getFormattedMessage('dashboard.heatmap.tooltip.items.label')}</span>
                    <span>{formatNumber(items, 2, 2)}</span>
                </div>
                <div className="heatmap-tooltip-row">
                    <span>{getFormattedMessage('dashboard.heatmap.tooltip.avg-sale.label')}</span>
                    <span>{currency} {formatNumber(avgSale, 2, 2)}</span>
                </div>
                <div className="heatmap-tooltip-row">
                    <span>{getFormattedMessage('dashboard.heatmap.tooltip.share-of-day.label')}</span>
                    <span>{shareOfDay.toFixed(1)}%</span>
                </div>
                <div className="heatmap-tooltip-row">
                    <span>{getFormattedMessage('dashboard.heatmap.tooltip.vs-peak.label')}</span>
                    <span>{vsPeak.toFixed(0)}%</span>
                </div>
                <div className="heatmap-tooltip-footer">
                    {shareOfWeek.toFixed(1)}% {getFormattedMessage('dashboard.heatmap.tooltip.of-week-sales.label')}
                </div>
            </div>
        );
    };

    return (
        <div className="insight-card heatmap-card">
            <div className="heatmap-header">
                <div>
                    <span className="insight-card-title">{getFormattedMessage('dashboard.heatmap.title')}</span>
                    <div className="heatmap-subtitle">{getFormattedMessage('dashboard.heatmap.subtitle')}</div>
                </div>
                <div className="heatmap-legend">
                    <span>{getFormattedMessage('dashboard.heatmap.low.label')}</span>
                    {SWATCHES.map((color) => (
                        <span key={color} className="heatmap-legend-swatch" style={{ backgroundColor: color }} />
                    ))}
                    <span>{getFormattedMessage('dashboard.heatmap.high.label')}</span>
                </div>
            </div>
            <div className="heatmap-range">00:00 — 23:59</div>
            {days.length === 0 ? (
                <div className="insight-empty">{getFormattedMessage('dashboard.heatmap.empty.label')}</div>
            ) : (
                <div className="heatmap-scroll">
                    <div className="heatmap-grid">
                        <div className="heatmap-row heatmap-row-labels">
                            <span className="heatmap-day-label" />
                            {hours.map((hour) => (
                                <span className="heatmap-hour-label" key={hour}>{hour}</span>
                            ))}
                        </div>
                        {days.map((day, dayIndex) => (
                            <div className="heatmap-row" key={day}>
                                <span className="heatmap-day-label">{DAY_LABELS[day] || day}</span>
                                {hours.map((hour, hourIndex) => {
                                    const value = salesMatrix[dayIndex]?.[hourIndex] || 0;
                                    return (
                                        <span
                                            className="heatmap-cell"
                                            key={hour}
                                            style={{ backgroundColor: intensityColor(value, max) }}
                                            onMouseEnter={(event) => handleMouseEnter(event, dayIndex, hourIndex)}
                                            onMouseLeave={() => setHovered(null)}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {renderTooltip()}
        </div>
    );
};

export default SalesHeatmap;
