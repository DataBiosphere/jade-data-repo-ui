import _ from 'lodash';
import createMockStore from 'redux-mock-store';
import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import React from 'react';
import globalTheme from '../../../../../modules/theme';
import history from '../../../../../modules/hist';
import { FilterPanel } from './FilterPanel';

const createTestStore = (stateOverrides = {}) => {
  const mockStore = createMockStore([]);
  const initialState = {
    datasets: {
      dataset: {
        id: 'test-dataset-id',
        schema: {
          assets: [{ name: 'test-asset' }],
        },
      },
    },
    profiles: {
      profiles: [
        {
          id: 'profile-1',
          billingAccountId: 'billing-1',
        },
      ],
    },
    snapshots: {
      snapshotRequest: {
        filterStatement: '',
        joinStatement: '',
      },
    },
    user: {
      groups: [],
      delegateToken: 'test-token',
    },
    query: {
      columns: [
        {
          name: 'ancestry',
          dataType: 'string',
          isExpanded: true,
          originalValues: [
            { value: 'EU', count: 100 },
            { value: 'AS', count: 50 },
            { value: 'AF', count: 25 },
          ],
          values: [
            { value: 'EU', count: 100 },
            { value: 'AS', count: 50 },
            { value: 'AF', count: 25 },
          ],
        },
        {
          name: 'variant_id',
          dataType: 'string',
          isExpanded: false,
          originalValues: null,
          values: null,
        },
      ],
      filterData: {},
      resultsCount: 175,
      polling: false,
      queryParams: {
        totalRows: 175,
      },
    },
  };

  // Deep merge the state overrides
  return mockStore(_.merge({}, initialState, stateOverrides));
};

describe('FilterPanel', () => {
  beforeEach(() => {
    const mockStore = createMockStore([]);
    const store = mockStore({
      datasets: {},
      profiles: {
        profiles: [],
      },
      snapshots: {},
      user: {
        groups: [],
      },
      query: {
        columns: [],
        filterData: {},
        resultsCount: 0,
      },
    });

    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <FilterPanel dispatch={() => {}} classes={{}} columns={[]} dataset={{ schema: {} }} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });

  it('shows the button "Create Full View Snapshot" appears on the FilterPanel', () => {
    cy.contains('Create Full View Snapshot').should('be.visible');
  });
});

