import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { routerMiddleware } from 'connected-react-router';
import history from 'modules/hist';
import globalTheme from 'modules/theme';
import { initialSnapshotState } from 'reducers/snapshot';
import { SnapshotRequestContentsModelModeEnum } from 'generated/tdr';
import CreateSnapshotPanel from './CreateSnapshotPanel';

const mockDataset = {
  id: 'dataset-1',
  name: 'Test Dataset',
  defaultProfileId: 'profile-1',
  schema: {
    assets: [
      { name: 'asset1', rootTable: 'table1', rootColumn: 'id' },
      { name: 'asset2', rootTable: 'table2', rootColumn: 'id' },
    ],
  },
};

const mockBillingProfiles = [
  {
    id: 'profile-1',
    profileName: 'Default Profile',
  },
  {
    id: 'profile-2',
    profileName: 'Alternative Profile',
  },
];

const mockFilterData = {
  someFilter: 'someValue',
};

const mockStore = createMockStore([routerMiddleware(history)]);

let defaultProps: any;

const setUp = (overrideState = {}, overrideProps = {}) => {
  const initialState = {
    snapshots: {
      ...initialSnapshotState,
      snapshotRequest: {
        name: 'Test Snapshot',
        description: 'Test Description',
        assetName: 'asset1',
        mode: SnapshotRequestContentsModelModeEnum.ByQuery,
      },
    },
    datasets: {
      dataset: mockDataset,
    },
    query: {
      filterData: mockFilterData,
    },
    profiles: {
      profiles: mockBillingProfiles,
    },
    ...overrideState,
  };

  const store = mockStore(initialState);
  cy.spy(store, 'dispatch').as('dispatchSpy');

  const props = {
    ...defaultProps,
    ...overrideProps,
  };

  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <CreateSnapshotPanel
            handleCreateSnapshot={props.handleCreateSnapshot}
            switchPanels={props.switchPanels}
          />
        </ThemeProvider>
      </Router>
    </Provider>,
  );

  return { store };
};

