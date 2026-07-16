declare global {
  namespace Cypress {
    interface Chainable {
      visitPage(path: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("visitPage", (path: string) => {
  cy.visit(path);
  cy.url().should("include", path);
});

export {};
