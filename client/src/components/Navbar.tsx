import { Navbar as BsNavbar, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar bg="dark" variant="dark" className="mb-3">
      <Container fluid>
        <BsNavbar.Brand>EchoTales Admin</BsNavbar.Brand>
        <div className="d-flex align-items-center">
          <FaUserCircle size={20} className="text-light me-2" />
          <Button 
            variant="outline-light" 
            size="sm" 
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-1" /> Logout
          </Button>
        </div>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;