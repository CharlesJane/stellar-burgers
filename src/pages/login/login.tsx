import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { useNavigate } from 'react-router-dom';
import { TUser } from '@utils-types';

export const Login: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (email === ' ' && password === ' ') {
      navigate({ pathname: 'auth', search: '?authToken=authToken' });
    } else {
      navigate('/login');
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
