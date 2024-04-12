const newUser = 'voldemort.admin@test.firecloud.org';
describe('test dataset sharing', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.intercept('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');
    cy.intercept('GET', 'api/repository/v1/datasets/**/roles').as('getDatasetRoles');
    cy.intercept({ method: 'GET', url: 'api/resources/v1/profiles/**' }).as(
      'getBillingProfileById',
    );

    cy.visit('/login/e2e');
    cy.get('#tokenInput').type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();
  });

  it('does not have manage users buttons when the user is not a steward', () => {
    cy.get('[placeholder="Search keyword or description"]').type('NonStewardDataset');
    cy.contains(/NonStewardDataset/g).should('be.visible');
    cy.contains(/NonStewardDataset/g).click();
    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
    cy.get('[data-cy="roles-tab"]').should('not.exist');
  });
  it('A steward can add and remove a user to a dataset', () => {
    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click({ force: true });

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
    cy.get('[data-cy="roles-tab"]').click();
    // Add user as a custodian on the dataset
    cy.get('[data-cy="enterEmailBox"]').type(newUser);
    cy.get('[data-cy="roleSelect"]').click();
    cy.get('[data-cy="roleOption-custodian"]').click();
    cy.get('[data-cy="inviteButton"]').click();
    // Confirm the user was added
    cy.get('[data-cy="user-list-Custodians"]').click();
    cy.get(`[data-cy="chip-${newUser}"]`).should('be.visible');

    // Now, let's remove this user
    cy.get(`[data-cy="chip-${newUser}"]`).find('[data-testid="CancelIcon"]').click();
    cy.get(`[data-cy="chip-${newUser}"]`).should('not.exist');
  });
});
