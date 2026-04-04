import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from '../store/slices/ingredients-slice';
import constructorSlice from '../store/slices/constructor-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice,
  constructor: constructorSlice
});

export default rootReducer;
