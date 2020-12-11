/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const setApiUrl = (save=false) => {
  cy.findAllByTestId('settings-view-toggle-button')
    .click();

  cy.findByLabelText('Statistics URL')
    .type('/api/statistics');

  if (save) {
    cy.findByText('Save to local storage')
      .click();
  }

  cy.findAllByTestId('settings-view-toggle-button')
    .click();
}

context('Settings', (): void => {
  before((): void => {
    cy.visit(Cypress.env('TARGET') || 'http://localhost:3000');
  });

  it('allows saving settings to local storage', (): void => {
    cy.contains('Getting started');

    setApiUrl();
    cy.contains('Was not able to fetch data from the server.');

    cy.reload()
    cy.contains('Getting started');

    setApiUrl(true);
    cy.contains('Was not able to fetch data from the server.');

    cy.reload()
    cy.contains('Was not able to fetch data from the server.');
  });
});
