import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { routerMiddleware } from 'connected-react-router';
import _ from 'lodash';
import history from '../../../modules/hist';
import globalTheme from '../../../modules/theme';
import SnapshotOverview from './SnapshotOverview';
import { initialUserState } from '../../../reducers/user';
import { initialQueryState } from '../../../reducers/query';
import { initialSnapshotState } from '../../../reducers/snapshot';
import { initialDuosState } from '../../../reducers/duos';
import { SnapshotIncludeOptions } from '../../../constants';

const mockSnapshot = {
  id: 'test-snapshot-id-123',
  name: 'Test Snapshot',
  description: 'A test snapshot for unit testing',
  createdDate: '2023-01-01T00:00:00Z',
  cloudPlatform: 'gcp',
  tables: [
    {
      name: 'test_table',
      columns: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
      ],
    },
  ],
  source: [
    {
      dataset: {
        id: 'source-dataset-id',
        name: 'Source Dataset',
      },
    },
  ],
};

const mockSnapshotPolicies = [
  {
    name: 'reader',
    members: ['test-user@example.com'],
  },
  {
    name: 'discoverer',
    members: ['discoverer@example.com'],
  },
];

const mockDuosDatasets = [
  {
    datasetId: 1,
    datasetName: 'Test DUOS Dataset 1',
    datasetIdentifier: 'DUOS-001',
  },
  {
    datasetId: 2,
    datasetName: 'Test DUOS Dataset 2',
    datasetIdentifier: 'DUOS-002',
  },
];

const mockUserRoles = ['reader'];

const mockStore = createMockStore([routerMiddleware(history)]);

const createInitialState = (overrides = {}) =>
  _.merge(
    {
      user: {
        ...initialUserState,
        isAuthenticated: true,
        email: 'test@example.com',
      },
      snapshots: {
        ...initialSnapshotState,
        snapshot: { ...mockSnapshot, id: 'test-snapshot-id-123' }, // Ensure ID matches
        snapshotByIdLoading: false,
        snapshotPolicies: mockSnapshotPolicies,
        userRoles: mockUserRoles,
        snapshotAuthDomains: ['test-auth-domain'],
        pendingSave: {
          consentCode: false,
          description: false,
          duosDataset: false,
        },
      },
      duos: {
        ...initialDuosState,
        datasets: mockDuosDatasets,
        loading: false,
      },
      query: initialQueryState,
      router: {
        location: {
          pathname: '/snapshots/test-snapshot-id-123',
          query: {},
        },
      },
    },
    overrides,
  );

const mountComponent = (snapshotId = 'test-snapshot-id-123', stateOverrides = {}) => {
  // Ensure the snapshot ID in state matches the route parameter
  const mergedOverrides = _.merge(
    {
      snapshots: {
        snapshot: { ...mockSnapshot, id: snapshotId },
      },
    },
    stateOverrides,
  );

  const initialState = createInitialState(mergedOverrides);
  const store = mockStore(initialState);

  // Spy on dispatch to verify action calls
  cy.spy(store, 'dispatch').as('dispatchSpy');

  // Mock route params
  const mockMatch = {
    params: { uuid: snapshotId },
    isExact: true,
    path: '/snapshots/:uuid',
    url: `/snapshots/${snapshotId}`,
  };

  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <SnapshotOverview match={mockMatch} history={history} location={history.location} />
        </ThemeProvider>
      </Router>
    </Provider>,
  );

  return store;
};

