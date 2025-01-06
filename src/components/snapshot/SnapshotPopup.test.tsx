import SnapshotPopup from 'components/snapshot/SnapshotPopup';
import { mount } from 'cypress/react';
import createMockStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import globalTheme from 'modules/theme';
import React from 'react';

describe('SnapshotPopup Component', () => {
  const snapshot = {
    id: '1',
    name: 'Test Snapshot',
    source: 'source',
    tables: [{ rowCount: 100 }],
    createdDate: new Date().toISOString(),
  };

  const policies = [
    {
      name: 'reader',
      members: ['user1@example.com', 'user2@example.com'],
    },
  ];

  const filterData = {
    table1: {
      filter1: { type: 'range', value: [1, 10] },
      filter2: { type: 'selection', value: ['option1', 'option2'] },
    },
  };

  const initialStateNotReady = {
    snapshots: {
      dialogIsOpen: true,
      snapshot: {},
      snapshotPolicies: [],
    },
    query: {
      filterData: {},
    },
  };

  const initialStateReady = {
    snapshots: {
      dialogIsOpen: true,
      snapshot,
      snapshotPolicies: policies,
    },
    query: {
      filterData,
    },
  };

  const mountSnapshotPopup = (initialState) => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotPopup />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  };

  it('shows loading message when not ready', () => {
    mountSnapshotPopup(initialStateNotReady);
    cy.get('div').contains('Your data snapshot is being created').should('be.visible');
  });

  it('shows created snapshot information when ready', () => {
    mountSnapshotPopup(initialStateReady);
    cy.get('div').contains('Snapshot Successfully Created').should('be.visible');
    cy.get('div').contains('Test Snapshot').should('be.visible');
    cy.get('div').contains('100 Rows').should('be.visible');
    cy.get('div').contains('Properties').should('be.visible');
    cy.get('div').contains('table1').should('be.visible');
    cy.get('div').contains('filter1: 1 – 10').should('be.visible');
    cy.get('div').contains('filter2: option1').should('be.visible');
    cy.get('div').contains('filter2: option2').should('be.visible');
    cy.get('div').contains('Shared With').should('be.visible');
    cy.get('div').contains('user1@example.com').should('be.visible');
    cy.get('div').contains('user2@example.com').should('be.visible');
  });
});
