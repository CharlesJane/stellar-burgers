import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectFeedOrders } from '../../services/store/selectors/feed-selectors';
import { selectIngredients } from '../../services/store/selectors/ingredients-selectors';

interface OrderInfoProps {
  setCurrentOrderNumber: (number: number | null) => void;
}

export const OrderInfo: FC<OrderInfoProps> = ({ setCurrentOrderNumber }) => {
  const { number } = useParams();

  useEffect(() => {
    const orderNumber = number ? parseInt(number, 10) : null;
    setCurrentOrderNumber(orderNumber);
    return () => setCurrentOrderNumber(null); // сброс при закрытии
  }, [number, setCurrentOrderNumber]);

  const orders = useSelector(selectFeedOrders);
  const ingredients = useSelector(selectIngredients);

  // Находим заказ по номеру из URL
  const orderData = orders.find((order) => order.number.toString() === number);

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
