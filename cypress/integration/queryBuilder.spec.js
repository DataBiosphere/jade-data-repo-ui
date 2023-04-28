describe('test query builder', () => {
  beforeEach(() => {
    cy.server();

    cy.route('GET', 'api/repository/v1/datasets/**').as('getDataset');
    cy.route('GET', 'api/repository/v1/datasets/**/policies').as('getDatasetPolicies');
    cy.route('GET', 'api/resources/v1/profiles/**').as('getBillingProfileById');

    cy.visit('/login/e2e');
    cy.get('#tokenInput').type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();

    cy.get('[placeholder="Search keyword or description"]').type('V2F_GWAS');
    cy.contains('Date created').click();
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).should('be.visible');
    cy.contains(/V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics/g).click();
    cy.get('a > .MuiButtonBase-root').click();

    cy.wait(['@getDataset', '@getDatasetPolicies', '@getBillingProfileById']);
  });

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  it('does render', () => {});

  describe('arrays work as expected', () => {
    beforeEach(() => {
      cy.get('[data-cy=selectTable]').click();
      cy.get('[data-cy=menuItem-feature_consequence]').click();
    });

    it('does show array values', () => {
      // Click the header to make sure we don't sort or trigger an error
      cy.get('[data-cy=columnHeader-consequence_terms]').scrollIntoView().click({ force: true });

      for (let i = 0; i < 100; i++) {
        cy.get(`[data-cy=cellValue-consequence_terms-${i}]`).should(
          'have.text',
          'regulatory_region_variant(1 item)',
        );
      }
    });
  });

  describe('timestamps are displayed as expected', () => {
    beforeEach(() => {
      cy.get('[data-cy=selectTable]').click();
      cy.get('[data-cy=menuItem-all_data_types]').click();
    });

    it('correctly displays timestamps', () => {
      // Click the header to make sure we don't sort or trigger an error
      cy.get('[data-cy=columnHeader-timestamp_column]').scrollIntoView().click({ force: true });

      cy.get('[data-cy=cellValue-timestamp_column-0]').should('have.text', '5/31/2023, 9:02:40 PM');

      cy.get('[data-cy=columnHeader-timestamp_array_column]')
        .scrollIntoView()
        .click({ force: true });

      cy.get('[data-cy=cellValue-timestamp_array_column-0]').should(
        'have.text',
        '6/1/2023, 9:04:40 PM(1 item)',
      );
    });
  });

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
        cy.get('[data-cy=createSnapshot]').click({ force: true });

        cy.window()
          .its('store')
          .invoke('getState')
          .its('snapshots')
          .its('snapshotRequest')
          .its('filterStatement')
          .should('contain', 'ancestry_specific_meta_analysis.ancestry IN ("EU")');
      });
    });

    it('clears filters', () => {
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
      cy.get('[data-cy="filter-ancestry-button"]').click();

      cy.contains('Clear all').should('be.visible');
      cy.contains('Clear all').click();

      //  TODO this get is flakey---needs to be fixed in a follow on pr
      //  cy.get('[data-cy="snapshotCard"]').should('not.contain', 'ancestry_specific_meta_analysis');
      cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');
    });

    it('excludes values', () => {
      // filter down to only one page of results
      cy.get('[data-cy=categoryFilterCheckbox-HS]').click();
      cy.get('[data-cy="filter-ancestry-button"]').click();

      // table should contain these 3 variants to start
      cy.get('[data-cy=tableBody]').contains('14:95235028:C:A').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('6:41533593:G:A').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('1:161128013:G:A').should('be.visible');

      // type variant ids into filter box
      cy.get('[data-cy=filterItem]').contains('variant_id').click();
      cy.get('#autocomplete-variant_id').type('14:95235028:C:A\n6:41533593:G:A\n1:161128013:G:A\n');

      // click 'exclude this selection' and apply filter
      cy.get('[data-cy="exclude-variant_id"]').should('be.visible');
      cy.get('[data-cy="exclude-variant_id"]').click();
      cy.get('[data-cy="filter-variant_id-button"]').click();

      // variants should not be returned in query results
      cy.get('[data-cy=tableBody]').should('not.contain', '14:95235028:C:A');
      cy.get('[data-cy=tableBody]').should('not.contain', '6:41533593:G:A');
      cy.get('[data-cy=tableBody]').should('not.contain', '1:161128013:G:A');

      // uncheck 'exclude this selection' and apply filter
      cy.get('[data-cy="exclude-variant_id"] .MuiCheckbox-root').should(
        'have.class',
        'Mui-checked',
      );
      cy.get('[data-cy="exclude-variant_id"]').click();
      cy.get('[data-cy="filter-variant_id-button"]').click();

      // variants should be included in query results
      cy.get('[data-cy=tableBody]').contains('14:95235028:C:A').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('6:41533593:G:A').should('be.visible');
      cy.get('[data-cy=tableBody]').contains('1:161128013:G:A').should('be.visible');
      cy.get('[data-cy="exclude-variant_id"] .MuiCheckbox-root').should(
        'not.have.class',
        'Mui-checked',
      );
    });
  });

  describe('filtering on null checkbox value', () => {
    it('filters on null', () => {
      // Switch to variant table
      cy.get('[data-cy=selectTable]').click();
      cy.get('[data-cy=menuItem-variant]').click();

      // selects the filter button in the sidebar
      cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();
      // first, let's filter down to a reasonble number of entries
      // type variant ids into filter box
      cy.get('[data-cy=filterItem]').contains('id').click();
      cy.get('#autocomplete-id').type('1:65196986:A:G\n1:231395857:A:G\n');
      cy.get('[data-cy="filter-id-button"]').click();

      // select the "reference" field
      cy.get('[data-cy=filterItem]').contains('reference').click();

      // select the "null" checkbox
      cy.get('[data-cy=categoryFilterCheckbox-null]').click();

      // Apply filtering
      cy.get('[data-cy="filter-reference-button"]').click();

      // null row should be visible, but non-null row should be hidden
      cy.get('[data-cy=tableBody]').should('contain', '1:65196986:A:G');
      cy.get('[data-cy=tableBody]').should('not.contain', '1:231395857:A:G');

      // Go back and select other checkbox for reference field: "A"
      cy.get('[data-cy=categoryFilterCheckbox-A]').click();
      // apply new filtering
      cy.get('[data-cy="filter-reference-button"]').click();

      // now both the null row and the row associated with "A" should be visible
      cy.get('[data-cy=tableBody]').should('contain', '1:65196986:A:G');
      cy.get('[data-cy=tableBody]').should('contain', '1:231395857:A:G');
    });
  });

  describe('test wizard flow', () => {
    it('transitions to share panel', () => {
      // open filter panel
      cy.get('div.MuiButtonBase-root:nth-child(2) > svg:nth-child(1)').click();

      // create snapshot button should open 'Add details' panel
      cy.get('[data-cy=createSnapshot]').click({ force: true });
      // TODO: figure out why cypress gets mad about this
      // cy.contains('Add Details').should('be.visible');
      cy.get('[data-cy=next]').should('be.disabled');

      // enter snapshot name
      cy.get('[data-cy=textFieldName]').type('mySnapshot');
      cy.get('[data-cy=next]').should('be.disabled');

      // select asset
      cy.get('[data-cy=selectAsset]').click();
      cy.get('[data-cy=menuItem-Variant]').click();
      cy.get('[data-cy=next]').should('not.be.disabled');

      // 'next' button should bring user to share panel
      cy.get('[data-cy=next]').click();
      cy.contains('Share Snapshot').should('be.visible');
      cy.window()
        .its('store')
        .invoke('getState')
        .its('snapshots')
        .its('snapshotRequest')
        .its('joinStatement')
        .should('match', /FROM (V2F_GWAS_Summary_Stats|V2F_GWAS_Summary_Statistics).variant /);
    });
  });
});
