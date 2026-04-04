import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import {
  addIngredientToConstructor,
  setBun
} from '../../services/store/slices/constructor-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      // Явно приводим тип к TConstructorIngredient — id уже есть в ingredient
      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: `${ingredient._id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      if (ingredient.type === 'bun') {
        // Для булок передаём ингредиент как TConstructorIngredient
        dispatch(setBun(constructorIngredient));
      } else {
        // Для начинок передаём ингредиент как TConstructorIngredient
        dispatch(addIngredientToConstructor(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
