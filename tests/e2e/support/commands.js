// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

//fileName = midnightCity.zip
Cypress.Commands.add("chooseSong", fileName => {
  cy.get("input.file-selector").then(el => {
    cy.fixture(fileName)
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => new File([blob], fileName))
      .then(zipFile => {
        /** @type {HTMLInputElement} */
        let input = el[0];
        let dt = new DataTransfer();
        dt.items.add(zipFile);
        input.files = dt.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
  });
});
