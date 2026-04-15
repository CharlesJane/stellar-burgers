import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from '../store/slices/ingredients-slice';
import burgerConstructorReducer from '../store/slices/constructor-slice';
import feedReducer from './slices/feed-slice';
import userReducer from './slices/user-slice';
import profileOrdersReducer from './slices/profile-orders-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  user: userReducer,
  profileOrders: profileOrdersReducer
});

export default rootReducer;
