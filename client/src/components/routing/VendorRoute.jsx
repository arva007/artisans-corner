import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VendorRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'vendor' && user.role !== 'admin') {
    return <Navigate to="/become-seller" replace />;
  }

  return children;
};

export default VendorRoute;
