import { useAuth } from '../contexts/authContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
 //console.log(user.user_metadata.full_name)
  
  return user ? children : <Navigate to="/login" replace />;
  // return user.user_metadata.role === "admin" ? children : user.user_metadata.role === "user" ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;