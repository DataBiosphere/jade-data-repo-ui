import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../modules/hist';
import globalTheme from '../modules/theme';
import ManageUsersView from './ManageUsersView';

const user1 = 'user1';
const user2 = 'user2';
const user3 = 'user3';
const readOnlyUser1 = 'readOnlyUser1';
const readOnlyUser2 = 'readOnlyUser2';
const mountComponent = (canManageUsers) => {
  const mockStore = createMockStore([]);
  const store = mockStore({});
  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <ManageUsersView
            classes={{}}
            removeUser={canManageUsers ? () => <div /> : undefined}
            users={[user1, user2, user3]}
            readOnlyUsers={[readOnlyUser1, readOnlyUser2]}
            readOnlyUserTooltip="read only user tooltip"
          />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
};

describe('ManageUsersView', () => {
  [true, false].forEach((canManageUsers) => {
    it('Renders user list independent of whether you can manage users', () => {
      mountComponent(canManageUsers);
      cy.get('[data-cy=chip-container]').within(() => {
        cy.contains(user1).should('exist');
        cy.contains(user2).should('exist');
        cy.contains(user3).should('exist');
        cy.contains(readOnlyUser1).should('exist');
        cy.contains(readOnlyUser2).should('exist');
      });
    });
  });
  it('Does not render remove user button for readOnly users even if canManageUsers is true', () => {
    mountComponent(true);
    cy.get(`[data-cy="chip-${user1}"]`).find('[data-testid="CancelIcon"]').should('exist');
    cy.get(`[data-cy="chip-${readOnlyUser1}"]`)
      .contains('[data-testid="CancelIcon"]')
      .should('not.exist');
  });
  it('No container when there are no users', () => {
    const mockStore = createMockStore([]);
    const store = mockStore({});
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <ManageUsersView classes={{}} removeUser={() => <div />} users={[]} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy=chip-item]').should('not.exist');
  });
});
