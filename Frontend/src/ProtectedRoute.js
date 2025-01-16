import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { authState } = useAuth();

  if (!authState.role) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.includes(authState.role);

  //if the user doesnt have the requested role when accessing a page than it will be redirected
  return hasAccess ? (
    element
  ) : (
    <Navigate to={authState.role === 'ADMIN' ? "/StartPage" : "/"} replace />
  );
};

export default ProtectedRoute;