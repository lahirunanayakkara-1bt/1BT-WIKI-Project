import { stubAuthSession } from "../support/auth";

function makeArticle(overrides: Record<string, unknown> = {}) {
  return {
    id: "article-1",
    title: "Getting Started with TypeScript",
    authorId: "test-user-1",
    tags: ["typescript"],
    status: "Published",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z",
    likeCount: 2,
    commentCount: 1,
    ...overrides,
  };
}

describe("My Articles page", () => {
  it("lists the signed-in user's articles and supports search and sort", () => {
    stubAuthSession("User");

    cy.intercept("GET", "**/api/v1/articles/mine*", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          articles: [
            makeArticle({ id: "a1", title: "React Basics", status: "Published" }),
            makeArticle({ id: "a2", title: "Node Deep Dive", status: "Draft" }),
          ],
          total: 2,
          page: 1,
          limit: 20,
        },
      },
    }).as("articlesMine");

    cy.visitPage("/my-articles");
    cy.wait("@usersMe");
    cy.wait("@articlesMine");

    cy.get('[data-testid="article-card-a1"]').should("be.visible");
    cy.get('[data-testid="article-card-a2"]').should("be.visible");

    cy.get('[data-testid="article-search-input"]').type("react");
    cy.get('[data-testid="article-card-a1"]').should("be.visible");
    cy.get('[data-testid="article-card-a2"]').should("not.exist");

    cy.get('[data-testid="article-search-input"]').clear();
    cy.get('[data-testid="article-sort-select"]').select("title");
    cy.get('[data-testid^="article-card-"]').first().should("have.attr", "data-testid", "article-card-a2");
  });

  it("shows an empty state when the user has no articles", () => {
    stubAuthSession("User");

    cy.intercept("GET", "**/api/v1/articles/mine*", {
      statusCode: 200,
      body: { success: true, data: { articles: [], total: 0, page: 1, limit: 20 } },
    }).as("articlesMine");

    cy.visitPage("/my-articles");
    cy.wait("@usersMe");
    cy.wait("@articlesMine");

    cy.get('[data-testid="my-articles-empty"]').should(
      "contain.text",
      "You haven't written any articles yet."
    );
  });

  it("prompts sign-in when there is no session", () => {
    stubAuthSession(null);

    // No session cookies -> proxy.ts middleware redirects server-side before
    // the page ever loads, so we can't use visitPage() (it asserts the URL
    // still matches the visited path).
    cy.visit("/my-articles");
    cy.url().should("include", "/signin");

    cy.contains("h1", "Sign in to continue").should("be.visible");
  });
});
