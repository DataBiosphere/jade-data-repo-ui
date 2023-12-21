import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import SnapshotAccess from './SnapshotAccess';
import DataAccessControlGroup from './DataAccessControlGroup';

const snapshot = {
  id: 'uuid',
};

const initialState = {
  snapshots: {
    snapshot,
    snapshotAuthDomains: ['authdomain1', 'authdomain2', 'authdomain3'],
  },
};

describe('DataAccessControlGroup', () => {
  beforeEach(() => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <DataAccessControlGroup />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });
  it('Displays snapshot policies and emails', () => {
    cy.get('[data-cy="data-access-control-container"]').should(
      'contain.text',
      'Data Access Control Groups',
    );
    cy.get('[data-cy="data-access-controls"]')
      .should('contain.text', 'Data Access Controls')
      .within(() => {
        cy.get('[data-cy="user-email"]').then((user) => {
          cy.wrap(user[0]).should('contain.text', 'authdomain1');
        });
      });
  });
});
