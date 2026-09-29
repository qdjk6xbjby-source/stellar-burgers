import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orderFailed: boolean;
  orderByNumber: TOrder | null;
  isLoadingOrderByNumber: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  orderFailed: false,
  orderByNumber: null,
  isLoadingOrderByNumber: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]): Promise<TOrder> => {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number): Promise<TOrder> => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state): void => {
      state.orderModalData = null;
    },
    clearOrderByNumber: (state): void => {
      state.orderByNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderFailed = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderFailed = true;
        state.error = action.error.message ?? 'Ошибка создания заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrderByNumber = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrderByNumber = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrderByNumber = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    selectError: (state): string | null => state.error,
    selectIsLoadingOrderByNumber: (state): boolean => state.isLoadingOrderByNumber,
    selectOrderByNumber: (state): TOrder | null => state.orderByNumber,
    selectOrderFailed: (state): boolean => state.orderFailed,
    selectOrderModalData: (state): TOrder | null => state.orderModalData,
    selectOrderRequest: (state): boolean => state.orderRequest,
  },
});

export const { clearOrderByNumber, clearOrderModal } = orderSlice.actions;

export const {
  selectError,
  selectIsLoadingOrderByNumber,
  selectOrderByNumber,
  selectOrderFailed,
  selectOrderModalData,
  selectOrderRequest,
} = orderSlice.selectors;

export default orderSlice.reducer;
