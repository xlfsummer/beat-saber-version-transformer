// https://docs.cypress.io/api/introduction/api.html

describe("Load", () => {
  it("Contain a title", () => {
    cy.visit("/");
    cy.get("h1").should("exist");
  });
});

describe("Upload button", () => {
  before(() => cy.visit("/"));
  it("Show a button", () => {
    cy.get("input").should("exist");
  });
  it("Can upload multiple", () => {
    cy.get("input").should("have.attr", "multiple");
  });
  it("Allow zip", () => {
    cy.get("input").should("have.attr", "accept", ".zip");
  });
});
