import { addIngredient } from '@slices';
import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import type { TBurgerIngredientProps } from './type';
import type { AppDispatch } from '@services/store';

export const BurgerIngredient = memo(function BurgerIngredient({
  count,
  ingredient,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const handleAdd = (): void => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
