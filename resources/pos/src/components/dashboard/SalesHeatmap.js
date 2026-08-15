import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { fetchSalesHeatmap } from '../../store/action/salesHeatmapAction';

const DAY_LABELS = {
    Mon: 'Lun', Tue: 'Mar', Wed: 'Mié', Thu: 'Jue', Fri: 'Vie', Sat: 'Sáb', Sun: 'Dom',
};

const SWATCHES = ['#fdf1e7', '#fbd9b9', '#f7ab5e', '#f7823a', '#e8590c'];

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

const SalesHeatmap = () => {
    const dispatch = useDispatch();
    const { frontSetting, salesHeatmap } = useSelector((state) => state);
    const currency = frontSetting?.value?.currency_symbol || '$';

    useEffect(() => {
        dispatch(fetchSalesHeatmap());
    }, [dispatch]);

    const days = salesHeatmap?.days || [];
    const hours = salesHeatmap?.hours || [];
    const matrix = salesHeatmap?.matrix || [];
    const max = salesHeatmap?.max || 0;

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
                                    const value = matrix[dayIndex]?.[hourIndex] || 0;
                                    return (
                                        <span
                                            className="heatmap-cell"
                                            key={hour}
                                            style={{ backgroundColor: intensityColor(value, max) }}
                                            title={value > 0 ? `${DAY_LABELS[day] || day} ${hour}:00 — ${currency} ${value.toFixed(2)}` : ''}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHeatmap;
