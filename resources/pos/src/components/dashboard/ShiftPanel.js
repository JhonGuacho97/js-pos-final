import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatNumber, getFormattedMessage } from '../../shared/sharedMethod';
import { fetchActiveShifts } from '../../store/action/activeShiftsAction';

const ShiftPanel = () => {
    const dispatch = useDispatch();
    const { frontSetting, activeShifts } = useSelector((state) => state);
    const currency = frontSetting?.value?.currency_symbol || '$';

    useEffect(() => {
        dispatch(fetchActiveShifts());
    }, [dispatch]);

    const shifts = activeShifts || [];

    return (
        <div className="insight-card">
            <div className="insight-card-header">
                <div>
                    <span className="insight-card-title">{getFormattedMessage('dashboard.shift.title')}</span>
                    <div className="heatmap-subtitle">{getFormattedMessage('dashboard.shift.subtitle')}</div>
                </div>
                <Link className="insight-card-link" to="/app/report/register">
                    {getFormattedMessage('dashboard.shift.manage.label')}
                </Link>
            </div>
            {shifts.length === 0 ? (
                <div className="insight-empty">{getFormattedMessage('dashboard.shift.empty.label')}</div>
            ) : (
                <div className="shift-table">
                    <div className="shift-table-head">
                        <span>{getFormattedMessage('dashboard.shift.staff.label')}</span>
                        <span>{getFormattedMessage('dashboard.shift.status.label')}</span>
                        <span className="shift-col-right">{getFormattedMessage('dashboard.shift.sales.label')}</span>
                        <span className="shift-col-right">{getFormattedMessage('dashboard.shift.txns.label')}</span>
                    </div>
                    {shifts.map((shift) => (
                        <div className="shift-table-row" key={shift.user_id}>
                            <div className="shift-staff-cell">
                                <span className="shift-avatar">{shift.name?.charAt(0)?.toUpperCase()}</span>
                                <span className="shift-name">{shift.name}</span>
                            </div>
                            <span>
                                <span className={`shift-status-badge ${shift.status === 'on' ? 'shift-status-on' : 'shift-status-off'}`}>
                                    <span className="shift-status-dot" />
                                    {shift.status === 'on'
                                        ? getFormattedMessage('dashboard.shift.status.on.label')
                                        : getFormattedMessage('dashboard.shift.status.off.label')}
                                </span>
                            </span>
                            <span className="shift-col-right shift-sales-value">{currency} {formatNumber(shift.sales_amount, 2, 2)}</span>
                            <span className="shift-col-right">{formatNumber(shift.transaction_count, 0, 0)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShiftPanel;
