describe('test error handling', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.intercept('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');

    cy.visit('/login/e2e');
    cy.get('#tokenInput').type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();

    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click({ force: true });
  });

  it('displays error toasts with error detail', () => {
    cy.intercept('POST', '/api/repository/v1/datasets/**/data/**', {
      statusCode: 401,
      body: {
        message: 'Was not able to query',
        errorDetail: ['This is the reason for the error'],
      },
    }).as('getQueryResults');

    cy.get('a > .MuiButtonBase-root').click({ force: true });

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults']);
    cy.contains('Error 401: This is the reason for the error').should('be.visible');
  });

  it('displays error toasts with empty error detail', () => {
    cy.intercept('POST', '/api/repository/v1/datasets/**/data/**', {
      statusCode: 401,
      body: {
        message: 'Was not able to query',
        errorDetail: [],
      },
    }).as('getQueryResults');

    cy.get('a > .MuiButtonBase-root').click({ force: true });

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults']);
    cy.contains('Error 401: Was not able to query').should('be.visible');
  });

  it('displays error toasts with no error detail', () => {
    cy.intercept('POST', '/api/repository/v1/datasets/**/data/**', {
      statusCode: 401,
      body: {
        message: 'Was not able to query',
      },
    }).as('getQueryResults');

    cy.get('a > .MuiButtonBase-root').click({ force: true });

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults']);
    cy.contains('Error 401: Was not able to query').should('be.visible');
  });
});
