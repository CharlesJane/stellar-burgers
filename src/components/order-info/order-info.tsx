import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { selectFeedOrders } from '../../services/store/selectors/feed-selectors';
import { selectIngredients } from '../../services/store/selectors/ingredients-selectors';
import {
  selectCurrentFeedOrder,
  selectIsFeedLoading,
  selectOrderByNumber
} from '../../services/store/selectors/order-selectors';
import { fetchOrderByNumberThunk } from '../../services/store/slices/feed-slice';

interface OrderInfoProps {
  setCurrentOrderNumber: (number: number | null) => void;
}

export const OrderInfo: FC<OrderInfoProps> = ({ setCurrentOrderNumber }) => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const currentFeedOrder = useSelector(selectCurrentFeedOrder);
  const isLoading = useSelector(selectIsFeedLoading);
  const ingredients = useSelector(selectIngredients);

  const orderNumber = number ? parseInt(number, 10) : null;

  const orderFromFeed = useSelector((state: RootState) =>
    selectOrderByNumber(state, number ? parseInt(number, 10) : 0)
  );

  const orderData = orderFromFeed || currentFeedOrder;

  useEffect(() => {
    if (orderNumber) {
      setCurrentOrderNumber(orderNumber);

      if (!orderFromFeed) {
        dispatch(fetchOrderByNumberThunk(orderNumber));
      }
    }

    return () => setCurrentOrderNumber(null);
  }, [dispatch, orderNumber, setCurrentOrderNumber, orderFromFeed]);

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

  if (isLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
