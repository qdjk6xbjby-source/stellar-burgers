import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (): Promise<TIngredient[]> => await getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
      });
  },
  selectors: {
    selectIngredients: (state): TIngredient[] => state.ingredients,
    selectIsIngredientsLoading: (state): boolean => state.isLoading,
    selectIngredientsError: (state): string | null => state.error,
    selectBuns: (state): TIngredient[] =>
      state.ingredients.filter((item) => item.type === 'bun'),
    selectMains: (state): TIngredient[] =>
      state.ingredients.filter((item) => item.type === 'main'),
    selectSauces: (state): TIngredient[] =>
      state.ingredients.filter((item) => item.type === 'sauce'),
  },
});

export const {
  selectBuns,
  selectIngredients,
  selectIngredientsError,
  selectIsIngredientsLoading,
  selectMains,
  selectSauces,
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
