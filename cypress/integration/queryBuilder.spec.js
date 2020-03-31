describe('test query builder', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/login/e2e');
    cy.get('#tokenInput', { timeout: 30000 }).type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();

    cy.route('GET', 'api/repository/v1/datasets/c9099f3a-1769-4a46-a777-9331fea0721c').as(
      'getDataset',
    );

    cy.route('GET', 'api/repository/v1/datasets/c9099f3a-1769-4a46-a777-9331fea0721c/policies').as(
      'getDatasetPolicies',
    );
  });

  it('does render', () => {
    cy.contains('V2F_GWAS_Summary_Stats')
      .should('be.visible')
      .click();
    cy.get('p')
      .contains('V2F_GWAS_Summary_Stats')
      .should('be.visible')
      .click();
    cy.get('a')
      .contains('query dataset')
      .click();
  });

  it.only('applies filters', () => {
    cy.contains('V2F_GWAS_Summary_Stats').should('be.visible');
    cy.contains('V2F_GWAS_Summary_Stats').click();
    cy.wait(['@getDataset', '@getDatasetPolicies']);
    cy.get('[data-cy=queryDatasetButton]').click();
    cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();
    cy.get('[data-cy=filterItem]')
      .contains('ancestry')
      .click();
    cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
    cy.get('[data-cy="applyFiltersButton"]').click();
    cy.get('[data-cy=appliedFilterList-ancestry_specific_meta_analysis]', {
      timeout: 60000,
    }).should('be.visible');
  });
});
