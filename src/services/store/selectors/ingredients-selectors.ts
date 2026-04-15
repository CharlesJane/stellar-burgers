import { RootState } from '../../store';
import type { TIngredient } from '@utils-types';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientById = (
  state: RootState,
  ingredientId: string
): TIngredient | undefined =>
  state.ingredients.items.find((ingredient) => ingredient._id === ingredientId);
