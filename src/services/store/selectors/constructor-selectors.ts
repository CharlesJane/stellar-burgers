import { RootState } from '../../store';

export const selectConstructorItems = (state: RootState) =>
  state.constructor.constructorItems;

export const selectOrderRequest = (state: RootState) =>
  state.constructor.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.constructor.orderModalData;

export const selectConstructorLoading = (state: RootState) =>
  state.constructor.loading;

export const selectConstructorError = (state: RootState) =>
  state.constructor.error;
