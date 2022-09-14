describe('test snapshot creation', () => {
  beforeEach(() => {
    cy.server();

    cy.route('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.route('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');
    cy.route({ method: 'GET', url: 'api/resources/v1/profiles/**' }).as('getBillingProfileById');
    cy.route({
      method: 'POST',
      url: '/api/repository/v1/snapshots',
      status: 200,
      response: {
        id: 'jobId',
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/jobs/jobId',
      status: 200,
      response: {
        id: 'jobId',
        job_status: 'succeeded',
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/jobs/jobId/result',
      status: 200,
      response: {
        name: 'mock_snapshot',
        description: '',
        id: 'snapshotId',
        createdDate: '2020-06-24',
        profileId: 'profileId',
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/snapshots/snapshotId**',
      status: 200,
      response: {
        name: 'mock_snapshot',
        description: '',
        id: 'snapshotId',
        createdDate: '2020-06-24',
        profileId: 'profileId',
        source: [{ name: 'dataset' }],
        tables: [{ rowCount: 2 }],
      },
    });
    cy.route({
      method: 'GET',
      url: '/api/repository/v1/snapshots/snapshotId/policies',
      status: 200,
      response: {
        policies: [
          {
            name: 'reader',
            members: ['email@gmail.com'],
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

    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click({ force: true });
    cy.get('a > .MuiButtonBase-root').click({ force: true });
    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
  });

  it('opens modal', () => {
    cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click({ force: true });
    cy.get('[data-cy=createSnapshot]').click({ force: true });
    cy.get('[data-cy=textFieldName]').type('mock_snapshot');
    cy.get('[data-cy=selectAsset]').click({ force: true });
    cy.get('[data-cy=menuItem-Variant]').click({ force: true });
    cy.get('[data-cy=next]').click({ force: true });
    cy.get('[data-cy=releaseDataset]').click({ force: true });

    cy.get('[data-cy=snapshotName]').should('contain', 'mock_snapshot');
    cy.get('[data-cy=snapshotReaders]').should('contain', 'email@gmail.com');
  });
});

describe('test snapshot creation is disabled', () => {
  beforeEach(() => {
    cy.server();

    cy.route('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.route('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');
    cy.route({
      method: 'GET',
      url: '/api/resources/v1/profiles/**',
      status: 401,
      response: {
        message: 'unauthorized',
      },
    });

    cy.visit('/login/e2e');
    cy.get('#tokenInput').type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();

    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click({ force: true });
    cy.get('a > .MuiButtonBase-root').click({ force: true });
    cy.wait(['@getDataset', '@getDatasetPolicies']);
  });

  it('opens modal', () => {
    cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();
    cy.get('[data-cy=createSnapshot]').should('be.disabled');
  });
});
