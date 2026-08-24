import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import PeriodSelector from '../../shared/components/PeriodSelector';
import NetSalesChart from './NetSalesChart';
import CategoryMixDonut from './CategoryMixDonut';
import { formatNumber, getFormattedMessage } from '../../shared/sharedMethod';
import { fetchPerformanceNetSales } from '../../store/action/performanceNetSalesAction';
import { fetchCategoryMix } from '../../store/action/categoryMixAction';

const Delta = ({ percent }) => {
    if (percent === null || percent === undefined) {
        return null;
    }
    const isPositive = Number(percent) >= 0;
    return (
        <span className={`performance-delta ${isPositive ? 'stat-card-delta-up' : 'stat-card-delta-down'}`}>
            <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} />
            {Math.abs(Number(percent)).toFixed(1)}%
        </span>
    );
};

const PerformanceSection = () => {
    const dispatch = useDispatch();
    const { frontSetting, performanceNetSales, categoryMix } = useSelector((state) => state);
    const currency = frontSetting?.value?.currency_symbol || '$';
    const [period, setPeriod] = useState('14d');

    useEffect(() => {
        dispatch(fetchPerformanceNetSales(period));
        dispatch(fetchCategoryMix(period));
    }, [dispatch, period]);

    const netSalesCurrent = Number(performanceNetSales?.net_sales_total_current) || 0;
    const avgBasketCurrent = Number(performanceNetSales?.avg_basket_current) || 0;
    const grossMarginCurrent = Number(performanceNetSales?.gross_margin_percent_current) || 0;

    return (
        <div className="performance-section">
            <div className="performance-section-header">
                <h5 className="performance-section-title">{getFormattedMessage('dashboard.performance.title')}</h5>
                <PeriodSelector value={period} onChange={setPeriod} />
            </div>
            <Row className="g-3">
                <Col lg={8}>
                    <div className="performance-card">
                        <div className="performance-card-title">{getFormattedMessage('dashboard.performance.net-sales.title')}</div>
                        <div className="performance-card-subtitle">
                            {period} {getFormattedMessage('dashboard.performance.net-sales.vs-previous.label')}
                        </div>
                        <div className="performance-metrics-row">
                            <div className="performance-metric">
                                <span className="performance-metric-label">{getFormattedMessage('dashboard.performance.net-sales.title')}</span>
                                <div className="performance-metric-value-row">
                                    <span className="performance-metric-value">{currency} {formatNumber(netSalesCurrent, 2, 2)}</span>
                                    <Delta percent={performanceNetSales?.net_sales_vs_previous_percent} />
                                </div>
                            </div>
                            <div className="performance-metric">
                                <span className="performance-metric-label">{getFormattedMessage('dashboard.performance.avg-basket.label')}</span>
                                <div className="performance-metric-value-row">
                                    <span className="performance-metric-value">{currency} {formatNumber(avgBasketCurrent, 2, 2)}</span>
                                    <Delta percent={performanceNetSales?.avg_basket_vs_previous_percent} />
                                </div>
                            </div>
                            <div className="performance-metric">
                                <span className="performance-metric-label">{getFormattedMessage('dashboard.performance.gross-margin.label')}</span>
                                <div className="performance-metric-value-row">
                                    <span className="performance-metric-value">{grossMarginCurrent.toFixed(1)}%</span>
                                    <Delta percent={performanceNetSales?.gross_margin_vs_previous_percent} />
                                </div>
                            </div>
                        </div>
                        <NetSalesChart
                            dates={performanceNetSales?.dates}
                            current={performanceNetSales?.net_sales_current}
                            previous={performanceNetSales?.net_sales_previous}
                            currency={currency}
                        />
                    </div>
                </Col>
                <Col lg={4}>
                    <div className="performance-card">
                        <div className="performance-card-title-row">
                            <span className="performance-card-title">{getFormattedMessage('dashboard.performance.category-mix.title')}</span>
                            <span className="performance-card-period-tag">{period}</span>
                        </div>
                        <CategoryMixDonut
                            categories={categoryMix?.categories}
                            total={categoryMix?.total}
                            currency={currency}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PerformanceSection;
