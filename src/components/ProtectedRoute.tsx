import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show loading spinner while auth is being checked
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check for required role if specified
  if (requiredRole) {
    // You'll need to implement your own role-checking logic
    // This assumes your user object has a 'role' property
    const userRoles = (user.app_metadata?.roles || []) as string[];
    if (!userRoles.includes(requiredRole)) {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 