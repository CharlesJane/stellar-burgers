import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../services/store/hooks/useForm';

export const Register: FC = () => {
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const [errorText, setErrorText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    setIsLoading(true);

    try {
      const response = await registerUserApi({
        email: values.email,
        name: values.userName,
        password: values.password
      });

      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);

      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorText(err.message);
      } else {
        setErrorText('Ошибка регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
