import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'profileOrders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else if (typeof error === 'string') {
        return rejectWithValue(error);
      } else {
        return rejectWithValue('Ошибка загрузки истории заказов');
      }
    }
  }
);

interface ProfileOrdersState {
  data: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  data: [],
  loading: false,
  error: null
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = 'Ошибка загрузки истории заказов';
        }
      });
  }
});

export default profileOrdersSlice.reducer;
