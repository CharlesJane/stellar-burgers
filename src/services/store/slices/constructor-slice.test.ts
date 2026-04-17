import { burgerConstructorSlice } from './constructor-slice';
import type { BurgerConstructorState } from './constructor-slice';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it } from '@jest/globals';
import { TOrder } from '@utils-types';

// Начальное состояние
const { reducer } = burgerConstructorSlice;
const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

// Моки
const testIngredient1 = {
  _id: '1',
  id: '1',
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
};

const testIngredient2 = {
  _id: '2',
  id: '2',
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
};

const testIngredient3 = {
  _id: '3',
  id: '3',
  name: 'ингредиент 3',
  type: 'main',
  price: 100,
  calories: 100,
  carbohydrates: 10,
  fat: 10,
  proteins: 10,
  image: 'img3.jpg',
  image_mobile: 'img3_mobile.jpg',
  image_large: 'img3_desktop.jpg'
};

const testBun = {
  _id: 'bun1',
  id: 'bun1',
  name: 'Булочка классическая',
  type: 'bun',
  price: 50,
  calories: 200,
  carbohydrates: 30,
  fat: 8,
  proteins: 6,
  image: 'bun.jpg',
  image_mobile: 'bun_mobile.jpg',
  image_large: 'bun_desktop.jpg'
};

const mockOrder: TOrder = {
  _id: 'order123',
  status: 'done',
  name: 'Мой заказ',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 123,
  ingredients: ['1', '2']
};

// Тесты

