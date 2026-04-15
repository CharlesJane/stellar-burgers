import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { useNavigate, useLocation } from 'react-router-dom';
import { TUser } from '@utils-types';
import { fetchUser } from '../../services/store/slices/user-slice';
import { useDispatch } from '../../services/store';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../services/store/hooks/useForm';
import { useAuth } from '../../services/store/hooks/useAuth';

export const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const { isAuthenticated } = useAuth();

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = localStorage.getItem('redirectAfterLogin') || '/';

  if (isAuthenticated) {
    navigate(from);
    return null;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const authData = await loginUserApi({
        email: values.email,
        password: values.password
      });
      localStorage.setItem('refreshToken', authData.refreshToken);
      setCookie('accessToken', authData.accessToken);

      await dispatch(fetchUser()).unwrap();

      localStorage.removeItem('redirectAfterLogin');

      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Ошибка авторизации'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginUI
      errorText={error?.message}
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
