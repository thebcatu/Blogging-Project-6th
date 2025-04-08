import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * A component that protects routes based on authentication and roles
 */
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  // If not authenticated, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // If roles are specified and user's role is not included, redirect to forbidden page
  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // User is authenticated and authorized, render the child routes
  return <Outlet />;
};

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
