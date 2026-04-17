import { profileOrdersSlice } from './profile-orders-slice';
import { describe, expect, it, jest } from '@jest/globals';
import type { TOrder } from '@utils-types';

// Начальное состояние
const { reducer } = profileOrdersSlice;
const initialState = {
  data: [],
  loading: false,
  error: null
};

// Моки
const mockOrders: TOrder[] = [
  {
    _id: 'order1',
    status: 'done',
    name: 'Заказ 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 1,
    ingredients: ['1', '2']
  },
  {
    _id: 'order2',
    status: 'pending',
    name: 'Заказ 2',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
    number: 2,
    ingredients: ['3', '4']
  }
];

// Тесты

describe('Тестирование редьюсера истории заказов профиля', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('Обработка fetchProfileOrders.pending', () => {
    it('должен устанавливать loading: true и сбрасывать error при начале загрузки истории заказов', () => {
      const action = { type: 'profileOrders/fetchOrders/pending' };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toEqual([]);
    });
  });

  describe('Обработка fetchProfileOrders.fulfilled', () => {
    it('должен корректно обновлять data при успешной загрузке истории заказов', () => {
      const action = {
        type: 'profileOrders/fetchOrders/fulfilled',
        payload: mockOrders
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockOrders);
      expect(result.data).toHaveLength(2);
    });

    it('должен обрабатывать пустой массив заказов', () => {
      const action = {
        type: 'profileOrders/fetchOrders/fulfilled',
        payload: []
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('Обработка fetchProfileOrders.rejected', () => {
    it('должен устанавливать error при ошибке с строковым payload', () => {
      const action = {
        type: 'profileOrders/fetchOrders/rejected',
        payload: 'Ошибка сети'
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка сети');
      expect(result.data).toEqual([]);
    });

    it('должен использовать сообщение по умолчанию при отсутствии payload', () => {
      const action = {
        type: 'profileOrders/fetchOrders/rejected',
        error: {}
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки истории заказов');
      expect(result.data).toEqual([]);
    });

    it('должен использовать сообщение по умолчанию при payload нестрокового типа', () => {
      const action = {
        type: 'profileOrders/fetchOrders/rejected',
        payload: { message: 'Нестроковая ошибка' }
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки истории заказов');
    });

    it('должен заменять предыдущую ошибку новой', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка'
      };

      const action = {
        type: 'profileOrders/fetchOrders/rejected',
        payload: 'Новая ошибка'
      };
      const result = reducer(stateWithError, action);

      expect(result.error).toBe('Новая ошибка');
    });
  });

  describe('Проверка начального состояния', () => {
    it('должно соответствовать ожидаемой структуре', () => {
      expect(initialState).toEqual({
        data: [],
        loading: false,
        error: null
      });
    });
  });

  describe('Поведение при неизвестных экшенах', () => {
    it('не должно изменять состояние при неизвестных экшенах', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const result = reducer(initialState, unknownAction);
      expect(result).toEqual(initialState);
    });
  });

  describe('Последовательные вызовы', () => {
    it('должен корректно обрабатывать последовательность: pending → fulfilled', () => {
      const pendingAction = { type: 'profileOrders/fetchOrders/pending' };
      let result = reducer(initialState, pendingAction);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();

      const fulfilledAction = {
        type: 'profileOrders/fetchOrders/fulfilled',
        payload: mockOrders
      };
      result = reducer(result, fulfilledAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockOrders);
    });

    it('должен корректно обрабатывать последовательность: pending → rejected', () => {
      const pendingAction = { type: 'profileOrders/fetchOrders/pending' };
      let result = reducer(initialState, pendingAction);

      expect(result.loading).toBe(true);

      const rejectedAction = {
        type: 'profileOrders/fetchOrders/rejected',
        payload: 'Ошибка аутентификации'
      };
      result = reducer(result, rejectedAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка аутентификации');
    });
  });
});
