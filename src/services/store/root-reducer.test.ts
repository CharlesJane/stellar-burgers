import rootReducer from './root-reducer';
import { describe, expect, it } from '@jest/globals';

describe('rootReduer', () => {
  it('Тест должен возвращать начальное состояние с undefined', () => {
    const initialState = rootReducer(undefined, { type: 'INIT' });
    const uncknownAction = { type: 'UNKNOWN_ACTION' };

    const result = rootReducer(undefined, uncknownAction);

    expect(result).toEqual(initialState);
  });
});
