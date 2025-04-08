import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
