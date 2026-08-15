import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { recentSales } from '../../store/action/recentSaleDashboardAction';

dayjs.extend(relativeTime);

const ActivityFeed = (props) => {
    const { recentSales, recentSalesDashboard, frontSetting, allConfigData } = props;
    const currency = frontSetting?.value?.currency_symbol || '$';

    useEffect(() => {
        recentSales(8);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = recentSalesDashboard || [];

    return (
        <div className="insight-card">
            <div className="insight-card-header">
                <span className="insight-card-title">{getFormattedMessage('dashboard.recentSales.title')}</span>
            </div>
            {items.length === 0 ? (
                <div className="insight-empty">{getFormattedMessage('dashboard.activity-feed.empty.label')}</div>
            ) : (
                <div className="activity-feed-list">
                    {items.map((sale) => {
                        const attrs = sale.attributes;
                        return (
                            <div className="activity-feed-row" key={sale.id}>
                                <span className="activity-feed-dot" />
                                <div className="activity-feed-body">
                                    <div className="activity-feed-line">
                                        <span className="activity-feed-ref">{attrs.reference_code}</span>
                                        <span className="activity-feed-customer">{attrs.customer_name}</span>
                                        <span className="activity-feed-amount">{currency} {Number(attrs.grand_total).toFixed(2)}</span>
                                    </div>
                                    <div className="activity-feed-meta">
                                        {attrs.user_name && <span>{attrs.user_name}</span>}
                                        <span>{dayjs(attrs.created_at).locale('es').fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    const { recentSalesDashboard, allConfigData, frontSetting } = state;
    return { recentSalesDashboard, allConfigData, frontSetting };
};

export default connect(mapStateToProps, { recentSales })(ActivityFeed);
