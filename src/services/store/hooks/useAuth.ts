import { useSelector } from '../../store';
import { selectUser, selectUserLoading } from '../selectors/user-selectors';
import { getCookie } from '../../../utils/cookie';

export const useAuth = () => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const isAuthenticated = !!user && !!getCookie('accessToken');

  return {
    isAuthenticated,
    user,
    isLoading
  };
};