describe('SnapshotOverview Component', () => {
  describe('Component Mount and Initial Actions', () => {
    it('should mount successfully and dispatch required actions on load', () => {
      mountComponent();

      // Verify component renders
      cy.get('[data-testid="snapshot-overview"], h3').should('exist');

      // Verify all required actions are dispatched on mount
      cy.get('@dispatchSpy').should(
        'have.been.calledWith',
        Cypress.sinon.match({
          type: 'GET_SNAPSHOT_BY_ID',
          payload: Cypress.sinon.match({
            snapshotId: 'test-snapshot-id-123',
            include: [
              SnapshotIncludeOptions.SOURCES,
              SnapshotIncludeOptions.TABLES,
              SnapshotIncludeOptions.ACCESS_INFORMATION,
              SnapshotIncludeOptions.PROFILE,
              SnapshotIncludeOptions.DATA_PROJECT,
              SnapshotIncludeOptions.DUOS,
            ],
          }),
        }),
      );

      cy.get('@dispatchSpy').should(
        'have.been.calledWith',
        Cypress.sinon.match({
          type: 'GET_SNAPSHOT_POLICY',
          payload: 'test-snapshot-id-123',
        }),
      );

      cy.get('@dispatchSpy').should(
        'have.been.calledWith',
        Cypress.sinon.match({
          type: 'GET_USER_SNAPSHOT_ROLES',
          payload: 'test-snapshot-id-123',
        }),
      );

      cy.get('@dispatchSpy').should(
        'have.been.calledWith',
        Cypress.sinon.match({
          type: 'GET_DUOS_DATASETS',
        }),
      );
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when snapshot is loading', () => {
      mountComponent('test-snapshot-id-123', {
        snapshots: {
          snapshotByIdLoading: true,
          snapshot: {},
          snapshotPolicies: [],
        },
      });

      // Should show loading spinner
      cy.get('.MuiCircularProgress-root').should('exist');

      // Should not show main content when loading
      cy.contains(mockSnapshot.name).should('not.exist');
    });

    it('should not render content when snapshot policies are missing', () => {
      mountComponent('test-snapshot-id-123', {
        snapshots: {
          snapshotByIdLoading: false,
          snapshot: mockSnapshot,
          snapshotPolicies: null,
        },
      });

      // Should render empty box when conditions not met (no main content)
      cy.contains(mockSnapshot.name).should('not.exist');
    });

    it('should not render content when snapshot is missing', () => {
      mountComponent('test-snapshot-id-123', {
        snapshots: {
          snapshotByIdLoading: false,
          snapshot: null,
          snapshotPolicies: mockSnapshotPolicies,
        },
      });

      // Should render empty box when conditions not met (no main content)
      cy.contains(mockSnapshot.name).should('not.exist');
    });

    it('should not render content when snapshot tables are missing', () => {
      mountComponent('test-snapshot-id-123', {
        snapshots: {
          snapshotByIdLoading: false,
          snapshot: { ...mockSnapshot, tables: null },
          snapshotPolicies: mockSnapshotPolicies,
        },
      });

      // Should render empty box when conditions not met (no main content)
      cy.contains(mockSnapshot.name).should('not.exist');
    });

    it('should not render content when snapshot ID does not match route param', () => {
      mountComponent('different-snapshot-id', {
        snapshots: {
          snapshotByIdLoading: false,
          snapshot: mockSnapshot, // has id: 'test-snapshot-id-123'
          snapshotPolicies: mockSnapshotPolicies,
        },
      });

      // Should render empty box when IDs don't match (no main content)
      cy.contains(mockSnapshot.name).should('not.exist');
    });
  });

  describe('Content Display', () => {
    it('should display snapshot information when all conditions are met', () => {
      mountComponent();
      // Should display snapshot name as title
      cy.get('h3').should('contain.text', mockSnapshot.name);
    });
  });

  describe('State Integration', () => {
    it('should integrate with DUOS datasets state correctly', () => {
      const customDuosState = {
        duos: {
          datasets: [
            {
              datasetId: 999,
              datasetName: 'Custom DUOS Dataset',
              datasetIdentifier: 'CUSTOM-001',
            },
          ],
          loading: true,
        },
      };

      mountComponent('test-snapshot-id-123', customDuosState);

      // Component should handle different DUOS states without errors
      cy.contains(mockSnapshot.name).should('exist');
    });

    it('should handle pending save states correctly', () => {
      const pendingSaveState = {
        snapshots: {
          pendingSave: {
            consentCode: true,
            description: true,
            duosDataset: false,
          },
        },
      };

      mountComponent('test-snapshot-id-123', pendingSaveState);

      // Component should render with pending save states
      cy.contains(mockSnapshot.name).should('exist');
    });

    it('should handle empty user roles correctly', () => {
      const stewardRoleState = {
        snapshots: {
          userRoles: [],
        },
      };

      mountComponent('test-snapshot-id-123', stewardRoleState);

      // Component should render with different user roles
      cy.contains(mockSnapshot.name).should('exist');
    });

    it('should handle empty snapshot policies correctly', () => {
      const emptyPoliciesState = {
        snapshots: {
          snapshotPolicies: [],
        },
      };

      mountComponent('test-snapshot-id-123', emptyPoliciesState);

      // Component should render main content even with empty policies array ([] is truthy)
      cy.contains(mockSnapshot.name).should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle snapshot without source dataset gracefully', () => {
      const snapshotWithoutSource = {
        ...mockSnapshot,
        source: [],
      };

      mountComponent('test-snapshot-id-123', {
        snapshots: {
          snapshot: snapshotWithoutSource,
        },
      });

      // Should still render the main structure
      cy.contains(mockSnapshot.name).should('exist');
    });

    it('should handle missing snapshot data gracefully', () => {
      const incompleteSnapshot = {
        id: 'test-snapshot-id-123',
        name: 'Incomplete Snapshot',
        tables: [], // Empty tables but still an array
        // Missing other properties
      };

      mountComponent('test-snapshot-id-123', {
        snapshots: {
          snapshot: incompleteSnapshot,
          snapshotPolicies: mockSnapshotPolicies,
        },
      });

      // Should handle missing data without crashing and render something
      cy.get('body').should('exist');
      cy.contains(incompleteSnapshot.name).should('exist');
    });
  });
});
