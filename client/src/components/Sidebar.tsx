import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { 
  FaChartBar, 
  FaBook, 
  FaList, 
  FaUsers, 
  FaFlag 
} from 'react-icons/fa';
import '../styles/sidebar.css';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: FaChartBar, text: 'Dashboard' },
    { path: '/stories', icon: FaBook, text: 'Stories' },
    { path: '/categories', icon: FaList, text: 'Categories' },
    { path: '/users', icon: FaUsers, text: 'Users' },
    { path: '/reports', icon: FaFlag, text: 'Reports' }
  ];

  return (
    <div className="sidebar">
      <Nav className="flex-column">
        {navItems.map(({ path, icon: Icon, text }) => (
          <Nav.Item key={path}>
            <NavLink 
              to={path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="nav-icon" />
              <span className="nav-text">{text}</span>
            </NavLink>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;