import type { TIngredient, TOrder, TUser } from '../../../src/utils/types';

describe('Проверка корректности работы конструктора бургера', () => {
  let ingredients: TIngredient[];
  let orderResponse: any;

  // Подгружаем моки, токен
  beforeEach(() => {
    cy.fixture('ingredients.json').then((data) => {
      ingredients = data.data;
    });
    cy.fixture('order-response.json').then((data) => {
      orderResponse = data;
    });

    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '/api/auth/user', {
      fixture: 'user-data.json'
    }).as('getUser');

    cy.intercept('POST', '/api/orders', {
      fixture: 'order-response.json'
    }).as('createOrder');

    cy.setCookie('accessToken', 'fake-access-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  // Очищаем токен и куки
  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  // Тесты

  // Тесты на функциональность модалки
  it('Открытие и закрытие модального окна по крестику', () => {
    const ingredient = ingredients[0];

    cy.get(`[data-cy="ingredient-${ingredient._id}"]`).click();
    cy.get('#modals [data-cy="modal"]').should('be.visible');

    cy.get('#modals [data-cy="close-modal"]').click();
    cy.url().should('include', '/');
    cy.get('#modals [data-cy="modal"]').should('not.exist');
  });

  it('Открытие и закрытие модального окна по оверлею', () => {
    const ingredient = ingredients[0];

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(`[data-cy="ingredient-${ingredient._id}"]`).click();
    cy.get('#modals [data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-overlay"]').click(0, 0, { force: true });
    cy.url().should('include', '/');
    cy.get('#modals [data-cy="modal"]').should('not.exist');
  });

  // Объединенное: тест на добавление ингредиентов в конструктор, тест на отправку заказа
  it('Добавление ингредиента из списка в конструктор по клику, оформление и отправка заказа на сервер', () => {
    const bun = ingredients.find((i) => i.type === 'bun')!;
    const main = ingredients.find((i) => i.type === 'main')!;
    const orderNumber = orderResponse.order.number;

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.get(`[data-cy="ingredient-${bun._id}"]`).should('be.visible');

    // Добавление булок
    cy.get(`[data-cy="ingredient-${bun._id}"]`)
      .find('button')
      .should('be.visible')
      .click();
    cy.contains('[data-cy="bun-top"]', bun.name, { matchCase: false }).should(
      'be.visible'
    );
    cy.contains('[data-cy="bun-bottom"]', bun.name, {
      matchCase: false
    }).should('be.visible');

    // Добавление начинки
    cy.get(`[data-cy="ingredient-${main._id}"]`)
      .find('button')
      .should('be.visible')
      .click();
    cy.contains('[data-cy="main-section"]', main.name, {
      matchCase: false
    }).should('be.visible');

    // Оформление заказа
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@createOrder').then((interception) => {
      expect(interception.response).to.exist;
      expect(interception.response?.body.order.number).to.equal(orderNumber);
    });

    // Проверка корректности номера заказа в модалке
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.contains('[data-cy="order-number"]', orderNumber.toString(), {
      matchCase: false
    }).should('be.visible');
    cy.get('#modals [data-cy="close-modal"]').click();
    cy.url().should('include', '/');
    cy.get('#modals [data-cy="modal"]').should('not.exist');

    // Проверка очищения конструктора
    cy.get('[data-cy="no-bun-top"]').should('be.visible');
    cy.get('[data-cy="no-bun-bottom"]').should('be.visible');
    cy.get('[data-cy="no-ingredients"]').should('be.visible');
    cy.get('[data-cy="total-price"]').should('have.text', '0');
  });
});
// import type { TIngredient, TOrder, TUser } from '../../../src/utils/types';

// describe('Проверка корректности работы конструктора бургера', () => {
//   let ingredients: TIngredient[];
//   let orderResponse: TOrder;
//   let userData: TUser;

//   // Подгружаем моки, токен
//   beforeEach(() => {
//     cy.fixture('ingredients.json').then((data) => {
//       ingredients = data.data;
//     });
//     cy.fixture('order-response.json').then((data: TOrder) => {
//       orderResponse = data;
//     });
//     cy.fixture('user-data.json').then((data: TUser) => {
//       userData = data;
//     });

//     cy.intercept('GET', '/api/ingredients', {
//       fixture: 'ingredients.json'
//     }).as('getIngredients');

//     cy.intercept('GET', '/api/auth/user', {
//       fixture: 'user-data.json'
//     }).as('getUser');

