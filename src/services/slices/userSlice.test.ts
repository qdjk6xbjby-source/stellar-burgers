import userReducer, {
  checkUserAuth,
  clearError,
  fetchUserOrders,
  loginUser,
  logoutUser,
  registerUser,
  setIsAuthChecked,
  setUser,
  updateUser,
} from './userSlice';

import type { TOrder, TUser } from '@utils-types';

describe('userSlice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Артём',
  };

  const mockOrders: TOrder[] = [
    {
      _id: 'order-1',
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2026-10-17T20:00:00.000Z',
      updatedAt: '2026-10-17T20:05:00.000Z',
      number: 1111,
      ingredients: ['bun-1', 'main-1', 'bun-1'],
    },
  ];

  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
      userOrders: [],
      isOrdersLoading: false,
    });
  });

  it('обрабатывает setUser', () => {
    const state = userReducer(undefined, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
  });

  it('обрабатывает setIsAuthChecked', () => {
    const state = userReducer(undefined, setIsAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает clearError', () => {
    const state = userReducer(
      {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: 'Какая-то ошибка',
        userOrders: [],
        isOrdersLoading: false,
      },
      clearError()
    );
    expect(state.error).toBeNull();
  });

  it('обрабатывает checkUserAuth.fulfilled', () => {
    const action = {
      type: checkUserAuth.fulfilled.type,
      payload: mockUser,
    };
    const state = userReducer(undefined, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает checkUserAuth.rejected', () => {
    const action = { type: checkUserAuth.rejected.type };
    const state = userReducer(undefined, action);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(undefined, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser,
    };
    const state = userReducer(
      {
        user: null,
        isAuthChecked: false,
        isLoading: true,
        error: null,
        userOrders: [],
        isOrdersLoading: false,
      },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  it('обрабатывает loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'Неверный логин или пароль' },
    };
    const state = userReducer(
      {
        user: null,
        isAuthChecked: false,
        isLoading: true,
        error: null,
        userOrders: [],
        isOrdersLoading: false,
      },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Неверный логин или пароль');
  });

  it('обрабатывает registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser,
    };
    const state = userReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  it('обрабатывает updateUser.fulfilled', () => {
    const updatedUser = { ...mockUser, name: 'Новое имя' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser,
    };
    const state = userReducer(
      {
        user: mockUser,
        isAuthChecked: true,
        isLoading: true,
        error: null,
        userOrders: [],
        isOrdersLoading: false,
      },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(updatedUser);
  });

  it('обрабатывает logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = userReducer(
      {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null,
        userOrders: [],
        isOrdersLoading: false,
      },
      action
    );
    expect(state.user).toBeNull();
  });

  it('обрабатывает fetchUserOrders.fulfilled', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders,
    };
    const state = userReducer(
      {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null,
        userOrders: [],
        isOrdersLoading: true,
      },
      action
    );
    expect(state.isOrdersLoading).toBe(false);
    expect(state.userOrders).toEqual(mockOrders);
  });
});
