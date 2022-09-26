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

  it('has the manage users buttons when user is a steward', () => {
    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click();
    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
    cy.get('#simple-tabs-3').contains('Roles & memberships');
    cy.get('#simple-tabs-3').click();
    cy.get('.MuiGrid-root :nth-child(2) .MuiAccordionSummary-root').click();
    cy.get('.MuiAccordionDetails-root button')
      .should('be.visible')
      .should('contain.text', 'Manage Stewards')
      .click();

    cy.get('#customized-dialog-title')
      .should('be.visible')
      .should('contain.text', 'Manage Stewards');

    // cy.get('.MuiAccordionDetails-root :nth-child(2) > > :nth-child(3) > button')
    //   .should('be.visible')
    //   .should('contain.text', 'Manage Custodians');
    // cy.get('.MuiAccordionDetails-root :nth-child(3) > > :nth-child(3) > button')
    //   .should('be.visible')
    //   .should('contain.text', 'Manage Snapshot Creators');
  });

  it('does not have manage users buttons when the user is not a steward', () => {
    cy.get('[placeholder="Search keyword or description"]').type('NonStewardDataset');
    cy.contains(/NonStewardDataset/g).should('be.visible');
    cy.contains(/NonStewardDataset/g).click();
    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);

    cy.get('.MuiList-root > :nth-child(1)').click();
    cy.get('#memberships-header').click();
    cy.get('.MuiAccordionDetails-root :nth-child(2) > > :nth-child(3) > button').should(
      'not.exist',
    );
  });
});
