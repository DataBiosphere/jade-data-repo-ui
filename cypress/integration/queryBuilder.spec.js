describe('test query builder functionality', () => {
  it('basic test', () => {
    cy.visit(`http://localhost:3000/login/${process.env.GOOGLE_TOKEN}`);
    cy.contains('V2F_GWAS_Summary_Stats').click();
    cy.get('p')
      .contains('V2F_GWAS_Summary_Stats')
      .should('be.visible');
    cy.get('a')
      .contains('query dataset')
      .click();
  });
});
