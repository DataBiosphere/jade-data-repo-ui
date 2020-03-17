describe('test query builder functionality', () => {
  it('basic test', () => {
    cy.visit('/login/e2e');
    cy.get('#tokenInput', { timeout: 30000 }).type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();
    cy.contains('V2F_GWAS_Summary_Stats').should('be.visible');
    cy.contains('V2F_GWAS_Summary_Stats').click();
    cy.get('p')
      .contains('V2F_GWAS_Summary_Stats')
      .should('be.visible');
    cy.get('a')
      .contains('query dataset')
      .click();
  });
});
