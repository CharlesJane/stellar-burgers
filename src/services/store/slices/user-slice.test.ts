import { userSlice } from './user-slice';
import { describe, expect, it, jest } from '@jest/globals';
import type { TUser } from '@utils-types';

// Начальное состояние
const { reducer } = userSlice;
const initialState = {
  data: null,
  loading: false,
  error: null
};

// Моки данных
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Иван Иванов'
};

const mockUpdatedUser: TUser = {
  email: 'updated@example.com',
  name: 'Иван Петров'
};

// Тесты

describe('Тестирование редьюсера пользователя', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('Обработка fetchUser.pending', () => {
    it('должен устанавливать loading: true и сбрасывать error при начале загрузки данных пользователя', () => {
      const action = { type: 'user/fetchUser/pending' };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
    });
  });

  describe('Обработка fetchUser.fulfilled', () => {
    it('должен корректно обновлять data при успешной загрузке данных пользователя', () => {
      const action = {
        type: 'user/fetchUser/fulfilled',
        payload: mockUser
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockUser);
    });

    it('должен обрабатывать null в качестве данных пользователя', () => {
      const action = {
        type: 'user/fetchUser/fulfilled',
        payload: null
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
    });
  });

  describe('Обработка fetchUser.rejected', () => {
    it('должен устанавливать error при ошибке с строковым payload', () => {
      const action = {
        type: 'user/fetchUser/rejected',
        payload: 'Ошибка сети'
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка сети');
      expect(result.data).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при отсутствии payload', () => {
      const action = {
        type: 'user/fetchUser/rejected',
        error: {}
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки данных пользователя');
      expect(result.data).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при payload нестрокового типа', () => {
      const action = {
        type: 'user/fetchUser/rejected',
        payload: { message: 'Нестроковая ошибка' }
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки данных пользователя');
    });

    it('должен заменять предыдущую ошибку новой', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка'
      };

      const action = {
        type: 'user/fetchUser/rejected',
        payload: 'Новая ошибка'
      };
      const result = reducer(stateWithError, action);

      expect(result.error).toBe('Новая ошибка');
    });
  });

  describe('Обработка updateUser.pending', () => {
    it('должен устанавливать loading: true и сбрасывать error при начале обновления данных пользователя', () => {
      const action = { type: 'user/updateUser/pending' };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
    });
  });

  describe('Обработка updateUser.fulfilled', () => {
    it('должен корректно обновлять data при успешном обновлении данных пользователя', () => {
      const action = {
        type: 'user/updateUser/fulfilled',
        payload: mockUpdatedUser
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockUpdatedUser);
    });

    it('должен обновлять существующие данные пользователя', () => {
      const stateWithUser = {
        ...initialState,
        data: mockUser
      };

      const action = {
        type: 'user/updateUser/fulfilled',
        payload: mockUpdatedUser
      };
      const result = reducer(stateWithUser, action);

      expect(result.data).toEqual(mockUpdatedUser);
      expect(result.data).not.toEqual(mockUser);
    });
  });

  describe('Обработка updateUser.rejected', () => {
    it('должен устанавливать error при ошибке обновления с строковым payload', () => {
      const action = {
        type: 'user/updateUser/rejected',
        payload: 'Ошибка сохранения'
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка сохранения');
      expect(result.data).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при ошибке обновления без payload', () => {
      const action = {
        type: 'user/updateUser/rejected',
        error: {}
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка обновления данных пользователя');
    });

    it('должен использовать сообщение по умолчанию при payload нестрокового типа при ошибке обновления', () => {
      const action = {
        type: 'user/updateUser/rejected',
        payload: { code: 500 }
      };
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка обновления данных пользователя');
    });
  });

  describe('Проверка начального состояния', () => {
    it('должно соответствовать ожидаемой структуре', () => {
      expect(initialState).toEqual({
        data: null,
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
    it('должен корректно обрабатывать последовательность: fetchUser pending → fulfilled', () => {
      const pendingAction = { type: 'user/fetchUser/pending' };
      let result = reducer(initialState, pendingAction);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeNull();

      const fulfilledAction = {
        type: 'user/fetchUser/fulfilled',
        payload: mockUser
      };
      result = reducer(result, fulfilledAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockUser);
    });

    it('должен корректно обрабатывать последовательность: updateUser pending → rejected', () => {
      const pendingAction = { type: 'user/updateUser/pending' };
      let result = reducer(initialState, pendingAction);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeNull();

      const rejectedAction = {
        type: 'user/updateUser/rejected',
        payload: 'Ошибка обновления профиля'
      };
      result = reducer(result, rejectedAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка обновления профиля');
      expect(result.data).toBeNull();
    });

    it('должен корректно обрабатывать цепочку: fetchUser pending → rejected → updateUser pending → fulfilled', () => {
      let result = reducer(initialState, { type: 'user/fetchUser/pending' });
      expect(result.loading).toBe(true);

      result = reducer(result, {
        type: 'user/fetchUser/rejected',
        payload: 'Ошибка загрузки'
      });
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки');

      result = reducer(result, { type: 'user/updateUser/pending' });
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();

      result = reducer(result, {
        type: 'user/updateUser/fulfilled',
        payload: mockUpdatedUser
      });
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockUpdatedUser);
    });

    it('должен сбрасывать error при новом запросе (даже если был предыдущий error)', () => {
      const stateWithError = {
        ...initialState,
        error: 'Ошибка загрузки данных пользователя'
      };

      const action = { type: 'user/updateUser/pending' };
      const result = reducer(stateWithError, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
    });
  });
});
