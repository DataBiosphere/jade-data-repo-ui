describe('test query builder', () => {
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

    cy.contains('V2F_GWAS_Summary_Stats').should('be.visible');
    cy.contains('V2F_GWAS_Summary_Stats').click();
    cy.wait(['@getDataset', '@getDatasetPolicies']);
    cy.get('[data-cy=queryDatasetButton]').click();
  });

  it('does render', () => {});

  it('applies filters', () => {
    // selects the filter button in the sidebar
    cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();
    cy.get('[data-cy=filterItem]')
      .contains('ancestry')
      .click();
    cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
    cy.get('[data-cy="applyFiltersButton"]').click();
    cy.get('[data-cy=appliedFilterList-ancestry_specific_meta_analysis]', {}).should('be.visible');
  });

  it.only('adds/removes readers', () => {
    // selects the share button in the sidebar
    cy.get('div.MuiButtonBase-root:nth-child(3) > svg:nth-child(1)').click();
    cy.get('[data-cy=enterEmailBox]').type('mkerwin.dev@gmail.com');
    cy.get('[data-cy=inviteButton]').click();
    cy.get('[data-cy=readers]')
      .contains('mkerwin.dev@gmail.com')
      .should('be.visible');

    cy.get('[data-cy=moreButton]').click();
    cy.get('[data-cy=removeItem]').click();
    cy.get('[data-cy=readers]').should('not.contain', 'mkerwin.dev@gmail.com');
  });
});
