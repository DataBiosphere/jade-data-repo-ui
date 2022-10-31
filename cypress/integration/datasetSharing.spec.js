describe('test dataset sharing', () => {
  beforeEach(() => {
    cy.server();
    cy.route('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.route('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');
    cy.route('GET', 'api/repository/v1/datasets/**/roles').as('getDatasetRoles');

    cy.route({ method: 'GET', url: 'api/resources/v1/profiles/**' }).as('getBillingProfileById');

    cy.visit('/login/e2e');
    cy.get('#tokenInput').type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();
  });

  it('has the manage users input when user is a steward', () => {
    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
    cy.get('[data-cy="roles-tab"]').click();
    cy.get('[data-cy="manageAccessContainer"]').should('be.visible');
  });

  it('does not have manage users buttons when the user is not a steward', () => {
    cy.get('[placeholder="Search keyword or description"]').type('NonStewardDataset');
    cy.contains(/NonStewardDataset/g).should('be.visible');
    cy.contains(/NonStewardDataset/g).click();
    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
    cy.get('[data-cy="roles-tab"]').click();
    cy.get('[data-cy="manageAccessContainer"]').should('not.exist');
  });
});
