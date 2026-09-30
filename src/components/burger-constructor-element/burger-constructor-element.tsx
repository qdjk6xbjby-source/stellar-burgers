import { moveIngredient, removeIngredient } from '@slices';
import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';
import { useDispatch } from 'react-redux';

import type { BurgerConstructorElementProps } from './type';
import type { AppDispatch } from '@services/store';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  index,
  ingredient,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const handleMoveDown = (): void => {
    dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
  };

  const handleMoveUp = (): void => {
    dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
