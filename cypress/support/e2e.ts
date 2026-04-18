import type { TIngredient } from '../../src/utils/types';

import './commands';
import 'cypress';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      openIngredientModal(ingredient: TIngredient): Chainable<void>;
      closeModal(): Chainable<void>;
      addIngredientToConstructor(ingredient: TIngredient): Chainable<void>;
      verifyOrderModalAndClose(orderNumber: number): Chainable<void>;
      verifyConstructorCleared(): Chainable<void>;
    }
  }
}
