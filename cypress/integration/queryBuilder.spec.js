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

    cy.contains('See all Datasets').click();
    cy.contains('Date created').click();
    cy.contains('V2F_GWAS_Summary_Stats').should('be.visible');
    cy.contains('V2F_GWAS_Summary_Stats').click();
    cy.wait(['@getDataset', '@getDatasetPolicies']);
  });

  it('does render', () => {});

  describe('test filter panel', () => {
    beforeEach(() => {
      // selects the filter button in the sidebar
      cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();
      cy.get('[data-cy=filterItem]').contains('ancestry').click();
    });

    describe('test apply filters', () => {
      // sets up filtering
      beforeEach(() => {
        cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');

        cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
        cy.get('[data-cy="filter-ancestry-button"]').should('not.be.disabled');

        cy.get('[data-cy="filter-ancestry-button"]').click();

        cy.get('[data-cy=appliedFilterList-ancestry_specific_meta_analysis]').should('be.visible');
      });

      it('applies filters', () => {
        cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');
      });

      it('creates snapshot query', () => {
        cy.get('[data-cy=createSnapshot]').click();

        cy.window()
          .its('store')
          .invoke('getState')
          .its('snapshots')
          .its('joinStatement')
          .should(
            'equal',
            'FROM V2F_GWAS_Summary_Stats.variant, V2F_GWAS_Summary_Stats.ancestry_specific_meta_analysis ',
          );
        cy.window()
          .its('store')
          .invoke('getState')
          .its('snapshots')
          .its('filterStatement')
          .should(
            'equal',
            'WHERE V2F_GWAS_Summary_Stats.ancestry_specific_meta_analysis.ancestry IN ("EU")',
          );
      });
    });

    it('clears filters', () => {
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
      cy.get('[data-cy="filter-ancestry-button"]').click();

      cy.contains('Clear all').should('be.visible');
      cy.contains('Clear all').click();

      cy.get('[data-cy="snapshotCard"]').should('not.contain', 'ancestry_specific_meta_analysis');
      cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');
    });

    it('excludes values', () => {
      // table should contain these 3 variants to start
      cy.get('[data-cy=tableBody]').contains('3:187442750:G:A').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('2:27558797:C:T').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('6:89977475:T:C').should('be.visible');

      // type variant ids into filter box
      cy.get('[data-cy=filterItem]').contains('variant_id').click();
      cy.get('#autocomplete-variant_id').type('3:187442750:G:A\n2:27558797:C:T\n6:89977475:T:C\n');

      // click 'exclude this selection' and apply filter
      cy.get('[data-cy="exclude-variant_id"]').should('be.visible');
      cy.get('[data-cy="exclude-variant_id"]').click();
      cy.get('[data-cy="filter-variant_id-button"]').click();

      // variants should not be returned in query results
      cy.get('[data-cy=tableBody]').should('not.contain', '3:187442750:G:A');
      cy.get('[data-cy=tableBody]').should('not.contain', '2:27558797:C:T');
      cy.get('[data-cy=tableBody]').should('not.contain', '6:89977475:T:C');

      // uncheck 'exclude this selection' and apply filter
      cy.get('[data-cy="exclude-variant_id"] .MuiCheckbox-root').should(
        'have.class',
        'Mui-checked',
      );
      cy.get('[data-cy="exclude-variant_id"]').click();
      cy.get('[data-cy="filter-variant_id-button"]').click();

      // variants should be included in query results
      cy.get('[data-cy=tableBody]').contains('3:187442750:G:A').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('2:27558797:C:T').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('6:89977475:T:C').should('be.visible');
      cy.get('[data-cy="exclude-variant_id"] .MuiCheckbox-root').should(
        'not.have.class',
        'Mui-checked',
      );
    });
  });

  describe('test share panel', () => {
    beforeEach(() => {
      // selects the share button in the sidebar
      cy.get('div.MuiButtonBase-root:nth-child(3) > svg:nth-child(1)').click();
    });

    it('adds/removes readers', () => {
      cy.get('[data-cy=enterEmailBox]').type(
        'mkerwin@broadinstitute.org,myessail@broadinstitute.org',
      );
      cy.get('[data-cy=inviteButton]').click();
      cy.get('[data-cy=readers]').contains('mkerwin@broadinstitute.org').should('be.visible');
      cy.get('[data-cy=readers]').contains('myessail@broadinstitute.org').should('be.visible');

      cy.get('[data-cy=specificReader]').contains('mkerwin@broadinstitute.org').siblings().click();
      cy.get('[data-cy=removeItem]').click();

      cy.get('[data-cy=readers]').should('not.contain', 'mkerwin@broadinstitute.org');
      cy.get('[data-cy=readers]').contains('myessail@broadinstitute.org').should('be.visible');
    });

    it('checks invalid email addresses', () => {
      cy.get('[data-cy=enterEmailBox]').type('maggenzi,myessail@broadinstitute.org');
      cy.get('[data-cy=inviteButton]').click();

      cy.get('[data-cy=readers]').contains('myessail@broadinstitute.org').should('be.visible');
      cy.get('[data-cy=invalidEmailError]').contains('maggenzi').should('be.visible');
    });

    it('removes space characters', () => {
      cy.get('[data-cy=enterEmailBox]').type(' ');
      cy.get('[data-cy=inviteButton]').click();
      cy.get('[data-cy=readers]').should('not.contain', ' ');

      cy.get('[data-cy=enterEmailBox]').type(' ,');
      cy.get('[data-cy=inviteButton]').click();
      cy.get('[data-cy=readers]').should('not.contain', ' ');

      cy.get('[data-cy=enterEmailBox]').type('mac@gmail.com, ken@gmail.com , zie@gmail.com');
      cy.get('[data-cy=inviteButton]').click();
      cy.get('[data-cy=readers]').should('not.contain', ' ken@gmail.com ');
      cy.get('[data-cy=readers]').should('not.contain', ' zie@gmail.com');
    });
  });
});
