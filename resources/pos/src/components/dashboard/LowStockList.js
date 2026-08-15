import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { fetchStockAlert } from '../../store/action/stockAlertAction';

const LowStockList = (props) => {
    const { fetchStockAlert, stockAlertDetails } = props;

    useEffect(() => {
        fetchStockAlert(6);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = stockAlertDetails?.items || [];
    const total = stockAlertDetails?.total || 0;

    return (
        <div className="insight-card">
            <div className="insight-card-header">
                <span className="insight-card-title">{getFormattedMessage('dashboard.stockAlert.title')}</span>
                {total > 0 && <span className="insight-card-count-badge">{total}</span>}
            </div>
            {items.length === 0 ? (
                <div className="insight-empty">{getFormattedMessage('dashboard.low-stock.empty.label')}</div>
            ) : (
                <div className="low-stock-list">
                    {items.map((alert) => {
                        const quantity = Number(alert.stock?.quantity) || 0;
                        const threshold = Number(alert.stock_alert) || 0;
                        const percent = threshold > 0 ? Math.min(100, Math.round((quantity / threshold) * 100)) : 0;
                        const severity = percent <= 30 ? 'low-stock-bar-critical' : 'low-stock-bar-warning';
                        const reorderParams = new URLSearchParams();
                        if (alert.stock?.warehouse?.id) {
                            reorderParams.set('warehouse_id', alert.stock.warehouse.id);
                        }
                        if (alert.code) {
                            reorderParams.set('product_code', alert.code);
                        }

                        return (
                            <div className="low-stock-row" key={alert.id}>
                                <div className="low-stock-row-top">
                                    <span className="low-stock-name">
                                        {alert.name}
                                        {alert.variation_type_name && (
                                            <span className="text-primary fw-semibold"> - {alert.variation_type_name}</span>
                                        )}
                                    </span>
                                    <span className="low-stock-qty">{quantity} / {threshold} {alert.stock?.product_unit_name}</span>
                                </div>
                                <div className="low-stock-bar-track">
                                    <div className={`low-stock-bar-fill ${severity}`} style={{ width: `${percent}%` }} />
                                </div>
                                <div className="low-stock-row-bottom">
                                    <span className="low-stock-warehouse">{alert.stock?.warehouse?.name}</span>
                                    <Link className="low-stock-reorder-btn" to={`/app/purchases/create?${reorderParams.toString()}`}>
                                        {getFormattedMessage('dashboard.low-stock.reorder.label')}
                                    </Link>
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
    const { stockAlertDetails } = state;
    return { stockAlertDetails };
};

export default connect(mapStateToProps, { fetchStockAlert })(LowStockList);