describe('Тестирование редьюсера конструктора бургеров', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  describe('Тестирование добавление ингредиента в конструктор', () => {
    it('Должен добавляться ингредиент с уникальным id в список ингредиентов заказа', () => {
      const action =
        burgerConstructorSlice.actions.addIngredientToConstructor(
          testIngredient1
        );

      const result = reducer(initialState, action);

      expect(result.constructorItems.ingredients).toHaveLength(1);

      const addedIngredient = result.constructorItems.ingredients[0];
      const { uniqueKey, ...ingredientWithoutKey } = addedIngredient;

      expect(ingredientWithoutKey).toEqual(testIngredient1);
      expect(addedIngredient).toHaveProperty('uniqueKey');
      expect(typeof uniqueKey).toBe('string');
      if (typeof uniqueKey === 'string') {
        expect(uniqueKey.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Тестирование удаления ингредиента из конструктора', () => {
    it('Ингредиент должен удаляться из списка', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [
            { ...testIngredient1, uniqueKey: uuidv4() },
            { ...testIngredient2, uniqueKey: uuidv4() }
          ]
        }
      };
      const action = burgerConstructorSlice.actions.removeIngredient('1');
      const result = reducer(stateWithIngredients, action);
      expect(result.constructorItems.ingredients).toHaveLength(1);
      expect(result.constructorItems.ingredients[0].id).toBe('2');
    });

    it('Должен корректно удалять ингредиент из массива с одним элементом', () => {
      const stateWithOneIngredient = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [{ ...testIngredient1, uniqueKey: uuidv4() }]
        }
      };
      const action = burgerConstructorSlice.actions.removeIngredient('1');
      const result = reducer(stateWithOneIngredient, action);
      expect(result.constructorItems.ingredients).toHaveLength(0);
    });

    it('Состояние не должно меняться, если ингредиент не найден', () => {
      const action = burgerConstructorSlice.actions.removeIngredient('999');
      const result = reducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Перемещение ингредиента вверх', () => {
    it('Ингредиент должен перемещаться вверх', () => {
      const stateWithOneIngredient = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [{ ...testIngredient1, uniqueKey: uuidv4() }]
        }
      };
      const action = burgerConstructorSlice.actions.moveIngredientUp({
        index: 0
      });
      const result = reducer(stateWithOneIngredient, action);
      expect(result).toEqual(stateWithOneIngredient);
    });

    it('должен перемещать ингредиент вверх в массиве из трёх элементов', () => {
      const stateWithThreeIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [
            { ...testIngredient1, uniqueKey: 'key1' },
            { ...testIngredient2, uniqueKey: 'key2' },
            { ...testIngredient3, uniqueKey: 'key3' }
          ]
        }
      };
      const action = burgerConstructorSlice.actions.moveIngredientUp({
        index: 2
      });
      const result = reducer(stateWithThreeIngredients, action);
      expect(result.constructorItems.ingredients[0].id).toBe('1');
      expect(result.constructorItems.ingredients[1].id).toBe('3');
      expect(result.constructorItems.ingredients[2].id).toBe('2');
    });

    it('Ингредиент не должен перемещаться вверх, если он первый в списке', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [{ ...testIngredient1, uniqueKey: 'key1' }]
        }
      };
      const action = burgerConstructorSlice.actions.moveIngredientUp({
        index: 0
      });
      const result = reducer(stateWithIngredients, action);
      expect(result).toEqual(stateWithIngredients);
    });
  });

  describe('Перемещение ингредиента вниз', () => {
    it('Ингредиент должен перемещаться вниз', () => {
      const stateWithOneIngredient = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [{ ...testIngredient1, uniqueKey: uuidv4() }]
        }
      };
      const action = burgerConstructorSlice.actions.moveIngredientDown({
        index: 0
      });
      const result = reducer(stateWithOneIngredient, action);
      expect(result).toEqual(stateWithOneIngredient);
    });

    it('должен перемещать ингредиент вниз в массиве из трёх элементов', () => {
      const stateWithThreeIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [
            { ...testIngredient3, uniqueKey: 'key1' },
            { ...testIngredient1, uniqueKey: 'key2' },
            { ...testIngredient2, uniqueKey: 'key3' }
          ]
        }
      };
      const action = burgerConstructorSlice.actions.moveIngredientDown({
        index: 0
      });
      const result = reducer(stateWithThreeIngredients, action);
      expect(result.constructorItems.ingredients[0].id).toBe('1');
      expect(result.constructorItems.ingredients[1].id).toBe('3');
      expect(result.constructorItems.ingredients[2].id).toBe('2');
    });

    it('Ингредиент не должен перемещаться вниз, если он уже последный в списке', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [{ ...testIngredient1, uniqueKey: 'key1' }]
        }
      };
      const action = burgerConstructorSlice.actions.moveIngredientDown({
        index: 0
      });
      const result = reducer(stateWithIngredients, action);
      expect(result).toEqual(stateWithIngredients);
    });
  });

  describe('Установка булочки в нужные поля', () => {
    it('Должен устанавливать булку, когда тип ингредиента "bun"', () => {
      const action = burgerConstructorSlice.actions.setBun(testBun);
      const result = reducer(initialState, action);

      expect(result.constructorItems.bun).toEqual(testBun);
      expect(result.constructorItems.ingredients).toHaveLength(0); // ингредиенты не затронуты
    });

    it('Добавление новой булочки должно заменять старую на выбранную', () => {
      // Начальное состояние с булочкой
      const stateWithBun = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          bun: {
            _id: 'old-bun',
            id: 'old-bun',
            name: 'Старая булочка',
            type: 'bun',
            price: 40,
            calories: 180,
            carbohydrates: 28,
            fat: 7,
            proteins: 5,
            image: 'old-bun.jpg',
            image_mobile: 'old-bun_mobile.jpg',
            image_large: 'old-bun_desktop.jpg'
          }
        }
      };

      const action = burgerConstructorSlice.actions.setBun(testBun);
      const result = reducer(stateWithBun, action);

      expect(result.constructorItems.bun).toEqual(testBun); // старая булочка заменена на новую
      expect(result.constructorItems.ingredients).toHaveLength(0);
    });

    it('Добавление булочки не должно мутировать список ингредиентов', () => {
      // Состояние с ингредиентами
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [
            { ...testIngredient1, uniqueKey: uuidv4() },
            { ...testIngredient2, uniqueKey: uuidv4() }
          ]
        }
      };

      const action = burgerConstructorSlice.actions.setBun(testBun);
      const result = reducer(stateWithIngredients, action);

      expect(result.constructorItems.bun).toEqual(testBun); // булочка установлена
      expect(result.constructorItems.ingredients).toHaveLength(2); // массив ингредиентов не изменился
      expect(result.constructorItems.ingredients[0].id).toBe('1'); // первый ингредиент на месте
      expect(result.constructorItems.ingredients[1].id).toBe('2'); // второй ингредиент на месте
    });
  });

  describe('Тестирование отправки заказа', () => {
    it('Должен успешно отправлять заказ', () => {
      const action = burgerConstructorSlice.actions.setOrderRequest(true);
      const result = reducer(initialState, action);
      expect(result.orderRequest).toBe(true);
    });

    it('Должен выпадать в ошибку при отправке заказа', () => {
      const stateWithRequest = {
        ...initialState,
        orderRequest: true
      };
      const action = burgerConstructorSlice.actions.setOrderRequest(false);
      const result = reducer(stateWithRequest, action);
      expect(result.orderRequest).toBe(false);
    });
  });

  describe('Сброс значений конструктора после удачного заказа', () => {
    it('Должен сбрасывать до начальных значений', () => {
      const modifiedState = {
        ...initialState,
        constructorItems: {
          bun: testBun,
          ingredients: [{ ...testIngredient1, uniqueKey: uuidv4() }]
        },
        orderRequest: true,
        orderModalData: mockOrder
      };

      const action = burgerConstructorSlice.actions.resetConstructor();
      const result = reducer(modifiedState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('Тест на установку данных заказа в модальное окно', () => {
    it('Должен устанавливать переданные данные в поля', () => {
      const action =
        burgerConstructorSlice.actions.setOrderModalData(mockOrder);
      const result = reducer(initialState, action);
      expect(result.orderModalData).toEqual(mockOrder);
    });

    it('Должен сбрасывать значения полей', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder
      };
      const action = burgerConstructorSlice.actions.setOrderModalData(null);
      const result = reducer(stateWithOrder, action);
      expect(result.orderModalData).toBeNull();
    });
  });

  describe('Тестирование закрытия модального окна', () => {
    it('Должен закрывать модальное окно после успешного заказа', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder
      };

      const action = burgerConstructorSlice.actions.closeOrderModal();
      const result = reducer(stateWithOrder, action);

      expect(result.orderModalData).toBeNull();
    });
  });

  describe('Тестирование дополнительных редьюсеров для создания заказа', () => {
    describe('Тестирование состояния загрузки создания заказа', () => {
      it('Должен передавать данные о создании заказа и устанавливать начальное состояние для данных модального окна', () => {
        const action = { type: 'burgerConstructor/createOrder/pending' };
        const result = reducer(initialState, action);

        expect(result.orderRequest).toBe(true);
        expect(result.orderModalData).toBeNull();
      });
    });

    describe('Тестирование состояния выполненного создания заказа', () => {
      it('Должен передать данные о завершении создания заказа, установить данные о заказе в модалку и сбросить значение конструктора', () => {
        const action = {
          type: 'burgerConstructor/createOrder/fulfilled',
          payload: mockOrder
        };
        const result = reducer(initialState, action);

        expect(result.orderRequest).toBe(false);
        expect(result.orderModalData).toEqual(mockOrder);
        expect(result.constructorItems).toEqual({
          bun: null,
          ingredients: []
        });
      });
    });

    describe('Тестирование состояния ошибки создания заказа', () => {
      it('Должен передать данные об ошибке, если она произошла', () => {
        const action = {
          type: 'burgerConstructor/createOrder/rejected',
          error: { message: 'Ошибка создания заказа' }
        };
        const result = reducer(initialState, action);

        expect(result.orderRequest).toBe(false);
      });

      it('Должен обрабатывать ошибку без поля message', () => {
        const action = {
          type: 'burgerConstructor/createOrder/rejected',
          error: { name: 'CustomError' }
        };
        const result = reducer(initialState, action);
        expect(result.orderRequest).toBe(false);
      });

      it('Должен передать данные, если ошибка не связана с данными', () => {
        const action = {
          type: 'burgerConstructor/createOrder/rejected',
          error: 'Неизвестная ошибка'
        };
        const result = reducer(initialState, action);
        expect(result.orderRequest).toBe(false);
      });
    });
  });
});
