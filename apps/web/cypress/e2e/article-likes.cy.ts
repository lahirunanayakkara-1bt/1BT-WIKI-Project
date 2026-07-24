import { stubAuthSession } from "../support/auth";

// LikeButton is always rendered with the mock article's id ("1"), since
// apps/(dashboard)/articles/[id]/page.tsx falls back to mockArticles['1']
// for any route id. The comments spec uses "a1" (the raw route param
// passed to CommentsSection) — likes intentionally target "1" instead.
describe("Article likes", () => {
  it("likes an article and increments the count", () => {
    stubAuthSession("User");

    cy.intercept("POST", "**/api/v1/articles/1/like", {
      statusCode: 200,
      body: { success: true, data: { liked: true }, message: "Article liked successfully" },
    }).as("likeArticle");

    cy.visitPage("/articles/1");
    cy.wait("@usersMe");

    cy.get('[data-testid="like-button"]').should("contain.text", "42");
    cy.get('[data-testid="like-button"]').click();

    cy.wait("@likeArticle");
    cy.get('[data-testid="like-button"]')
      .should("contain.text", "43")
      .and("have.attr", "aria-pressed", "true");
  });

  it("unlikes an article and decrements the count", () => {
    stubAuthSession("User");

    cy.intercept("POST", "**/api/v1/articles/1/like", {
      statusCode: 200,
      body: { success: true, data: { liked: true }, message: "Article liked successfully" },
    }).as("likeArticle");

    cy.visitPage("/articles/1");
    cy.wait("@usersMe");

    cy.get('[data-testid="like-button"]').click();
    cy.wait("@likeArticle");
    cy.get('[data-testid="like-button"]').should("have.attr", "aria-pressed", "true");

    cy.intercept("DELETE", "**/api/v1/articles/1/like", {
      statusCode: 200,
      body: { success: true, data: { liked: false }, message: "Article unliked successfully" },
    }).as("unlikeArticle");

    cy.get('[data-testid="like-button"]').click();
    cy.wait("@unlikeArticle");
    cy.get('[data-testid="like-button"]')
      .should("contain.text", "42")
      .and("have.attr", "aria-pressed", "false");
  });

  it("reverts and shows an error toast when liking fails", () => {
    stubAuthSession("User");

    cy.intercept("POST", "**/api/v1/articles/1/like", {
      statusCode: 403,
      body: { success: false, error: "Cannot like this article" },
    }).as("likeArticle");

    cy.visitPage("/articles/1");
    cy.wait("@usersMe");

    cy.get('[data-testid="like-button"]').click();
    cy.wait("@likeArticle");

    cy.get('[data-testid="error-toast"]').should("contain.text", "Cannot like this article");
    cy.get('[data-testid="like-button"]')
      .should("contain.text", "42")
      .and("have.attr", "aria-pressed", "false");
  });

  it("guards against double-clicks while a request is in flight", () => {
    stubAuthSession("User");

    cy.intercept("POST", "**/api/v1/articles/1/like", (req) => {
      req.reply({
        delay: 500,
        statusCode: 200,
        body: { success: true, data: { liked: true }, message: "Article liked successfully" },
      });
    }).as("likeArticle");

    cy.visitPage("/articles/1");
    cy.wait("@usersMe");

    cy.get('[data-testid="like-button"]').click();
    cy.get('[data-testid="like-button"]').should("be.disabled").click({ force: true });

    cy.wait("@likeArticle");
    cy.get("@likeArticle.all").should("have.length", 1);
    cy.get('[data-testid="like-button"]')
      .should("contain.text", "43")
      .and("not.be.disabled");
  });
});