describe('FilterPanel Component Tests', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
    cy.spy(store, 'dispatch').as('dispatchSpy');
  });

  const mountFilterPanel = (storeOverrides = {}, componentProps = {}) => {
    const testStore = createTestStore(storeOverrides);
    const defaultProps = {
      open: true,
      canLink: true,
      selected: 'test-table',
      table: { name: 'ancestry_specific_meta_analysis' },
      handleCreateSnapshot: cy.stub().as('handleCreateSnapshot'),
      dispatch: cy.stub().as('dispatchSpy'),
      classes: {},
      columns: [
        {
          name: 'ancestry',
          dataType: 'string',
          isExpanded: true,
          originalValues: [
            { value: 'EU', count: 100 },
            { value: 'AS', count: 50 },
            { value: 'AF', count: 25 },
          ],
          values: [
            { value: 'EU', count: 100 },
            { value: 'AS', count: 50 },
            { value: 'AF', count: 25 },
          ],
        },
        {
          name: 'variant_id',
          dataType: 'string',
          isExpanded: false,
          originalValues: null,
          values: null,
        },
      ],
      dataset: {
        id: 'test-dataset-id',
        schema: {
          assets: [{ name: 'test-asset' }],
        },
      },
      datasetRowCount: 175,
      filterData: {},
      polling: false,
      token: 'test-token',
      ...componentProps,
    };

    mount(
      <Router history={history}>
        <Provider store={testStore}>
          <ThemeProvider theme={globalTheme}>
            <FilterPanel {...defaultProps} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  };

  describe('Filter Values Rendering', () => {
    it('renders array of filter values for selection', () => {
      mountFilterPanel();

      // Verify that the ancestry filter item is visible
      cy.get('[data-cy=filterItem]').should('contain', 'ancestry');

      // Click to expand the ancestry filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();

      // Verify that the filter values are rendered as checkboxes
      cy.get('[data-cy=categoryFilterCheckbox-EU]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-AS]').should('exist');
      cy.get('[data-cy=categoryFilterCheckbox-AF]').should('exist');

      // Verify that the labels include the count information
      cy.contains('EU (100)').should('be.visible');
      cy.contains('AS (50)').should('be.visible');
      cy.contains('AF (25)').should('be.visible');
    });

    it('shows multiple filter columns available for selection', () => {
      mountFilterPanel();

      // Verify multiple filter columns are rendered
      cy.get('[data-cy=filterItem]').should('have.length', 2);
      cy.get('[data-cy=filterItem]').first().should('contain', 'ancestry');
      cy.get('[data-cy=filterItem]').last().should('contain', 'variant_id');
    });

    it('displays filter counts correctly in the UI', () => {
      mountFilterPanel();

      // Expand the ancestry filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();

      // Verify count display formats
      cy.get('[data-cy=categoryFilterCheckbox-EU]').parent().should('contain', 'EU (100)');

      cy.get('[data-cy=categoryFilterCheckbox-AS]').parent().should('contain', 'AS (50)');
    });
  });

  describe('Filter Selection and Application', () => {
    it('enables apply button when filter is selected', () => {
      mountFilterPanel();

      // Expand the ancestry filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();

      // Initially, the apply button should be disabled
      cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');

      // Select a filter value
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();

      // Now the apply button should be enabled
      cy.get('[data-cy="filter-ancestry-button"]').should('not.be.disabled');
    });

    it('dispatches applyFilters action when filter is applied', () => {
      mountFilterPanel();

      // Expand the ancestry filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();

      // Select EU filter
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();

      // Apply the filter
      cy.get('[data-cy="filter-ancestry-button"]').click();

      // Verify that the dispatch was called with applyFilters action
      cy.get('@dispatchSpy').should('have.been.called');
      cy.get('@dispatchSpy').should(
        'have.been.calledWith',
        Cypress.sinon.match({
          type: 'APPLY_FILTERS',
          payload: Cypress.sinon.match({
            filters: Cypress.sinon.match.object,
            table: 'ancestry_specific_meta_analysis',
          }),
        }),
      );
    });

    it('allows multiple filter values to be selected', () => {
      mountFilterPanel();

      // Expand the ancestry filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();

      // Select multiple filter values
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
      cy.get('[data-cy=categoryFilterCheckbox-AS]').click();

      // Verify both are checked
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');
      cy.get('[data-cy=categoryFilterCheckbox-AS] input').should('be.checked');

      // Apply button should be enabled
      cy.get('[data-cy="filter-ancestry-button"]').should('not.be.disabled');
    });

    it('can deselect filter values', () => {
      mountFilterPanel();

      // Expand the ancestry filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();

      // Select and then deselect a filter value
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');

      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('not.be.checked');

      // Apply button should be disabled when no filters are selected
      cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');
    });
  });

  describe('Query State Management', () => {
    it('clears filter selections when clear functionality is used', () => {
      mountFilterPanel();

      // Expand the ancestry filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();

      // Select a filter value
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('be.checked');

      // Apply button should be enabled
      cy.get('[data-cy="filter-ancestry-button"]').should('not.be.disabled');

      // Deselect the filter (this tests the clear functionality)
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();
      cy.get('[data-cy=categoryFilterCheckbox-EU] input').should('not.be.checked');

      // Apply button should now be disabled
      cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');
    });

    it('handles filter state updates correctly when filters change', () => {
      // Start with no filters applied using the helper function
      mountFilterPanel({
        query: {
          filterData: {},
        },
      });

      // Initially, no filters should be applied (button should be disabled)
      cy.get('[data-cy="filter-ancestry-button"]').should('be.disabled');

      // Apply a filter
      cy.get('[data-cy=filterItem]').contains('ancestry').click();
      cy.get('[data-cy=categoryFilterCheckbox-EU]').click();

      // Apply button should now be enabled
      cy.get('[data-cy="filter-ancestry-button"]').should('not.be.disabled');

      // Apply the filter
      cy.get('[data-cy="filter-ancestry-button"]').click();

      // Verify the action was dispatched with correct structure
      cy.get('@dispatchSpy').should(
        'have.been.calledWith',
        Cypress.sinon.match({
          type: 'APPLY_FILTERS',
          payload: Cypress.sinon.match({
            filters: Cypress.sinon.match.object,
            table: 'ancestry_specific_meta_analysis',
          }),
        }),
      );
    });
  });

  describe('Integration with Snapshot Creation', () => {
    it('triggers snapshot creation workflow when Next button is clicked', () => {
      mountFilterPanel();

      // Click the create snapshot button
      cy.get('[data-cy=createSnapshot]').should('be.visible');
      cy.get('[data-cy=createSnapshot]').click();

      // Verify the handleCreateSnapshot callback was called
      cy.get('@handleCreateSnapshot').should('have.been.calledWith', true);
    });

    it('disables snapshot creation when no billing profiles are available', () => {
      // Mount with no billing profiles using the helper function
      mountFilterPanel(
        {
          profiles: { profiles: [] },
        },
        {
          canLink: false,
        },
      );

      // Verify the create snapshot button is disabled
      cy.get('[data-cy=createSnapshot]').should('be.disabled');
    });
  });
});
