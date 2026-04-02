import { combineReducers } from '@reduxjs/toolkit';
// import ingredientsReducer from '../slices/ingredientsSlice';
import burgerConstructorReducer from '../slices/burgerConstructorSlice';

const rootReducer = combineReducers({
  //   ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer
});

export default rootReducer;
