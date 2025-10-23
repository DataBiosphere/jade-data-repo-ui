import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { routerMiddleware } from 'connected-react-router';
import history from '../modules/hist';
import globalTheme from '../modules/theme';
import DatasetView from './DatasetView';
import { initialUserState } from '../reducers/user';
import { initialQueryState } from '../reducers/query';

const mockDatasets = [
  {
    id: 'dataset-1',
    name: 'NonStewardDataset',
    description: 'A dataset where user is not a steward',
    cloudPlatform: 'gcp',
    createdDate: '2023-01-01',
  },
  {
    id: 'dataset-2',
    name: 'V2F_GWAS_Summary_Statistics',
    description: 'A dataset where user is a steward',
    cloudPlatform: 'gcp',
    createdDate: '2023-01-02',
  },
];

const mockStore = createMockStore([routerMiddleware(history)]);

const setUp = (searchString: string, loading = false, datasets = mockDatasets) => {
  const initialState = {
    datasets: {
      datasets,
      datasetsCount: datasets.length,
      filteredDatasetsCount: datasets.length,
      loading,
      datasetRoleMaps: {
        'dataset-1': [], // Non-steward
        'dataset-2': ['steward'], // Steward
      },
      refreshCnt: 0,
    },
    user: {
      ...initialUserState,
      isAuthenticated: true,
      email: 'test@example.com',
    },
    query: initialQueryState,
    router: {
      location: {
        pathname: '/datasets',
        query: {},
      },
    },
  };

  // Spy on the store dispatch to verify correct actions are called
  const store = mockStore(initialState);
  cy.spy(store, 'dispatch').as('dispatchSpy');
  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <DatasetView searchString={searchString} />
        </ThemeProvider>
      </Router>
    </Provider>,
  );
};

describe('DatasetView Component', () => {
  describe('Dataset Listing and Search', () => {
    it('should render DatasetTable with correct props', () => {
      setUp('');
      // Verify that DatasetView renders the DatasetTable component
      cy.get('table').should('exist');

      // Check that datasets are displayed
      cy.contains('NonStewardDataset').should('be.visible');
      cy.contains('V2F_GWAS_Summary_Statistics').should('be.visible');
    });

    it('should handle search functionality through DatasetTable', () => {
      setUp('V2F_GWAS');

      // The DatasetTable should handle the search string
      cy.get('table').should('exist');

      cy.get('@dispatchSpy').should(
        'have.been.calledWith',
        Cypress.sinon.match({
          type: 'GET_DATASETS',
          payload: Cypress.sinon.match({
            searchString: 'V2F_GWAS',
          }),
        }),
      );
    });
  });

  describe('Dataset Loading States', () => {
    it('should handle loading state', () => {
      setUp('', true); // Set loading to true
      // Should still render the component structure
      cy.get('table').should('exist');

      // Verify loading spinner is visible
      cy.get('.MuiCircularProgress-root').should('exist');
    });

    it('should handle empty dataset state', () => {
      setUp('', false, []);
      // Should render empty table
      cy.get('table').should('exist');
    });
  });
});
