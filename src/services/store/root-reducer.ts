import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from '../store/slices/ingredients-slice';
import burgerConstructorReducer from '../store/slices/constructor-slice';
import feedReducer from './slices/feed-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer
});

export default rootReducer;
