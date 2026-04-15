import type { RootState } from '../../store';
import type { TOrder } from '../../../utils/types';

export const selectFeedOrders = (state: RootState): TOrder[] =>
  state.feed.orders;
export const selectFeedTotal = (state: RootState): number => state.feed.total;
export const selectFeedTotalToday = (state: RootState): number =>
  state.feed.totalToday;
export const selectFeedLoading = (state: RootState): boolean =>
  state.feed.loading;
export const selectFeedError = (state: RootState): string | null =>
  state.feed.error;
