import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  userOrders: TOrder[];
  isOrdersLoading: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  userOrders: [],
  isOrdersLoading: false,
};

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (): Promise<TUser | null> => {
    if (!getCookie('accessToken')) {
      return null;
    }
    try {
      const res = await getUserApi();
      return res.user;
    } catch {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData): Promise<TUser> => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData): Promise<TUser> => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>): Promise<TUser> => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (): Promise<void> => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export const fetchUserOrders = createAsyncThunk(
  'user/fetchUserOrders',
  async (): Promise<TOrder[]> => await getOrdersApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>): void => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>): void => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state): void => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка авторизации';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления данных';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isOrdersLoading = false;
      });
  },
  selectors: {
    selectIsAuthChecked: (state): boolean => state.isAuthChecked,
    selectIsOrdersLoading: (state): boolean => state.isOrdersLoading,
    selectUser: (state): TUser | null => state.user,
    selectUserError: (state): string | null => state.error,
    selectUserLoading: (state): boolean => state.isLoading,
    selectUserOrders: (state): TOrder[] => state.userOrders,
  },
});

export const { clearError, setIsAuthChecked, setUser } = userSlice.actions;

export const {
  selectIsAuthChecked,
  selectIsOrdersLoading,
  selectUser,
  selectUserError,
  selectUserLoading,
  selectUserOrders,
} = userSlice.selectors;

export default userSlice.reducer;
