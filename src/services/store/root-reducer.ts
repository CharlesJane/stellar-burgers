import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from '../store/slices/ingredients-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice
});

export default rootReducer;
