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

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const price = useSelector(selectTotalPrice);

  const onOrderClick = () => {
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
