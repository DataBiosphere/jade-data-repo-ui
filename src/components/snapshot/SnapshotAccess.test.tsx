import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import SnapshotAccess from './SnapshotAccess';

const snapshot = {
  id: 'uuid',
};

const initialState = {
  snapshots: {
    snapshot,
    snapshotPolicies: [
      {
        name: 'steward',
        members: ['steward@gmail.com'],
      },
      {
        name: 'reader',
        members: ['reader@gmail.com'],
      },
      {
        name: 'discoverer',
        members: [],
      },
    ],
    userRoles: ['steward', 'reader'],
  },
};

describe('Snapshot access info', () => {
  beforeEach(() => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotAccess horizontal={true} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });
  it('Displays snapshot policies and emails', () => {
    cy.get('[data-cy="snapshot-stewards"]')
      .should('contain.text', 'Stewards')
      .within(() => {
        cy.get('[data-cy="user-email"]').then((user) => {
          cy.wrap(user[0]).should('contain.text', 'steward@gmail.com');
        });
      });
    cy.get('[data-cy="snapshot-readers"]')
      .should('contain.text', 'Readers')
      .within(() => {
        cy.get('[data-cy="user-email"]').then((user) => {
          cy.wrap(user[0]).should('contain.text', 'reader@gmail.com');
        });
      });
    cy.get('[data-cy="snapshot-discoverers"]')
      .should('contain.text', 'Discoverers')
      .within(() => {
        cy.get('[data-cy="user-email"]').then((user) => {
          cy.wrap(user[0]).should('contain.text', '(None)');
        });
      });
  });
});
