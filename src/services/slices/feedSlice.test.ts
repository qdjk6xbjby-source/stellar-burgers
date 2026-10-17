import feedReducer, { fetchFeed } from './feedSlice';

import type { TOrder } from '@utils-types';

describe('feedSlice', () => {
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
    expect(feedReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает fetchFeed.pending', () => {
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(undefined, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchFeed.fulfilled', () => {
    const action = {
      type: fetchFeed.fulfilled.type,
      payload: {
        orders: mockOrders,
        total: 100,
        totalToday: 10,
      },
    };
    const state = feedReducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: null,
      },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchFeed.rejected', () => {
    const action = {
      type: fetchFeed.rejected.type,
      error: { message: 'Ошибка загрузки ленты' },
    };
    const state = feedReducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: null,
      },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты');
  });
});
