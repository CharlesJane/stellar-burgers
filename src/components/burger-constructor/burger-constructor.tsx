import { FC, useMemo } from 'react';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import {
  addIngredient,
  setBun,
  removeIngredient,
  moveIngredient,
  setOrderModalData,
  setOrderRequest
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const orderRequest = useSelector(
    (state: RootState) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useSelector(
    (state: RootState) => state.burgerConstructor.orderModalData
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    // Здесь будет логика отправки заказа
    dispatch(setOrderRequest(true));
    // ... логика создания заказа через API
  };
  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
    dispatch(setOrderRequest(false));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
