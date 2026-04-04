import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from '../../services/store';

import { fetchIngredients } from '../../services/store/slices/ingredients-slice';

import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/store/selectors/ingredients-selectors';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '@ui';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  /** TODO: взять переменные из стора */
  const buns = ingredients.filter((ing: TIngredient) => ing.type === 'bun');
  const mains = ingredients.filter((ing: TIngredient) => ing.type === 'main');
  const sauces = ingredients.filter((ing: TIngredient) => ing.type === 'sauce');

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-large'>Ошибка загрузки: {error}</div>
    );
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
