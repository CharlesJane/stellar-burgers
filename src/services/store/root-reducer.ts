import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from '../store/slices/ingredients-slice';
import burgerConstructorReducer from '../store/slices/constructor-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice,
  burgerConstructor: burgerConstructorReducer
});

export default rootReducer;
