import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

// Тип для состояния конструктора
export type BurgerConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

// Начальное состояние
const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

// Создание slice
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToConstructor: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients.push(action.payload);
    },

    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const ingredientIdToRemove = action.payload;
      const indexToRemove = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === ingredientIdToRemove
      );

      if (indexToRemove !== -1) {
        state.constructorItems.ingredients.splice(indexToRemove, 1);
      }
    },

    moveIngredientUp: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      if (index > 0) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index], ingredients[index - 1]] = [
          ingredients[index - 1],
          ingredients[index]
        ];
      }
    },

    moveIngredientDown: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    },

    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },

    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },

    resetConstructor: (state) => {
      Object.assign(state, initialState);
    }
  }
});

// Экспортируем действия (actions)
export const {
  addIngredientToConstructor,
  setBun,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setOrderRequest,
  setOrderModalData,
  resetConstructor
} = burgerConstructorSlice.actions;

// Экспортируем редьюсер
export default burgerConstructorSlice.reducer;
