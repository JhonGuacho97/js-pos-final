import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFormattedMessage } from '../../shared/sharedMethod';
import TodaySalesFilter from './TodaySalesFilter';

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
                    {currentStoreName && (
                        <>
                            <span className="dash-header-sep">&middot;</span>
                            <span className="dash-header-store">{currentStoreName}</span>
                        </>
                    )}
                    <span className="dash-header-sep">&middot;</span>
                    <span className="dash-header-cashiers">
                        {(activeCashiersCount ?? 0)} {getFormattedMessage('dashboard.header.cashiers.label')}
                    </span>
                </div>
            </div>
            <div className="dash-header-right">
                <TodaySalesFilter />
            </div>
        </div>
    );
};

export default DashboardHeader;
