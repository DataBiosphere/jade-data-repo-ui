describe('test error handling', () => {
  beforeEach(() => {
    cy.server();

    cy.route('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.route('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');

    cy.visit('/login/e2e');
    cy.get('#tokenInput').type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();

    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click();
  });

  it('displays error toasts with error detail', () => {
    cy.route({
      method: 'POST',
      url: 'https://bigquery.googleapis.com/bigquery/v2/projects/**/queries',
      status: 401,
      response: {
        message: 'Was not able to query',
        errorDetail: ['This is the reason for the error'],
      },
    }).as('getQueryResults');

    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults']);
    cy.contains('Error 401: This is the reason for the error').should('be.visible');
  });

  it('displays error toasts with empty error detail', () => {
    cy.route({
      method: 'POST',
      url: 'https://bigquery.googleapis.com/bigquery/v2/projects/**/queries',
      status: 401,
      response: {
        message: 'Was not able to query',
        errorDetail: [],
      },
    }).as('getQueryResults');

    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults']);
    cy.contains('Error 401: Was not able to query').should('be.visible');
  });

  it('displays error toasts with no error detail', () => {
    cy.route({
      method: 'POST',
      url: 'https://bigquery.googleapis.com/bigquery/v2/projects/**/queries',
      status: 401,
      response: {
        message: 'Was not able to query',
      },
    }).as('getQueryResults');

    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults']);
    cy.contains('Error 401: Was not able to query').should('be.visible');
  });

  it('displays loading message', () => {
    cy.route({
      method: 'POST',
      url: 'https://bigquery.googleapis.com/bigquery/v2/projects/*/queries',
      status: 200,
      response: { jobComplete: false, jobReference: { jobId: 'jobId' } },
    }).as('getQueryResults');
    cy.route({
      method: 'GET',
      url: 'https://bigquery.googleapis.com/bigquery/v2/projects/*/queries/jobId',
      status: 200,
      response: { jobComplete: false, jobReference: { jobId: 'jobId' } },
    }).as('getQueryJobResults');

    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults', '@getQueryJobResults']);
    cy.contains(
      'For large datasets, it can take a few minutes to fetch results from BigQuery. Thank you for your patience.',
    ).should('be.visible');
  });
});
