import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { selectIngredients } from '../../services/store/selectors/ingredients-selectors';
import { selectOrderByNumber } from '../../services/store/selectors/order-selectors';
import { getOrderByNumberApi } from '@api';
import { setOrderModalData } from '../..//services/store/slices/constructor-slice';
export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const orderNumber = number ? parseInt(number, 10) : undefined;

  // Ищем заказ в сторе (в фиде или в профиле)
  const orderData = useSelector((state: RootState) =>
    orderNumber ? selectOrderByNumber(state, orderNumber) : undefined
  );

  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    // Если заказа нет в сторе и есть номер — загружаем через API
    if (!orderData && orderNumber) {
      getOrderByNumberApi(orderNumber)
        .then((response) => {
          if (response.success && response.orders.length > 0) {
            // Сохраняем полученный заказ в стор (например, в burgerConstructor)
            dispatch(setOrderModalData(response.orders[0]));
          }
        })
        .catch((error) => {
          console.error('Ошибка загрузки заказа по номеру:', error);
        });
    }
  }, [orderData, orderNumber, dispatch]);

  if (!orderData) {
    return <Preloader />;
  }
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