//     cy.intercept('POST', '/api/orders', {
//       fixture: 'order-response.json'
//     }).as('createOrder');

//     cy.intercept('GET', '/api/orders', {
//       fixture: 'orders-history.json'
//     }).as('getOrdersHistory');

//     cy.setCookie('accessToken', 'fake-access-token');
//     window.localStorage.setItem('refreshToken', 'fake-refresh-token');

//     cy.visit('/');
//     cy.wait('@getIngredients');
//   });

//   // Очищаем токен и куки
//   afterEach(() => {
//     cy.clearCookie('accessToken');
//     window.localStorage.removeItem('refreshToken');
//   });

//   // Тесты

//   // Тесты на функциональность модалки
//   it('Открытие и закрытие модального окна по крестику, отображение данных кликнутого ингредиента', () => {
//     const ingredient = ingredients[0];

//     cy.openIngredientModal(ingredient);

//     // Проверяем, что в модалке отображается название ингредиента
//     cy.contains('[data-cy="modal-ingredient-name"]', ingredient.name, {
//       matchCase: false
//     }).should('be.visible');

//     if (ingredient.calories !== undefined) {
//       cy.contains(
//         '[data-cy="modal-ingredient-calories"]',
//         ingredient.calories.toString(),
//         { matchCase: false }
//       ).should('be.visible');
//     }
//     if (ingredient.proteins !== undefined) {
//       cy.contains(
//         '[data-cy="modal-ingredient-proteins"]',
//         ingredient.proteins.toString(),
//         { matchCase: false }
//       ).should('be.visible');
//     }
//     if (ingredient.fat !== undefined) {
//       cy.contains(
//         '[data-cy="modal-ingredient-fat"]',
//         ingredient.fat.toString(),
//         { matchCase: false }
//       ).should('be.visible');
//     }
//     if (ingredient.carbohydrates !== undefined) {
//       cy.contains(
//         '[data-cy="modal-ingredient-carbohydrates"]',
//         ingredient.carbohydrates.toString(),
//         { matchCase: false }
//       ).should('be.visible');
//     }

//     cy.closeModal();

//     cy.url().should('include', '/');
//   });

//   it('Открытие и закрытие модального окна по оверлею', () => {
//     const ingredient = ingredients[0];

//     cy.visit('/');
//     cy.wait('@getIngredients');

//     cy.openIngredientModal(ingredient);

//     cy.get('[data-cy="modal-overlay"]')
//       .as('modalOverlay')
//       .click(0, 0, { force: true });

//     cy.url().should('include', '/');
//     cy.get('@modalWindow').should('not.exist');
//   });

//   // Объединённое: тест на добавление ингредиентов в конструктор, тест на отправку заказа
//   it('Добавление ингредиента из списка в конструктор по клику, оформление и отправка заказа на сервер', () => {
//     const bun = ingredients.find((i) => i.type === 'bun')!;
//     const main = ingredients.find((i) => i.type === 'main')!;
//     const orderNumber = orderResponse.number;

//     cy.wait('@getIngredients');
//     cy.wait('@getUser');

//     cy.addIngredientToConstructor(bun);

//     cy.contains('[data-cy="bun-top"]', bun.name, { matchCase: false })
//       .as('bunTop')
//       .should('be.visible');

//     cy.contains('[data-cy="bun-bottom"]', bun.name, {
//       matchCase: false
//     })
//       .as('bunBottom')
//       .should('be.visible');

//     // Добавление начинки
//     cy.addIngredientToConstructor(main);

//     cy.contains('[data-cy="main-section"]', main.name, {
//       matchCase: false
//     })
//       .as('mainSection')
//       .should('be.visible');

//     // Оформление заказа
//     cy.get('[data-cy="order-button"]').as('orderButton').click();

//     cy.wait('@createOrder').then((interception) => {
//       expect(interception.response).to.exist;
//       expect(interception.response?.body.number).to.equal(orderNumber);
//     });

//     cy.verifyOrderModalAndClose(orderNumber);

//     // Ждём запрос на загрузку истории заказов после закрытия модалки
//     cy.wait('@getOrdersHistory').then((interception) => {
//       expect(interception.response).to.exist;
//       expect(interception.response?.body.success).to.be.true;
//       const orderInHistory = interception.response?.body.orders.find(
//         (o: any) => o.number === orderNumber
//       );
//       expect(orderInHistory).to.exist;
//     });

//     // Проверка очищения конструктора
//     cy.verifyConstructorCleared();
//   });
// });
