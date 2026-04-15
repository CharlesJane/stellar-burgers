import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { TConstructorIngredient } from '@utils-types';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export const selectTotalPrice = createSelector(
  [selectConstructorItems],
  (constructorItems): number => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }
);
