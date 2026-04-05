import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserApi, updateUserApi } from '@api';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else if (typeof error === 'string') {
        return rejectWithValue(error);
      } else {
        return rejectWithValue('Ошибка загрузки данных пользователя');
      }
    }
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk<
  TUser,
  Partial<{ email: string; name: string; password: string }>
>('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    } else if (typeof error === 'string') {
      return rejectWithValue(error);
    } else {
      return rejectWithValue('Ошибка обновления данных пользователя');
    }
  }
});

interface UserState {
  data: TUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        // Гарантируем, что error — строка
        if (action.payload && typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = 'Ошибка загрузки данных пользователя';
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = 'Ошибка обновления данных пользователя';
        }
      });
  }
});

export default userSlice.reducer;
