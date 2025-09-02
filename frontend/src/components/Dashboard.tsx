// src/components/Dashboard.tsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Dashboard: React.FC = () => {
  return (
    <div className="mb-4">
      <h2>Progress Dashboard</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>Quiz Scores Over Time</Card.Header>
            <Card.Body>
              {/* Replace with your actual chart component */}
              <p>Line chart placeholder</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>Time Spent Per Topic</Card.Header>
            <Card.Body>
              {/* Replace with your actual chart component */}
              <p>Heatmap placeholder</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
