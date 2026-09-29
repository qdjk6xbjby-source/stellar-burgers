import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>): void => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid(),
        },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>): void => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ): void => {
      const [movedItem] = state.ingredients.splice(action.payload.fromIndex, 1);
      state.ingredients.splice(action.payload.toIndex, 0, movedItem);
    },
    clearConstructor: (state): void => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  selectors: {
    selectConstructorItems: (state): TConstructorState => ({
      bun: state.bun,
      ingredients: state.ingredients,
    }),
    selectConstructorPrice: (state): number =>
      (state.bun ? state.bun.price * 2 : 0) +
      state.ingredients.reduce((acc, item) => acc + item.price, 0),
  },
});

export const { addIngredient, clearConstructor, moveIngredient, removeIngredient } =
  constructorSlice.actions;

export const { selectConstructorItems, selectConstructorPrice } =
  constructorSlice.selectors;

export default constructorSlice.reducer;
