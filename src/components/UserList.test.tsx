import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../modules/hist';
import globalTheme from '../modules/theme';
import UserList from './UserList';

describe('UserList', () => {
  [true, false].forEach((canManageUsers) => {
    it('Renders user list indepedent of whether you can manage users', () => {
      const mockStore = createMockStore([]);
      const store = mockStore({});
      mount(
        <Router history={history}>
          <Provider store={store}>
            <ThemeProvider theme={globalTheme}>
              <UserList
                classes={{}}
                canManageUsers={canManageUsers}
                removeUser={canManageUsers ? () => <div /> : undefined}
                typeOfUsers="Data Access Controls"
                users={['authdomain1', 'authdomain2', 'authdomain3']}
              />
            </ThemeProvider>
          </Provider>
        </Router>,
      );
      cy.get('[data-cy=user-email]').within(() => {
        cy.contains('authdomain1').should('exist');
        cy.contains('authdomain2').should('exist');
        cy.contains('authdomain3').should('exist');
      });
    });
  });
  it('displays none when there are no users', () => {
    const mockStore = createMockStore([]);
    const store = mockStore({});
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <UserList
              classes={{}}
              canManageUsers={true}
              removeUser={() => <div />}
              typeOfUsers="steward"
              users={[]}
            />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy=user-email]').contains('(None)').should('exist');
  });
});
