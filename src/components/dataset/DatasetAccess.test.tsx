import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { DatasetModel, PolicyModel } from 'generated/tdr';
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import DatasetAccess from './DatasetAccess';

describe('DataAccess Component', () => {
  const mockDataset: DatasetModel = {
    id: '1',
    name: 'Test Dataset',
  };

  const mockPolicies: Array<PolicyModel> = [
    {
      name: 'steward',
      members: ['steward1@example.com'],
    },
    {
      name: 'custodian',
      members: ['custodian1@example.com', 'custodian2@example.com'],
    },
    {
      name: 'snapshot_creator',
      members: ['snapshot_creator1@example.com'],
    },
  ];

  const mockUserRoles: Array<string> = ['steward', 'custodian'];

  const setUpSpecifyRoles = (dataset: DatasetModel, userRoles: string[]) => {
    const initialState = {
      datasets: {
        dataset,
        datasetPolicies: mockPolicies,
        userRoles,
      },
    };

    const mockStore = createMockStore([]);
    const store = mockStore(initialState);

    // Spy on the store dispatch to verify correct actions are called
    cy.spy(store, 'dispatch').as('dispatchSpy');

    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <DatasetAccess />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  };

  const setUp = (dataset: DatasetModel) => {
    setUpSpecifyRoles(dataset, mockUserRoles);
  };

  it('renders DataAccess component correctly', () => {
    setUp(mockDataset);
    cy.get('[data-cy="manageAccessContainer"]').should('exist');
    cy.contains('Stewards').should('exist');
    cy.contains('Custodians').should('exist');
    cy.contains('Snapshot Creators').should('exist');
  });

  ['custodian', 'snapshot_creator'].forEach((role) => {
    it(`custodians can add and remove ${role}s`, () => {
      const newUser = 'test@example.com';
      setUpSpecifyRoles(mockDataset, ['custodian']);

      // Add user as role on the dataset
      cy.get('[data-cy="enterEmailBox"]').type(newUser);
      cy.get('[data-cy="roleSelect"]').click();
      cy.get(`[data-cy="roleOption-${role}"]`).click();
      cy.get('.css-1gsxfx1').click();

      // Verify the correct add action was dispatched with the right parameters
      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'ADD_DATASET_POLICY_MEMBER',
        payload: {
          datasetId: '1',
          user: newUser,
          policy: role,
        },
      });

      // Reset spy for next assertion
      cy.get('@dispatchSpy').invoke('resetHistory');

      // Simulate clicking remove (even though UI won't update without saga response)
      // First expand the stewards list to access the remove button
      const titleCaseRole =
        role === 'snapshot_creator'
          ? 'Snapshot Creators'
          : `${role.charAt(0).toUpperCase() + role.slice(1)}s`;
      cy.get(`[data-cy="user-list-${titleCaseRole}"]`).click();

      // Try to click remove on existing steward for testing dispatch call
      cy.get(`[data-cy="chip-${role}1@example.com"]`).find('[data-testid="CancelIcon"]').click();

      // Verify the correct remove action was dispatched with the right parameters
      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'REMOVE_DATASET_POLICY_MEMBER',
        payload: {
          datasetId: '1',
          user: `${role}1@example.com`,
          policy: role,
        },
      });
    });
  });

  ['steward', 'custodian', 'snapshot_creator'].forEach((role) => {
    it(`stewards can add and remove ${role}s`, () => {
      const newUser = 'test@example.com';
      setUpSpecifyRoles(mockDataset, ['steward']);

      // Add user as role on the dataset
      cy.get('[data-cy="enterEmailBox"]').type(newUser);
      cy.get('[data-cy="roleSelect"]').click();
      cy.get(`[data-cy="roleOption-${role}"]`).click();
      cy.get('.css-1gsxfx1').click();

      // Verify the correct add action was dispatched with the right parameters
      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'ADD_DATASET_POLICY_MEMBER',
        payload: {
          datasetId: '1',
          user: newUser,
          policy: role,
        },
      });

      // Reset spy for next assertion
      cy.get('@dispatchSpy').invoke('resetHistory');

      // Simulate clicking remove (even though UI won't update without saga response)
      // First expand the stewards list to access the remove button
      const titleCaseRole =
        role === 'snapshot_creator'
          ? 'Snapshot Creators'
          : `${role.charAt(0).toUpperCase() + role.slice(1)}s`;
      cy.get(`[data-cy="user-list-${titleCaseRole}"]`).click();

      // Try to click remove on existing steward for testing dispatch call
      cy.get(`[data-cy="chip-${role}1@example.com"]`).find('[data-testid="CancelIcon"]').click();

      // Verify the correct remove action was dispatched with the right parameters
      cy.get('@dispatchSpy').should('have.been.calledWith', {
        type: 'REMOVE_DATASET_POLICY_MEMBER',
        payload: {
          datasetId: '1',
          user: `${role}1@example.com`,
          policy: role,
        },
      });
    });
  });

  it('custodians cannot add or remove stewards', () => {
    const mockCustodian = ['custodian'];
    setUpSpecifyRoles(mockDataset, mockCustodian);
    // cannot add steward
    cy.get('[data-cy="roleSelect"]').click();
    cy.get('[data-cy="roleOption-steward"]').should('have.class', 'Mui-disabled');
    // cannot remove steward
    cy.get('[data-cy="user-list-Stewards"]').click({ force: true });
    cy.get('[data-testid="CancelIcon"]').should('not.be.visible');
  });

  it('snapshot creators cannot add or remove users', () => {
    const mockSnapshotCreator = ['snapshot_creator'];
    setUpSpecifyRoles(mockDataset, mockSnapshotCreator);
    cy.get('.css-1gsxfx1').should('not.exist'); // ADD button
    cy.get('[data-cy="user-list-Custodians"]').click();
    cy.get('[data-testid="CancelIcon"]').should('not.exist');
    cy.get('[data-cy="user-list-Stewards"]').click();
    cy.get('[data-testid="CancelIcon"]').should('not.exist');
    cy.get('[data-cy="user-list-Snapshot Creators"]').click();
    cy.get('[data-testid="CancelIcon"]').should('not.exist');
  });

  it('renders Dataset Custodian information correctly when inherit steward is true', () => {
    mockDataset.inheritSteward = true;
    setUp(mockDataset);
    cy.contains('Custodians').click();
    cy.contains(
      'All dataset custodians are stewards on all snapshots created from this dataset.',
    ).should('exist');
    cy.contains('custodian1@example.com').should('exist');
    cy.contains('custodian2@example.com').should('exist');
  });

  [false, undefined].forEach((inheritSteward) => {
    it(`custodians should appear without message about inheriting stewardship when inherit steward is ${inheritSteward}`, () => {
      mockDataset.inheritSteward = inheritSteward;
      setUp(mockDataset);
      cy.contains('Custodians').click();
      cy.contains(
        'All dataset custodians are stewards on all snapshots created from this dataset.',
      ).should('not.exist');
      cy.contains('custodian1@example.com').should('exist');
      cy.contains('custodian2@example.com').should('exist');
    });
  });
});
