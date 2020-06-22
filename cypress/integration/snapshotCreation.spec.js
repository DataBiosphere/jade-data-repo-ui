describe('test snapshot creation', () => {
  beforeEach(() => {
    cy.server();

    cy.route('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.route('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');
    cy.route({
      method: 'POST',
      url: '/api/repository/v1/snapshots',
      status: 200,
      response: {
        id: 'jello',
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/jobs/jello',
      status: 200,
      response: {
        completed: 'string',
        description: 'string',
        id: 'jello',
        job_status: 'succeeded',
        status_code: 0,
        submitted: 'string',
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/jobs/jello/result',
      status: 200,
      response: {
        name: 'jello_snapshot',
        description: 'hello jello',
        id: 'jello',
        createdDate: '',
        profileId: 'jello',
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/snapshots/jello',
      status: 200,
      response: {
        name: 'jello_snapshot',
        description: 'hello jello',
        id: 'jello',
        createdDate: '2017-04-14',
        profileId: 'jello',
        source: [{ name: 'jello' }],
        tables: [{ rowCount: 2 }],
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/snapshots/jello/policies',
      status: 200,
      response: {
        policies: [
          {
            name: 'reader',
            members: ['jelloworld@nox.com'],
          },
        ],
      },
    });

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
    cy.wait(['@getDataset', '@getDatasetPolicies']);
  });

  it('opens modal', () => {
    cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();
    cy.get('[data-cy=createSnapshot]').click();
    cy.get('[data-cy=textFieldName]').type('jello_snapshot');
    cy.get('[data-cy=selectAsset]').click();
    cy.get('[data-cy=menuItem-Variant]').click();
    cy.get('[data-cy=next]').click();
    cy.get('[data-cy=releaseDataset]').click();

    cy.get('[data-cy=snapshotName]').should('contain', 'jello_snapshot');
    cy.get('[data-cy=snapshotReaders]').should('contain', 'jelloworld@nox.com');
    cy.url().should('include', '/snapshots');
  });
});
