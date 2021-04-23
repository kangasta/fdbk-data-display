const API_UNREACHABLE = 'Was not able to fetch data from the API.';

const setApiUrl = (save = false) => {
  cy.findAllByTestId('settings-view-toggle-button').click();

  cy.findByLabelText('Statistics URL').type('/api/statistics');

  if (save) {
    cy.findByText('Save to local storage').click();
  }

  cy.findAllByTestId('settings-view-toggle-button').click();
};

context('Settings', (): void => {
  before((): void => {
    cy.visit('/');
  });

  it('allows saving settings to local storage', (): void => {
    cy.contains('Getting started');

    setApiUrl();
    cy.contains(API_UNREACHABLE);

    cy.reload();
    cy.contains('Getting started');

    setApiUrl(true);
    cy.contains(API_UNREACHABLE);

    cy.reload();
    cy.contains(API_UNREACHABLE);
  });
});
