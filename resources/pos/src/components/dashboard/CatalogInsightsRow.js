import React from 'react';
import { Col, Row } from 'react-bootstrap';
import TopProductsList from './TopProductsList';
import LowStockList from './LowStockList';
import ActivityFeed from './ActivityFeed';

const CatalogInsightsRow = () => {
    return (
        <Row className="g-3">
            <Col lg={4}>
                <TopProductsList />
            </Col>
            <Col lg={4}>
                <LowStockList />
            </Col>
            <Col lg={4}>
                <ActivityFeed />
            </Col>
        </Row>
    );
};

export default CatalogInsightsRow;
