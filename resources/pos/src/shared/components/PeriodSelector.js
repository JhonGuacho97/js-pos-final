import React from 'react';

const PERIOD_OPTIONS = [
    { value: '7d', label: '7d' },
    { value: '14d', label: '14d' },
    { value: '30d', label: '30d' },
];

const PeriodSelector = ({ value, onChange }) => {
    return (
        <div className="period-selector">
            {PERIOD_OPTIONS.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`period-selector-btn ${value === option.value ? 'period-selector-btn-active' : ''}`}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default PeriodSelector;
