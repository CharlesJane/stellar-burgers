import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useForm } from '../../services/store/hooks/useForm';

export const ForgotPassword: FC = () => {
  const { values, handleChange } = useForm({ email: '' });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    forgotPasswordApi({ email: values.email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
