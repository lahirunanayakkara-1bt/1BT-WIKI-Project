import { stubAuthSession } from "../support/auth";

describe("Auth flow: login -> session -> protected route -> logout", () => {
  it("logs in, establishes a session, and reaches the Admin protected route", () => {
    stubAuthSession("Admin");

    cy.visitPage("/signin");
    cy.contains("button", /sign in with google/i).click();

    cy.wait("@signInSocial");
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);

    cy.visitPage("/admin");
    cy.wait("@usersMe");
    cy.contains("h1", "Admin Dashboard").should("be.visible");
  });

  it("blocks the protected route for a logged-in user with the wrong role", () => {
    stubAuthSession("User");

    cy.visitPage("/admin");
    cy.wait("@usersMe");

    cy.contains("h2", "You don't have permission to view this page").should("be.visible");
    cy.contains("h1", "Admin Dashboard").should("not.exist");
  });

  it("blocks the protected route when there is no session", () => {
    stubAuthSession(null);

    cy.visitPage("/admin");
    cy.wait("@usersMe");

    cy.contains("h2", "You don't have permission to view this page").should("be.visible");
    cy.contains("h1", "Admin Dashboard").should("not.exist");
  });

  it("logs out and tears the session down, re-blocking the protected route", () => {
    stubAuthSession("Admin");

    cy.visitPage("/admin");
    cy.wait("@usersMe");
    cy.contains("h1", "Admin Dashboard").should("be.visible");

    cy.get('[data-testid="logout-btn"]').click();
    cy.wait("@signOut");
    cy.url().should("include", "/signin");

    cy.visitPage("/admin");
    cy.wait("@usersMe");
    cy.contains("h2", "You don't have permission to view this page").should("be.visible");
    cy.contains("h1", "Admin Dashboard").should("not.exist");
  });
});
