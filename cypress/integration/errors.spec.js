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

    cy.contains('See all Datasets').click();
    cy.contains('Date created').click();
    cy.contains('V2F_GWAS_Summary_Stats').should('be.visible');
    cy.contains('V2F_GWAS_Summary_Stats').click();
  });

  it('displays error toasts', () => {
    cy.route({
      method: 'POST',
      url: 'https://bigquery.googleapis.com/bigquery/v2/projects/**/queries',
      status: 401,
      response: {},
    }).as('getQueryResults');
    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults']);
    cy.contains('Error: Request failed with status code 401').should('be.visible');
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
    cy.wait(['@getDataset', '@getDatasetPolicies', '@getQueryResults', '@getQueryJobResults']);
    cy.contains(
      'For large datasets, it can take a few minutes to fetch results from BigQuery. Thank you for your patience.',
    ).should('be.visible');
  });
});
