import { RootState } from '../../store';

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.data;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.loading;
export const selectProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;
