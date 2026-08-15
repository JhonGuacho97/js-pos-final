import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faUserPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import DashboardHeader from './DashboardHeader';
import TodaySalesCard from './TodaySalesCard';
import StatCard from './StatCard';
import PerformanceSection from './PerformanceSection';
import CatalogInsightsRow from './CatalogInsightsRow';
import InsightsRow from './InsightsRow';
import { fetchTodayOverview } from '../../store/action/todayOverviewAction';
import { fetchTodayHourlyBreakdown } from '../../store/action/todayHourlyBreakdownAction';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { frontSetting, todayOverview } = useSelector( state => state );
    const currency = frontSetting?.value?.currency_symbol || '$';

    useEffect(() => {
        dispatch(fetchTodayOverview());
        dispatch(fetchTodayHourlyBreakdown());
    }, [dispatch]);

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'dashboard.title' )} />
            <DashboardHeader activeCashiersCount={todayOverview?.active_cashiers_count} />
            <Row className="g-3 mb-4">
                <Col lg={8}>
                    <TodaySalesCard />
                </Col>
                <Col lg={4}>
                    <Row className="g-3 h-100">
                        <Col sm={12}>
                            <StatCard
                                title={getFormattedMessage('dashboard.stat.transactions.title')}
                                value={todayOverview?.transaction_count}
                                deltaPercent={todayOverview?.transaction_count_vs_avg_percent}
                                icon={faReceipt}
                            />
                        </Col>
                        <Col sm={12}>
                            <StatCard
                                title={getFormattedMessage('dashboard.stat.new-customers.title')}
                                value={todayOverview?.new_customers_count}
                                deltaPercent={todayOverview?.new_customers_vs_avg_percent}
                                icon={faUserPlus}
                            />
                        </Col>
                        <Col sm={12}>
                            <StatCard
                                title={getFormattedMessage('dashboard.stat.refunds.title')}
                                value={todayOverview?.refunds_amount}
                                deltaPercent={todayOverview?.refunds_vs_avg_percent}
                                format="currency"
                                currency={currency}
                                icon={faRotateLeft}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="mb-4">
                <PerformanceSection />
            </div>
            <div className="mb-4">
                <CatalogInsightsRow />
            </div>
            <InsightsRow />
        </MasterLayout>
    )
}

export default Dashboard;
