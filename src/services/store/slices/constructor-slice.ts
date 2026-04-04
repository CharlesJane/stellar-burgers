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
      // Удаляем по id из API (уникальный для каждого типа ингредиента)
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredient = state.constructorItems.ingredients[fromIndex];
      state.constructorItems.ingredients.splice(fromIndex, 1);
      state.constructorItems.ingredients.splice(toIndex, 0, ingredient);
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
  moveIngredient,
  setOrderRequest,
  setOrderModalData,
  resetConstructor
} = burgerConstructorSlice.actions;

// Экспортируем редьюсер
export default burgerConstructorSlice.reducer;
