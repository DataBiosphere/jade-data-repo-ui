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

    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
  });

  it('has the manage users buttons', () => {
    cy.get('.MuiList-root > :nth-child(1)').click();
    cy.get('#memberships-header').click();
    cy.get('.MuiAccordionDetails-root :nth-child(2) div:nth-child(1)').should('be.visible');
    cy.get(':nth-child(2) > :nth-child(3) > button')
      .should('be.visible')
      .should('contain.text', 'Manage Stewards')
      .click();

    cy.get('#customized-dialog-title')
      .should('be.visible')
      .should('contain.text', 'Manage Stewards');

    cy.get(
      '.MuiTypography-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root',
    ).click();

    cy.get('#customized-dialog-title').should('not.be.visible');

    cy.get(':nth-child(3) > :nth-child(3) > button')
      .should('be.visible')
      .should('contain.text', 'Manage Custodians');
    cy.get(':nth-child(4) > :nth-child(3) > button')
      .should('be.visible')
      .should('contain.text', 'Manage Snapshot Creators');
  });
});
