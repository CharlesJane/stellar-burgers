import { ingredientsSlice } from './ingredients-slice';
import { describe, expect, it, jest } from '@jest/globals';
import type { TIngredient } from '@utils-types';

// Начальное состояние
const { reducer } = ingredientsSlice;
const initialState = {
  items: [],
  loading: false,
  error: null
};

// Моки
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'ингредиент 1',
    type: 'main',
    price: 100,
    calories: 100,
    carbohydrates: 10,
    fat: 10,
    proteins: 10,
    image: 'img1.jpg',
    image_mobile: 'img1_mobile.jpg',
    image_large: 'img1_desktop.jpg'
  },
  {
    _id: '2',
    name: 'ингредиент 2',
    type: 'main',
    price: 150,
    calories: 120,
    carbohydrates: 12,
    fat: 12,
    proteins: 12,
    image: 'img2.jpg',
    image_mobile: 'img2_mobile.jpg',
    image_large: 'img2_desktop.jpg'
  }
];

// Тесты

describe('Тестирование редьюсера ингредиентов', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('Обработка fetchIngredients.pending', () => {
    it('должен устанавливать loading: true и сбрасывать error при начале загрузки ингредиентов', () => {
      const action = { type: 'ingredients/fetchIngredients/pending' };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.items).toEqual([]);
    });
  });

  describe('Обработка fetchIngredients.fulfilled', () => {
    it('должен корректно обновлять items при успешной загрузке ингредиентов', () => {
      const action = {
        type: 'ingredients/fetchIngredients/fulfilled',
        payload: mockIngredients
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.items).toEqual(mockIngredients);
      expect(result.items).toHaveLength(2);
    });

    it('должен обрабатывать пустой массив ингредиентов', () => {
      const action = {
        type: 'ingredients/fetchIngredients/fulfilled',
        payload: []
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.items).toEqual([]);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('Обработка fetchIngredients.rejected', () => {
    it('должен устанавливать error при ошибке загрузки ингредиентов (с payload)', () => {
      const action = {
        type: 'ingredients/fetchIngredients/rejected',
        payload: 'Ошибка загрузки ингредиентов'
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки ингредиентов');
      expect(result.items).toEqual([]);
    });

    it('должен использовать сообщение по умолчанию при отсутствии payload', () => {
      const action = {
        type: 'ingredients/fetchIngredients/rejected',
        error: {}
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Неизвестная ошибка');
      expect(result.items).toEqual([]);
    });

    it('должен заменять предыдущую ошибку новой', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка'
      };

      const action = {
        type: 'ingredients/fetchIngredients/rejected',
        payload: 'Новая ошибка'
      };
      const result = reducer(stateWithError, action);

      expect(result.error).toBe('Новая ошибка');
    });
  });

  describe('Проверка начального состояния', () => {
    it('должно соответствовать ожидаемой структуре', () => {
      expect(initialState).toEqual({
        items: [],
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
      const pendingAction = { type: 'ingredients/fetchIngredients/pending' };
      let result = reducer(initialState, pendingAction);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();

      const fulfilledAction = {
        type: 'ingredients/fetchIngredients/fulfilled',
        payload: mockIngredients
      };
      result = reducer(result, fulfilledAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.items).toEqual(mockIngredients);
    });

    it('должен корректно обрабатывать последовательность: pending → rejected', () => {
      const pendingAction = { type: 'ingredients/fetchIngredients/pending' };
      let result = reducer(initialState, pendingAction);

      expect(result.loading).toBe(true);

      const rejectedAction = {
        type: 'ingredients/fetchIngredients/rejected',
        payload: 'Ошибка сети'
      };
      result = reducer(result, rejectedAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка сети');
    });
  });
});
