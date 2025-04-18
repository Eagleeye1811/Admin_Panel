import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default NotFoundPage;