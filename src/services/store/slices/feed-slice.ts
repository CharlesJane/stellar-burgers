import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TOrder, TOrdersData } from '../../../utils/types';
import { getFeedsApi } from '@api';
import { getOrderByNumberApi } from '@api';

export const fetchFeedThunk = createAsyncThunk(
  'feed/fetchFeed',
  async (): Promise<{
    orders: TOrder[];
    total: number;
    totalToday: number;
  }> => {
    const data = await getFeedsApi();
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  }
);

export const fetchOrderByNumberThunk = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  currentOrder: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.loading = false;
        state.orders = orders;
        state.total = total;
        state.totalToday = totalToday;
      })
      .addCase(fetchFeedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки фида';
      })
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedSlice.reducer;
