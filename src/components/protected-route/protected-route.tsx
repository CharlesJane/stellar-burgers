import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  //   const isAuthChecked = useSelector(isAuthCheckedSelector); // isAuthCheckedSelector — селектор получения состояния загрузки пользователя
  //   const user = useSelector(userDataSelector); // userDataSelector — селектор получения пользователя из store

  return children;
};
