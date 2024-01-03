import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../modules/hist';
import globalTheme from '../modules/theme';
import ManageUsersView from './ManageUsersView';

describe('ManageUsersView', () => {
  // [true, false].forEach((canManageUsers) => {
  //   it('Renders user list indepedent of whether you can manage users', () => {
  //     const mockStore = createMockStore([]);
  //     const store = mockStore({});
  //     mount(
  //       <Router history={history}>
  //         <Provider store={store}>
  //           <ThemeProvider theme={globalTheme}>
  //             <ManageUsersView
  //               classes={{}}
  //               removeUser={canManageUsers ? () => <div /> : undefined}
  //               users={['authdomain1', 'authdomain2', 'authdomain3']}
  //             />
  //           </ThemeProvider>
  //         </Provider>
  //       </Router>,
  //     );
  //     cy.get('[data-cy=chip-container]').within(() => {
  //       cy.contains('authdomain1').should('exist');
  //       cy.contains('authdomain2').should('exist');
  //       cy.contains('authdomain3').should('exist');
  //     });
  //   });
  // });
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
