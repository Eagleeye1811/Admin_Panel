import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaBook, FaUsers, FaList } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import BarChart from '../../components/dashboard/BarChart';
import { getDashboardStats } from '../../services/dashboardService';
import { DashboardStats } from '../../types/api.types';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

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

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchStats();
    }
  }, [location.state]);

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
  
  if (!stats) {
    return null; // Or fallback UI
  }
  
  const uploadLabels = stats.uploadStats.map((stat) => stat.date);
  const uploadData = stats.uploadStats.map((stat) => stat.count);


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

      <Row>
        <Col md={12}>
          <BarChart
            labels={uploadLabels}
            data={uploadData}
            title="Stories Uploaded Over Time"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;