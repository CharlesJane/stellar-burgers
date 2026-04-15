import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError
} from '../../services/store/selectors/feed-selectors';
import { fetchFeedThunk } from '../../services/store/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    if (orders.length === 0 && !isLoading) {
      dispatch(fetchFeedThunk());
    }
  }, [dispatch, orders.length, isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-large'>Ошибка загрузки: {error}</div>
    );
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeedThunk())} />
  );
};
