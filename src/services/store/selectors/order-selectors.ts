import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { TOrder } from '../../../utils/types';

export const selectOrderByNumber = (
  state: RootState,
  number: number
): TOrder | undefined =>
  [...state.feed.orders, ...state.profileOrders.data].find(
    (order) => order.number === number
  );

export const selectCurrentFeedOrder = (state: RootState): TOrder | null =>
  state.feed.currentOrder;

// Селектор для проверки загрузки
export const selectIsFeedLoading = (state: RootState): boolean =>
  state.feed.loading;