describe('CreateSnapshotPanel Component', () => {
  beforeEach(() => {
    // Initialize stubs before each test
    defaultProps = {
      handleCreateSnapshot: cy.stub(),
      switchPanels: cy.stub(),
    };
  });

  describe('Rendering', () => {
    it('should render all required form elements', () => {
      setUp();

      // Check main heading
      cy.contains('Add Details').should('be.visible');

      // Check snapshot name field
      cy.contains('Snapshot Name').should('be.visible');
      cy.get('[data-cy="textFieldName"] input').should('be.visible');

      // Check description field
      cy.contains('Description').should('be.visible');
      cy.get('#snapshotDescription').should('be.visible');

      // Check asset dropdown
      cy.get('[data-cy="selectAsset"]').should('be.visible');

      // Check billing profile section
      cy.contains('Billing Profile').should('be.visible');
      cy.get('[data-cy="billingProfile"]').should('be.visible');

      // Check buttons
      cy.contains('Cancel').should('be.visible');
      cy.get('[data-cy="next"]').should('be.visible');
    });

    it('should render with pre-filled values from state', () => {
      setUp();

      cy.get('[data-cy="textFieldName"] input').should('have.value', 'Test Snapshot');
      cy.get('#snapshotDescription').should('have.value', 'Test Description');
    });

    it('should set default billing profile based on dataset defaultProfileId', () => {
      setUp();

      cy.get('[data-cy="billingProfile"]').should('contain', 'Default Profile');
    });

    it('should set first billing profile as default when dataset has no defaultProfileId', () => {
      const overrideState = {
        datasets: {
          dataset: {
            ...mockDataset,
            defaultProfileId: null,
          },
        },
      };

      setUp(overrideState);

      cy.get('[data-cy="billingProfile"]').should('contain', 'Default Profile');
    });
  });

  describe('Form Interactions', () => {
    it('should update snapshot name when typing', () => {
      setUp();

      cy.get('[data-cy="textFieldName"] input').clear().type('New Snapshot Name');
      cy.get('[data-cy="textFieldName"] input').should('have.value', 'New Snapshot Name');
    });

    it('should update description when typing', () => {
      setUp();

      cy.get('#snapshotDescription').clear().type('New description text');
      cy.get('#snapshotDescription').should('have.value', 'New description text');
    });

    it('should update selected asset when dropdown selection changes', () => {
      setUp();

      // Verify initial asset selection
      cy.get('[data-cy="selectAsset"]').should('exist');

      // Click the asset dropdown to open it
      cy.get('[data-cy="selectAsset"]').click();

      // Select a different asset
      cy.get('[data-cy="menuItem-asset2"]').click();

      // Verify the dropdown now shows the new selection
      cy.get('[data-cy="selectAsset"]').should('contain', 'asset2');
    });

    it('should update billing profile selection', () => {
      setUp();

      cy.get('[data-cy="billingProfile"]').click();
      cy.contains('Alternative Profile').click();
      cy.get('[data-cy="billingProfile"]').should('contain', 'Alternative Profile');
    });
  });

  describe('Button States', () => {
    it('should disable Next button when required fields are empty', () => {
      const overrideState = {
        snapshots: {
          ...initialSnapshotState,
          snapshotRequest: {
            name: '',
            description: '',
            assetName: '',
            mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          },
        },
      };

      setUp(overrideState);

      cy.get('[data-cy="next"]').should('be.disabled');
    });

    it('should disable Next button when name is empty', () => {
      const overrideState = {
        snapshots: {
          ...initialSnapshotState,
          snapshotRequest: {
            name: '',
            description: 'Test Description',
            assetName: 'asset1',
            mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          },
        },
      };

      setUp(overrideState);

      cy.get('[data-cy="next"]').should('be.disabled');
    });

    it('should disable Next button when assetName is empty', () => {
      const overrideState = {
        snapshots: {
          ...initialSnapshotState,
          snapshotRequest: {
            name: 'Test Snapshot',
            description: 'Test Description',
            assetName: '',
            mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          },
        },
      };

      setUp(overrideState);

      cy.get('[data-cy="next"]').should('be.disabled');
    });

    it('should disable Next button when no billing profile is selected', () => {
      const overrideState = {
        profiles: {
          profiles: [],
        },
      };

      setUp(overrideState);

      cy.get('[data-cy="next"]').should('be.disabled');
    });

    it('should enable Next button when all required fields are filled', () => {
      setUp();

      cy.get('[data-cy="next"]').should('not.be.disabled');
    });
  });

  describe('Actions and Dispatches', () => {
    it('should call handleCreateSnapshot with false when Cancel is clicked', () => {
      setUp();

      cy.contains('Cancel').click();
      cy.wrap(defaultProps.handleCreateSnapshot).should('have.been.calledWith', false);
    });

    it('should dispatch snapshotCreateDetails and call switchPanels when Next is clicked', () => {
      setUp();

      cy.get('[data-cy="next"]').click();

      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'SNAPSHOT_CREATE_DETAILS',
        payload: {
          name: 'Test Snapshot',
          description: 'Test Description',
          mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          assetName: 'asset1',
          filterData: mockFilterData,
          dataset: mockDataset,
          authDomain: undefined,
          billingProfileId: 'profile-1',
        },
      });

      cy.wrap(defaultProps.switchPanels).should('have.been.calledOnce');
    });

    it('should dispatch with updated form values when Next is clicked', () => {
      setUp();

      // Update form values
      cy.get('[data-cy="textFieldName"] input').clear().type('Updated Name');
      cy.get('#snapshotDescription').clear().type('Updated Description');

      // Select different billing profile
      cy.get('[data-cy="billingProfile"]').click();
      cy.contains('Alternative Profile').click();

      cy.get('[data-cy="next"]').click();

      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'SNAPSHOT_CREATE_DETAILS',
        payload: {
          name: 'Updated Name',
          description: 'Updated Description',
          mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          assetName: 'asset1',
          filterData: mockFilterData,
          dataset: mockDataset,
          authDomain: undefined,
          billingProfileId: 'profile-2',
        },
      });
    });

    it('should dispatch with updated asset selection when Next is clicked', () => {
      setUp();

      // Select different asset
      cy.get('[data-cy="selectAsset"]').click();
      cy.get('[data-cy="menuItem-asset2"]').click();

      cy.get('[data-cy="next"]').click();

      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'SNAPSHOT_CREATE_DETAILS',
        payload: {
          name: 'Test Snapshot',
          description: 'Test Description',
          mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          assetName: 'asset2',
          filterData: mockFilterData,
          dataset: mockDataset,
          authDomain: undefined,
          billingProfileId: 'profile-1',
        },
      });
    });
  });

  describe('Component State Management', () => {
    it('should initialize component state from props correctly', () => {
      const overrideState = {
        snapshots: {
          ...initialSnapshotState,
          snapshotRequest: {
            name: 'Initial Name',
            description: 'Initial Description',
            assetName: 'asset2',
            mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          },
        },
      };

      setUp(overrideState);

      // Verify component initializes with values from Redux state
      cy.get('[data-cy="textFieldName"] input').should('have.value', 'Initial Name');
      cy.get('#snapshotDescription').should('have.value', 'Initial Description');
    });
  });

  describe('Props Integration', () => {
    it('should call switchPanels prop with ShareSnapshot component', () => {
      setUp();

      cy.get('[data-cy="next"]').click();

      cy.wrap(defaultProps.switchPanels).should('have.been.calledOnce');
    });

    it('should use handleCreateSnapshot prop for cancel functionality', () => {
      setUp();

      cy.contains('Cancel').click();

      cy.wrap(defaultProps.handleCreateSnapshot).should('have.been.calledOnceWith', false);
    });
  });

  describe('Redux State Mapping', () => {
    it('should correctly map state from multiple Redux slices', () => {
      const customState = {
        snapshots: {
          ...initialSnapshotState,
          snapshotRequest: {
            name: 'Redux Name',
            description: 'Redux Description',
            assetName: 'custom-asset',
            mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          },
        },
        datasets: {
          dataset: {
            ...mockDataset,
            name: 'Custom Dataset',
          },
        },
        query: {
          filterData: { customFilter: 'customValue' },
        },
        profiles: {
          profiles: [{ id: 'custom-profile', profileName: 'Custom Profile' }],
        },
      };

      setUp(customState);

      // Verify component uses values from different Redux slices
      cy.get('[data-cy="textFieldName"] input').should('have.value', 'Redux Name');
      cy.get('[data-cy="billingProfile"]').should('contain', 'Custom Profile');

      // Submit and verify all state is correctly passed to action
      cy.get('[data-cy="next"]').click();

      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'SNAPSHOT_CREATE_DETAILS',
        payload: {
          name: 'Redux Name',
          description: 'Redux Description',
          mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          assetName: 'custom-asset',
          filterData: { customFilter: 'customValue' },
          dataset: customState.datasets.dataset,
          authDomain: undefined,
          billingProfileId: 'custom-profile',
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty billing profiles array', () => {
      const overrideState = {
        profiles: {
          profiles: [],
        },
        datasets: {
          dataset: {
            ...mockDataset,
            defaultProfileId: null,
          },
        },
      };

      setUp(overrideState);

      cy.get('[data-cy="billingProfile"]').should('have.value', '');
      cy.get('[data-cy="next"]').should('be.disabled');
    });

    it('should handle billing profiles without profileName', () => {
      const overrideState = {
        profiles: {
          profiles: [
            { id: 'profile-1' }, // Missing profileName
            { id: 'profile-2', profileName: 'Valid Profile' },
          ],
        },
      };

      setUp(overrideState);

      // Should only show profiles with profileName defined
      cy.get('[data-cy="billingProfile"]').click();
      cy.contains('Valid Profile').should('exist');
    });

    it('should handle missing dataset schema assets', () => {
      const overrideState = {
        datasets: {
          dataset: {
            ...mockDataset,
            schema: {
              assets: [],
            },
          },
        },
      };

      setUp(overrideState);

      // Should still render the asset dropdown even with no assets
      cy.get('[data-cy="selectAsset"]').should('exist');
    });

    it('should handle undefined or null snapshot request values', () => {
      const overrideState = {
        snapshots: {
          ...initialSnapshotState,
          snapshotRequest: {
            name: null,
            description: undefined,
            assetName: '',
            mode: SnapshotRequestContentsModelModeEnum.ByQuery,
          },
        },
      };

      setUp(overrideState);

      // Should handle null/undefined values gracefully
      cy.get('[data-cy="textFieldName"] input').should('have.value', '');
      cy.get('#snapshotDescription').should('have.value', '');
      cy.get('[data-cy="next"]').should('be.disabled');
    });
  });
});
