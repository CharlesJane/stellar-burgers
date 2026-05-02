import rootReducer from './root-reducer';
import { describe, expect, it } from '@jest/globals';

describe('rootReduer', () => {
  it('Тест должен возвращать начальное состояние с undefined', () => {
    const expectedInitialState = {
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        currentOrder: null
      },
      user: {
        data: null,
        loading: false,
        error: null
      },
      profileOrders: {
        data: [],
        loading: false,
        error: null
      }
    };

    const stateFromUndefined = rootReducer(undefined, { type: 'INIT' });
    const stateFromUnknownAction = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(stateFromUndefined).toEqual(expectedInitialState);
    expect(stateFromUnknownAction).toEqual(expectedInitialState);
  });
});
