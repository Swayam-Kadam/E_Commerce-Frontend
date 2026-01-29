import { useAuth } from '../contexts/authContext';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  return !user ? children : <Navigate to="/" replace />;
};

export default PublicRoute;