type UserRole = "User" | "Reviewer" | "Admin";

interface MockUser {
  email: string;
  role: UserRole;
  publicMetadata: {
    role: UserRole;
  };
}

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, role: UserRole): Chainable<void>;
      visitPage(path: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, role: UserRole) => {
  const mockUser: MockUser = {
    email,
    role,
    publicMetadata: { role },
  };

  cy.window().then((win) => {
    win.localStorage.setItem("__mock_user", JSON.stringify(mockUser));
  });
});

Cypress.Commands.add("visitPage", (path: string) => {
  cy.visit(path);
  cy.url().should("include", path);
});

export {};
