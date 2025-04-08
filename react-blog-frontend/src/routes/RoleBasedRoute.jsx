import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useSelector((state) => state.auth);
  const location = useLocation(); // Fix: Import and use location

  // Show loading if authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Redirect to home page if user doesn't have the required role
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Render child routes if authenticated and authorized
  return <Outlet />;
};

export default RoleBasedRoute;
