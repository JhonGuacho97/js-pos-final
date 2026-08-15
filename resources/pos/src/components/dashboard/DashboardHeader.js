import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFormattedMessage } from '../../shared/sharedMethod';

const getGreetingKey = (hour) => {
    if (hour < 12) {
        return 'dashboard.header.greeting.morning';
    }
    if (hour < 19) {
        return 'dashboard.header.greeting.afternoon';
    }
    return 'dashboard.header.greeting.evening';
};

const DashboardHeader = ({ activeCashiersCount }) => {
    const { stores, currentStoreId } = useSelector((state) => state.myStores);
    const currentStoreName = stores.find((s) => String(s.id) === String(currentStoreId))?.name;

    const loginUser = JSON.parse(localStorage.getItem('loginUserArray') || 'null');
    const firstName = loginUser?.first_name || '';

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000 * 30);
        return () => clearInterval(timer);
    }, []);

    const guayaquilHour = Number(
        new Intl.DateTimeFormat('en-US', { timeZone: 'America/Guayaquil', hour: 'numeric', hour12: false }).format(now)
    );

    const dateLabel = new Intl.DateTimeFormat('es-EC', {
        timeZone: 'America/Guayaquil',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(now);

    const timeLabel = new Intl.DateTimeFormat('es-EC', {
        timeZone: 'America/Guayaquil',
        hour: '2-digit',
        minute: '2-digit',
    }).format(now);

    return (
        <div className="dash-header">
            <div className="dash-header-left">
                <h2 className="dash-header-greeting">
                    {getFormattedMessage(getGreetingKey(guayaquilHour))}{firstName ? `, ${firstName}` : ''}
                </h2>
                <div className="dash-header-meta">
                    <span className="dash-header-live">
                        <span className="dash-header-live-dot" />
                        {getFormattedMessage('dashboard.header.live.label')}
                    </span>
                    <span className="dash-header-sep">&middot;</span>
                    <span className="dash-header-date text-capitalize">{dateLabel}</span>
                    <span className="dash-header-sep">&middot;</span>
                    <span className="dash-header-time">{timeLabel}</span>
                </div>
            </div>
            <div className="dash-header-right">
                {currentStoreName && (
                    <div className="dash-header-chip">
                        <span className="dash-header-chip-label">{getFormattedMessage('dashboard.header.store.label')}</span>
                        <span className="dash-header-chip-value">{currentStoreName}</span>
                    </div>
                )}
                <div className="dash-header-chip">
                    <span className="dash-header-chip-label">{getFormattedMessage('dashboard.header.cashiers.label')}</span>
                    <span className="dash-header-chip-value">{activeCashiersCount ?? 0}</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
