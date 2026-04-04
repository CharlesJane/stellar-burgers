import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { TIngredient } from '@utils-types';

// Базовые селекторы
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

// Составные селекторы (если нужны)
export const selectTotalPrice = createSelector(
  [selectConstructorItems],
  (constructorItems) => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TIngredient) => sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }
);
