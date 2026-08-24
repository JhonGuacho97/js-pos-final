import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { formatNumber } from '../../shared/sharedMethod';

const formatValue = (value, format, currency) => {
    const num = Number(value) || 0;
    if (format === 'currency') {
        return `${currency} ${formatNumber(num, 2, 2)}`;
    }
    return formatNumber(num, 0, 0);
};

const StatCard = ({ title, value, deltaPercent, format = 'number', currency = '$', icon, iconClassName }) => {
    const hasDelta = deltaPercent !== null && deltaPercent !== undefined;
    const isPositive = hasDelta && Number(deltaPercent) >= 0;

    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <span className="stat-card-title">{title}</span>
                {icon && (
                    <span className={`stat-card-icon ${iconClassName || ''}`}>
                        <FontAwesomeIcon icon={icon} />
                    </span>
                )}
            </div>
            <div className="stat-card-value">{formatValue(value, format, currency)}</div>
            {hasDelta && (
                <div className={`stat-card-delta ${isPositive ? 'stat-card-delta-up' : 'stat-card-delta-down'}`}>
                    <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} />
                    <span>{Math.abs(Number(deltaPercent)).toFixed(1)}%</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
