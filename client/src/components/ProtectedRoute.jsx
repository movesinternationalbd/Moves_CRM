import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  return <Navigate to="/login" replace />;
}
