import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TOrder, TOrdersData } from '../../../utils/types';
import { getFeedsApi } from '@api';

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

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
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
      });
  }
});

export default feedSlice.reducer;
