describe("Transform", () => {
  it("Transform a zip", () => {
    cy.visit("/");
    cy.chooseSong("midnightCity.zip");
  });
});
