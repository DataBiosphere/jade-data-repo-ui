import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { initialDatasetState } from 'reducers/dataset';
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import ManagedSnapshotAccess from './ManagedSnapshotAccess';

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
      {
        name: 'aggregate_data_reader',
        members: ['datareader@gmail.com'],
      },
    ],
    userRoles: ['steward', 'reader', 'discoverer', 'aggregate_data_reader'],
  },
  datasets: initialDatasetState,
};

describe('ManagedSnapshotAccess', () => {
  beforeEach(() => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);
    const snapshotRequestPolicies = {
      stewards: ['steward@gmail.com'],
      readers: ['reader@gmail.com'],
      discoverers: [],
      aggregateDataReaders: ['datareader@gmail.com'],
    };
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <ManagedSnapshotAccess
              createMode={false}
              addUsers={cy.stub().as('addUsers')}
              removeUser={cy.stub()}
              requestPolicies={snapshotRequestPolicies}
            />
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
    cy.get('[data-cy="snapshot-aggregate-data-readers"]')
      .should('contain.text', 'Aggregate Data Readers')
      .within(() => {
        cy.get('[data-cy="user-email"]').then((user) => {
          cy.wrap(user[0]).should('contain.text', 'datareader@gmail.com');
        });
      });
  });
  it('Allows adding users', () => {
    cy.get('[data-cy="enterEmailBox"]').type('newemail@gmail.com');
    cy.get('[data-cy="inviteButton"]').click();
    cy.get('@addUsers').should('be.calledWith', 'steward', ['newemail@gmail.com']);
  });

  // TODO: Refactor remove users to use the same pattern as add users so it is stubable
});
