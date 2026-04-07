import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { RootState } from '../../store';
import { orderBurgerApi } from '@api';
import { fetchProfileOrders } from './profile-orders-slice';

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { rejectValue: string }
>(
  'burgerConstructor/createOrder',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const constructorItems = state.burgerConstructor.constructorItems;

      const ingredientIds: string[] = [];
      if (constructorItems.bun) {
        ingredientIds.push(constructorItems.bun._id);
        ingredientIds.push(constructorItems.bun._id);
      }
      constructorItems.ingredients.forEach((ingredient) => {
        ingredientIds.push(ingredient._id);
      });

      const response = await orderBurgerApi(ingredientIds);

      const order: TOrder = {
        _id: response.order._id,
        status: response.order.status,
        name: response.name,
        createdAt: response.order.createdAt,
        updatedAt: response.order.updatedAt,
        number: response.order.number,
        ingredients: ingredientIds
      };

      await dispatch(fetchProfileOrders());

      return order;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Ошибка создания заказа');
      }
    }
  }
);

export type BurgerConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToConstructor: {
      prepare: (ingredient: TConstructorIngredient) => {
        const ingredientWithKey: TConstructorIngredient & {
          uniqueKey: string;
        } = {
          ...ingredient,
          uniqueKey: uuidv4()
        };
        return { payload: ingredientWithKey };
      },
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient & { uniqueKey: string }>
      ) => {
        state.constructorItems.ingredients.push(action.payload);
      }
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
    },

    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        console.error('Ошибка создания заказа:', action.payload);
      });
  }
});

export const {
  addIngredientToConstructor,
  setBun,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setOrderRequest,
  setOrderModalData,
  resetConstructor,
  closeOrderModal
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
