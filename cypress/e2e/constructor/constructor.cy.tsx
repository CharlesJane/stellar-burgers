import type { TIngredient, TOrder, TUser } from '../../../src/utils/types';

describe('Конструктор бургера', () => {
  let ingredients: TIngredient[];
  let orderResponse: any;

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

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Добавление ингредиента из списка в конструктор по клику', () => {
    const bun = ingredients.find((i) => i.type === 'bun')!;
    const main = ingredients.find((i) => i.type === 'main')!;

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // Ждём видимости контейнера ингредиента
    cy.get(`[data-cy="ingredient-${bun._id}"]`).should('be.visible');

    // Ищем кнопку внутри контейнера ингредиента
    cy.get(`[data-cy="ingredient-${bun._id}"]`)
      .find('button')
      .should('be.visible')
      .click();

    // Проверка: булка появилась сверху
    cy.get('[data-cy="bun-top"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', bun.name);

    // ПРОВЕРКА: булка появилась снизу (новый шаг)
    cy.get('[data-cy="bun-bottom"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', bun.name);

    // Добавление начинки
    cy.get(`[data-cy="ingredient-${main._id}"]`)
      .find('button')
      .should('be.visible')
      .click();
    cy.get('[data-cy="main-section"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', main.name);
  });

  it('Закрытие модального окна по крестику', () => {
    const ingredient = ingredients[0];

    cy.get(`[data-cy="ingredient-${ingredient._id}"]`).click();
    cy.get('#modals [data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-title"]').should('contain', 'Описание ингредиента');

    cy.get('#modals [data-cy="close-modal"]').click();
    cy.url().should('include', '/');
    cy.get('#modals [data-cy="modal"]').should('not.exist');
  });

  it('Закрытие модального окна по оверлею', () => {
    const ingredient = ingredients[0];

    cy.visit('/'); // возвращаем страницу к исходному состоянию
    cy.wait('@getIngredients');

    cy.get(`[data-cy="ingredient-${ingredient._id}"]`).click();
    cy.get('#modals [data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-overlay"]').click(0, 0, { force: true });
    cy.url().should('include', '/');
    cy.get('#modals [data-cy="modal"]').should('not.exist');
  });

  // it('Создание заказа: сборка, оформление, проверка и очистка конструктора', () => {
  //   const bun = ingredients.find((i) => i.type === 'bun')!;
  //   const main = ingredients.find((i) => i.type === 'main')!;
  //   const orderNumber = orderResponse.order.number;

  //   // 1. Сборка бургера
  //   cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
  //   cy.get(`[data-cy="ingredient-${main._id}"]`).click(); // Начинка

  //   cy.get('[data-cy="bun-top"]', { timeout: 10000 })
  //     .should('be.visible')
  //     .and('contain', bun.name);
  //   cy.get('[data-cy="bun-bottom"]', { timeout: 10000 })
  //     .should('be.visible')
  //     .and('contain', bun.name);
  //   cy.get('[data-cy="main-section"]', { timeout: 10000 })
  //     .should('be.visible')
  //     .and('contain', main.name);

  //   // 2. Оформление заказа
  //   cy.get('[data-cy="order-button"]').click();
  //   cy.wait('@createOrder').then((interception) => {
  //     // Проверка существования ответа
  //     expect(interception.response).to.exist;
  //     // Дополнительная проверка: ответ API содержит ожидаемый номер
  //     expect(interception.response?.body.order.number).to.equal(orderNumber);
  //   });

  //   // 3. Проверка модального окна
  //   cy.get('[data-cy="modal"]').should('be.visible');
  //   cy.get('[data-cy="order-number"]').should('contain', orderNumber);

  //   // 4. Закрытие модального окна
  //   cy.get('[data-cy="close-modal"]').click();
  //   cy.get('[data-cy="modal"]').should('not.be.visible');

  //   // 5. Проверка пустого конструктора
  //   cy.get('[data-cy="no-bun-top"]').should('be.visible');
  //   cy.get('[data-cy="no-bun-bottom"]').should('be.visible');
  //   cy.get('[data-cy="no-ingredients"]').should('be.visible');
  //   cy.get('[data-cy="total-price"]').should('have.text', '0');
  // });
});
