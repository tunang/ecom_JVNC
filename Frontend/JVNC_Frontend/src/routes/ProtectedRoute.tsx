import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { Role } from '@/types/user.type';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles?.includes(user?.role as Role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
