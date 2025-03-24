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
      members: ['steward1@example.com', 'steward2@example.com'],
    },
    {
      name: 'custodian',
      members: ['custodian1@example.com', 'custodian2@example.com'],
    },
    {
      name: 'snapshot_creator',
      members: [],
    },
  ];

  const mockUserRoles: Array<string> = ['steward', 'custodian'];

  const initialState = {
    datasets: {
      dataset: mockDataset,
      datasetPolicies: mockPolicies,
      userRoles: mockUserRoles,
    },
  };

  const setUp = (dataset) => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <DatasetAccess dataset={dataset} policies={mockPolicies} userRoles={mockUserRoles} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  };

  it('renders DataAccess component correctly', () => {
    setUp(mockDataset);
    cy.get('[data-cy="manageAccessContainer"]').should('exist');
    cy.contains('Stewards').should('exist');
    cy.contains('Custodians').should('exist');
    cy.contains('Snapshot Creators').should('exist');
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

  describe('renders Dataset Custodian information correctly when inherit steward is false or undefined', () => {
    [false, undefined].forEach((inheritSteward) => {
      it('custodians should appear without message about inheriting stewardship', () => {
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
});
