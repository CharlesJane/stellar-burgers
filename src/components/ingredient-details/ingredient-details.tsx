import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredientById,
  selectIngredientsLoading
} from '../../services/store/selectors/ingredients-selectors';
import { fetchIngredients } from '../../services/store/slices/ingredients-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const ingredientData = useSelector((state) =>
    selectIngredientById(state, id!)
  );

  const isLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (!ingredientData && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientData, isLoading, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
