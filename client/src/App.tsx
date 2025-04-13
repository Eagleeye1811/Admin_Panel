import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes';
import { ToastContainer } from 'react-bootstrap';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-end" />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
