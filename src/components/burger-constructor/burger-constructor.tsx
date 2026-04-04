import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI, Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  selectConstructorLoading
} from '../../services/store/selectors/constructor-selectors';
import {
  setOrderRequest,
  setOrderModalData
} from '../../services/store/slices/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isLoading = useSelector(selectConstructorLoading);

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(setOrderRequest(true));
    // TODO: здесь будет логика отправки заказа
  }, [constructorItems.bun, orderRequest, dispatch]);

  const closeOrderModal = useCallback(() => {
    dispatch(setOrderModalData(null));
    dispatch(setOrderRequest(false));
  }, [dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // Показываем лоадер, если идёт запрос к серверу
  if (isLoading) {
    return <Preloader />;
  }

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
