import { feedSlice } from './feed-slice';
import { describe, expect, it, jest } from '@jest/globals';
import type { TOrder } from '@utils-types';

// Начальное состояние
const { reducer } = feedSlice;
const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  currentOrder: null
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

const mockFeedData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

const mockSingleOrder: TOrder = {
  _id: 'order-single',
  status: 'done',
  name: 'Одиночный заказ',
  createdAt: '2023-01-03T00:00:00.000Z',
  updatedAt: '2023-01-03T00:00:00.000Z',
  number: 999,
  ingredients: ['5', '6']
};

// Тесты

describe('Тестирование редьюсера фида заказов', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('Обработка fetchFeedThunk.pending', () => {
    it('должен устанавливать loading: true и сбрасывать error при начале загрузки фида', () => {
      const action = { type: 'feed/fetchFeed/pending' };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.orders).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalToday).toBe(0);
    });
  });

  describe('Обработка fetchFeedThunk.fulfilled', () => {
    it('должен корректно обновлять состояние при успешной загрузке фида', () => {
      const action = {
        type: 'feed/fetchFeed/fulfilled',
        payload: mockFeedData
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.orders).toEqual(mockOrders);
      expect(result.total).toBe(100);
      expect(result.totalToday).toBe(10);
    });
  });

  describe('Обработка fetchFeedThunk.rejected', () => {
    it('должен устанавливать error при ошибке загрузки фида (с message)', () => {
      const action = {
        type: 'feed/fetchFeed/rejected',
        error: { message: 'Ошибка сети' }
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка сети');
    });

    it('должен использовать сообщение по умолчанию при отсутствии error.message', () => {
      const action = {
        type: 'feed/fetchFeed/rejected',
        error: {}
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки фида');
    });
  });

  describe('Обработка fetchOrderByNumberThunk.pending', () => {
    it('должен устанавливать loading: true и сбрасывать error при поиске заказа по номеру', () => {
      const action = { type: 'feed/fetchOrderByNumber/pending' };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.currentOrder).toBeNull();
    });
  });

  describe('Обработка fetchOrderByNewtonThunk.fulfilled', () => {
    it('должен обновлять currentOrder при успешном получении заказа', () => {
      const action = {
        type: 'feed/fetchOrderByNumber/fulfilled',
        payload: mockSingleOrder
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.currentOrder).toEqual(mockSingleOrder);
    });
  });

  describe('Обработка fetchOrderByNumberThunk.rejected', () => {
    it('должен устанавливать error при ошибке получения заказа', () => {
      const action = {
        type: 'feed/fetchOrderByNumber/rejected',
        payload: 'Заказ не найден'
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Заказ не найден');
      expect(result.currentOrder).toBeNull();
    });
  });

  describe('Проверка начального состояния', () => {
    it('должно соответствовать ожидаемой структуре', () => {
      expect(initialState).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        currentOrder: null
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
});
