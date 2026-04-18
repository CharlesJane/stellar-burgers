import type { TIngredient } from '../../src/utils/types';

declare global {
  namespace Cypress {
    interface Chainable {
      openIngredientModal(ingredient: TIngredient): void;
      closeModal(): void;
      addIngredientToConstructor(ingredient: TIngredient): void;
      verifyOrderModalAndClose(orderNumber: number): void;
      verifyConstructorCleared(): void;
    }
  }
}

Cypress.Commands.add('openIngredientModal', (ingredient: TIngredient) => {
  cy.get(`[data-cy="ingredient-${ingredient._id}"]`)
    .as('ingredientElement')
    .click()
    .get('#modals [data-cy="modal"]')
    .as('modalWindow')
    .should('be.visible');
});

Cypress.Commands.add('closeModal', () => {
  cy.get('@modalWindow')
    .find('[data-cy="close-modal"]')
    .as('closeModalButton')
    .should('be.visible')
    .click()
    .get('@modalWindow')
    .should('not.exist');
});

Cypress.Commands.add(
  'addIngredientToConstructor',
  (ingredient: TIngredient) => {
    cy.get(`[data-cy="ingredient-${ingredient._id}"]`)
      .find('button')
      .as(`${ingredient.type}Button`)
      .should('be.visible')
      .click();
  }
);

Cypress.Commands.add('verifyOrderModalAndClose', (orderNumber: number) => {
  cy.get('#modals [data-cy="modal"]')
    .as('orderModal')
    .should('be.visible')
    .contains('[data-cy="order-number"]', orderNumber.toString(), {
      matchCase: false
    })
    .as('orderNumberElement')
    .should('be.visible')
    .get('@orderModal')
    .find('[data-cy="close-modal"]')
    .as('closeOrderModalButton')
    .should('be.visible')
    .click()
    .get('@orderModal')
    .should('not.exist')
    .url()
    .should('include', '/');
});

Cypress.Commands.add('verifyConstructorCleared', () => {
  cy.get('[data-cy="no-bun-top"]')
    .as('noBunTop')
    .should('be.visible')
    .get('[data-cy="no-bun-bottom"]')
    .as('noBunBottom')
    .should('be.visible')
    .get('[data-cy="no-ingredients"]')
    .as('noIngredients')
    .should('be.visible')
    .get('[data-cy="total-price"]')
    .as('totalPrice')
    .should('have.text', '0');
});
