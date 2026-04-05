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
