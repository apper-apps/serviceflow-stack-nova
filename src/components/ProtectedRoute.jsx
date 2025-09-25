import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '@/components/ui/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  // If not authenticated, redirect to login with current path as redirect parameter
  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;