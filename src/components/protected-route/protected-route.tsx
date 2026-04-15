import { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectUser,
  selectUserLoading
} from '../../services/store/selectors/user-selectors';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAuth
}) => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const location = useLocation();

  const isAuthenticated = !!user && !!getCookie('accessToken');

  useEffect(() => {
    if (!isLoading && !isAuthenticated && requireAuth) {
      localStorage.setItem(
        'redirectAfterLogin',
        location.pathname + location.search
      );
    }
  }, [
    isLoading,
    isAuthenticated,
    requireAuth,
    location.pathname,
    location.search
  ]);

  if (isLoading) {
    return <Preloader />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
