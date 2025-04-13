import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaBook, FaUsers, FaList } from 'react-icons/fa';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentStories from '../../components/dashboard/RecentStories';
import { getDashboardStats } from '../../services/dashboardService';
import { DashboardStats } from '../../types/api.types';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="g-4 mb-4">
        <Col md={4}>
          <StatsCard
            title="Total Stories"
            value={stats?.totalStories || 0}
            icon={FaBook}
            color="#0d6efd"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={FaUsers}
            color="#198754"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Categories"
            value={stats?.totalCategories || 0}
            icon={FaList}
            color="#dc3545"
          />
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Recent Stories</h5>
        </Card.Header>
        <Card.Body>
          <RecentStories stories={stats?.recentStories} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardPage;