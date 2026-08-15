import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getFormattedMessage } from '../../shared/sharedMethod';
import SalesHeatmap from './SalesHeatmap';
import ShiftPanel from './ShiftPanel';

const InsightsRow = () => {
    return (
        <div>
            <div className="performance-section-header">
                <h5 className="performance-section-title">{getFormattedMessage('dashboard.insights.title')}</h5>
                <Link className="insight-card-link" to="/app/report/report-warehouse">
                    {getFormattedMessage('dashboard.insights.all-reports.label')}
                </Link>
            </div>
            <Row className="g-3">
                <Col lg={7}>
                    <SalesHeatmap />
                </Col>
                <Col lg={5}>
                    <ShiftPanel />
                </Col>
            </Row>
        </div>
    );
};

export default InsightsRow;
