import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { fetchTopProducts } from '../../store/action/topProductsAction';

const PERIODS = [
    { value: 'today', label: 'Hoy' },
    { value: '7d', label: '7d' },
    { value: '14d', label: '14d' },
    { value: '30d', label: '30d' },
];

const TopProductsList = () => {
    const dispatch = useDispatch();
    const { frontSetting, topProducts } = useSelector((state) => state);
    const currency = frontSetting?.value?.currency_symbol || '$';
    const [period, setPeriod] = useState('7d');

    useEffect(() => {
        dispatch(fetchTopProducts(period, 5));
    }, [dispatch, period]);

    const rows = topProducts || [];

    return (
        <div className="insight-card">
            <div className="insight-card-header">
                <span className="insight-card-title">{getFormattedMessage('dashboard.top-products.title')}</span>
                <div className="insight-period-tabs">
                    {PERIODS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`insight-period-tab ${period === option.value ? 'insight-period-tab-active' : ''}`}
                            onClick={() => setPeriod(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
            {rows.length === 0 ? (
                <div className="insight-empty">{getFormattedMessage('dashboard.top-products.empty.label')}</div>
            ) : (
                <div className="top-products-list">
                    {rows.map((row) => {
                        const imageUrl = row.image && row.image.imageUrls && row.image.imageUrls[0];
                        return (
                            <div className="top-products-row" key={row.product_id}>
                                <span className="top-products-rank">{row.rank}</span>
                                {imageUrl ? (
                                    <img className="top-products-thumb" src={imageUrl} alt={row.name} />
                                ) : (
                                    <span className="top-products-thumb top-products-thumb-placeholder">
                                        {row.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                                <div className="top-products-info">
                                    <span className="top-products-name">
                                        {row.name}
                                        {row.variation_type_name && (
                                            <span className="text-primary fw-semibold"> - {row.variation_type_name}</span>
                                        )}
                                    </span>
                                    <span className="top-products-category">{row.product_category_name || '-'}</span>
                                </div>
                                <div className="top-products-metrics">
                                    <span className="top-products-qty">{row.total_quantity} {row.sale_unit}</span>
                                    <span className="top-products-total">{currency} {Number(row.grand_total).toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TopProductsList;
