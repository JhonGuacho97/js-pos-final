import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { fetchTodayOverview } from '../../store/action/todayOverviewAction';
import { fetchTodayHourlyBreakdown } from '../../store/action/todayHourlyBreakdownAction';

const RANGE_OPTIONS = [
    { value: 'today', labelKey: 'dashboard.filter.today' },
    { value: 'yesterday', labelKey: 'dashboard.filter.yesterday' },
    { value: '7d', labelKey: 'dashboard.filter.last-7-days' },
    { value: '15d', labelKey: 'dashboard.filter.last-15-days' },
    { value: '30d', labelKey: 'dashboard.filter.last-30-days' },
    { value: '60d', labelKey: 'dashboard.filter.last-60-days' },
    { value: '90d', labelKey: 'dashboard.filter.last-90-days' },
];

const TodaySalesFilter = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState('today');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [appliedLabel, setAppliedLabel] = useState(null);

    const applyRange = (value, params) => {
        setRange(value);
        dispatch(fetchTodayOverview(params));
        dispatch(fetchTodayHourlyBreakdown(params));
        setOpen(false);
    };

    const onSelectFixedRange = (value) => {
        setAppliedLabel(null);
        applyRange(value, { range: value });
    };

    const onApplyCustomRange = () => {
        if (!customFrom || !customTo) {
            return;
        }
        setAppliedLabel(`${customFrom} — ${customTo}`);
        applyRange('custom', { range: 'custom', from: customFrom, to: customTo });
    };

    const toggleLabel = appliedLabel
        || getFormattedMessage(RANGE_OPTIONS.find((option) => option.value === range)?.labelKey || 'dashboard.filter.today');

    return (
        <Dropdown align="end" show={open} onToggle={(next) => setOpen(next)}>
            <Dropdown.Toggle as="div" className="dash-filter-toggle hide-arrow" id="dash-range-filter-dropdown">
                <FontAwesomeIcon icon={faArrowsRotate} className="dash-filter-toggle-icon" />
                <span>{toggleLabel}</span>
                <span className="dash-filter-toggle-chevron">▾</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dash-filter-menu">
                {RANGE_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`dash-filter-option ${range === option.value && !appliedLabel ? 'dash-filter-option-active' : ''}`}
                        onClick={() => onSelectFixedRange(option.value)}
                    >
                        <span>{getFormattedMessage(option.labelKey)}</span>
                        {range === option.value && !appliedLabel && <FontAwesomeIcon icon={faCheck} />}
                    </button>
                ))}
                <div className="dash-filter-divider" />
                <div className="dash-filter-custom-label">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{getFormattedMessage('dashboard.filter.custom-range')}</span>
                </div>
                <div className="dash-filter-custom-field">
                    <label>{getFormattedMessage('dashboard.filter.from')}</label>
                    <input
                        type="date"
                        value={customFrom}
                        max={customTo || undefined}
                        onChange={(event) => setCustomFrom(event.target.value)}
                    />
                </div>
                <div className="dash-filter-custom-field">
                    <label>{getFormattedMessage('dashboard.filter.to')}</label>
                    <input
                        type="date"
                        value={customTo}
                        min={customFrom || undefined}
                        onChange={(event) => setCustomTo(event.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="dash-filter-apply-btn"
                    disabled={!customFrom || !customTo}
                    onClick={onApplyCustomRange}
                >
                    {getFormattedMessage('dashboard.filter.apply')}
                </button>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default TodaySalesFilter;
