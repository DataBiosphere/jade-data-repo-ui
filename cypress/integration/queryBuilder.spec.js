describe('test query builder', () => {
  beforeEach(() => {
    cy.visit('/login/e2e');
    cy.get('#tokenInput', { timeout: 30000 }).type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();
  });

  it('does render', () => {
    cy.contains('V2F_GWAS_Summary_Stats').should('be.visible');
    cy.contains('V2F_GWAS_Summary_Stats').click();
    cy.get('p')
      .contains('V2F_GWAS_Summary_Stats')
      .should('be.visible');
    cy.get('a')
      .contains('query dataset')
      .click();
  });

  it('applies filters', () => {
    cy.contains('V2F_GWAS_Summary_Stats').should('be.visible');
    cy.contains('V2F_GWAS_Summary_Stats').click();
    cy.get('a > .MuiButtonBase-root > .MuiButton-label').click();
    cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();
    cy.get('[data-cy=filterItem]')
      .contains('ancestry')
      .click();
    cy.get(
      '.MuiCollapse-entered > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > label:nth-child(1) > span:nth-child(1) > span:nth-child(1) > input:nth-child(1)',
    ).click();
    cy.get('[data-cy="applyFiltersButton"]')
      .contains('Apply Filters')
      .click();
  });
});
