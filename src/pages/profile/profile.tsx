import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUser, updateUser } from '../../services/store/slices/user-slice';
import {
  selectUser,
  selectUserLoading,
  selectUserError
} from '../../services/store/selectors/user-selectors';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [initialData, setInitialData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: '',
    email: '',
    password: ''
  });

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(fetchUser());
      return;
    }

    if (user) {
      const initial = {
        name: user.name,
        email: user.email,
        password: ''
      };
      setInitialData(initial);
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    } else {
      setInitialData({ name: '', email: '', password: '' });
      setFormValue({ name: '', email: '', password: '' });
    }
  }, [dispatch, user, isLoading]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        updateUser({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password || undefined
        })
      );
      setInitialData({
        name: formValue.name,
        email: formValue.email,
        password: ''
      });
      setFormValue((prev) => ({ ...prev, password: '' }));
      setHasChanges(false);
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: initialData.name,
      email: initialData.email,
      password: ''
    });
    setHasChanges(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsInitialized(true);
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    if (!user) {
      setHasChanges(false);
      return;
    }
    const isNameChanged = formValue.name !== initialData.name;
    const isEmailChanged = formValue.email !== initialData.email;
    const isPasswordChanged = formValue.password !== initialData.password;
    setHasChanges(isNameChanged || isEmailChanged || isPasswordChanged);
  }, [formValue, initialData, user]);

  if (isLoading) return <Preloader />;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={hasChanges}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error}
    />
  );
};
