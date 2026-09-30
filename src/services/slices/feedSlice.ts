import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TFeedState, TOrder } from '@utils-types';

type TFeedSliceState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedSliceState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      });
  },
  selectors: {
    selectFeedError: (state): string | null => state.error,
    selectFeedLoading: (state): boolean => state.isLoading,
    selectFeedOrders: (state): TOrder[] => state.orders,
    selectFeedState: (state): TFeedState => ({
      orders: state.orders,
      total: state.total,
      totalToday: state.totalToday,
      isLoading: state.isLoading,
      error: state.error,
    }),
    selectFeedTotal: (state): number => state.total,
    selectFeedTotalToday: (state): number => state.totalToday,
  },
});

export const {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders,
  selectFeedState,
  selectFeedTotal,
  selectFeedTotalToday,
} = feedSlice.selectors;

export default feedSlice.reducer;
