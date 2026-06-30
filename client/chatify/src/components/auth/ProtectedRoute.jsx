import { Navigate } from 'react-router-dom';
import useAuthStore from '../../context/authStore.js';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

export const GuestRoute = ({ children }) => {
  const { token } = useAuthStore();
  return !token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
