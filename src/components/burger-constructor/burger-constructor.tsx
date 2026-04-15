import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  selectTotalPrice
} from '../../services/store/selectors/constructor-selectors';
import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  closeOrderModal
} from '../../services/store/slices/constructor-slice';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/store/selectors/user-selectors';
import { getCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const price = useSelector(selectTotalPrice);
  const user = useSelector(selectUser);

  const isAuthenticated = !!user && !!getCookie('accessToken');

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    dispatch(createOrder());
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
