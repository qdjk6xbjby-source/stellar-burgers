import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './constructorSlice';
import { createOrder } from './orderSlice';

import type { TConstructorIngredient, TIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  };

  const mockMain: TIngredient = {
    _id: 'main-1',
    name: 'Биокотлета из марсианской магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  };

  const mockSauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  };

  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('обрабатывает добавление булки', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(undefined, action);
    expect(state.bun).toEqual(expect.objectContaining({ _id: 'bun-1', type: 'bun' }));
    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает добавление ингредиента начинки с генерацией id', () => {
    const action = addIngredient(mockMain);
    const state = constructorReducer(undefined, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('main-1');
    expect(typeof state.ingredients[0].id).toBe('string');
    expect(state.ingredients[0].id.length).toBeGreaterThan(0);
  });

  it('обрабатывает удаление ингредиента по id', () => {
    const ingredient1: TConstructorIngredient = { ...mockMain, id: 'id-1' };
    const ingredient2: TConstructorIngredient = { ...mockSauce, id: 'id-2' };
    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
    };

    const state = constructorReducer(initialState, removeIngredient('id-1'));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('id-2');
  });

  it('обрабатывает изменение порядка ингредиентов в начинке', () => {
    const ingredient1: TConstructorIngredient = { ...mockMain, id: 'id-1' };
    const ingredient2: TConstructorIngredient = { ...mockSauce, id: 'id-2' };
    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
    };

    const state = constructorReducer(
      initialState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  it('обрабатывает очистку конструктора', () => {
    const initialState = {
      bun: { ...mockBun, id: 'bun-id' },
      ingredients: [{ ...mockMain, id: 'main-id' }],
    };

    const state = constructorReducer(initialState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('очищает конструктор при успешном создании заказа (createOrder.fulfilled)', () => {
    const initialState = {
      bun: { ...mockBun, id: 'bun-id' },
      ingredients: [{ ...mockMain, id: 'main-id' }],
    };

    const action = {
      type: createOrder.fulfilled.type,
      payload: { number: 12345 },
    };
    const state = constructorReducer(initialState, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
