import orderReducer, {
  clearOrderByNumber,
  clearOrderModal,
  createOrder,
  fetchOrderByNumber,
} from './orderSlice';

import type { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: 'order-1',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2026-10-17T20:00:00.000Z',
    updatedAt: '2026-10-17T20:05:00.000Z',
    number: 7777,
    ingredients: ['bun-1', 'main-1', 'bun-1'],
  };

  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      orderModalData: null,
      orderRequest: false,
      orderFailed: false,
      orderByNumber: null,
      isLoadingOrderByNumber: false,
      error: null,
    });
  });

  it('обрабатывает createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(undefined, action);
    expect(state.orderRequest).toBe(true);
    expect(state.orderFailed).toBe(false);
    expect(state.error).toBeNull();
  });

  it('обрабатывает createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder,
    };
    const state = orderReducer(
      {
        orderModalData: null,
        orderRequest: true,
        orderFailed: false,
        orderByNumber: null,
        isLoadingOrderByNumber: false,
        error: null,
      },
      action
    );
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orderFailed).toBe(false);
  });

  it('обрабатывает createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка оформления заказа' },
    };
    const state = orderReducer(
      {
        orderModalData: null,
        orderRequest: true,
        orderFailed: false,
        orderByNumber: null,
        isLoadingOrderByNumber: false,
        error: null,
      },
      action
    );
    expect(state.orderRequest).toBe(false);
    expect(state.orderFailed).toBe(true);
    expect(state.error).toBe('Ошибка оформления заказа');
  });

  it('обрабатывает fetchOrderByNumber.pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderReducer(undefined, action);
    expect(state.isLoadingOrderByNumber).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchOrderByNumber.fulfilled', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder,
    };
    const state = orderReducer(
      {
        orderModalData: null,
        orderRequest: false,
        orderFailed: false,
        orderByNumber: null,
        isLoadingOrderByNumber: true,
        error: null,
      },
      action
    );
    expect(state.isLoadingOrderByNumber).toBe(false);
    expect(state.orderByNumber).toEqual(mockOrder);
  });

  it('обрабатывает fetchOrderByNumber.rejected', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: 'Заказ не найден' },
    };
    const state = orderReducer(
      {
        orderModalData: null,
        orderRequest: false,
        orderFailed: false,
        orderByNumber: null,
        isLoadingOrderByNumber: true,
        error: null,
      },
      action
    );
    expect(state.isLoadingOrderByNumber).toBe(false);
    expect(state.error).toBe('Заказ не найден');
  });

  it('обрабатывает clearOrderModal', () => {
    const state = orderReducer(
      {
        orderModalData: mockOrder,
        orderRequest: false,
        orderFailed: false,
        orderByNumber: null,
        isLoadingOrderByNumber: false,
        error: null,
      },
      clearOrderModal()
    );
    expect(state.orderModalData).toBeNull();
  });

  it('обрабатывает clearOrderByNumber', () => {
    const state = orderReducer(
      {
        orderModalData: null,
        orderRequest: false,
        orderFailed: false,
        orderByNumber: mockOrder,
        isLoadingOrderByNumber: false,
        error: null,
      },
      clearOrderByNumber()
    );
    expect(state.orderByNumber).toBeNull();
  });
});
