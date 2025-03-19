import React from 'react';
import { mount } from 'cypress/react';
import { Provider } from 'react-redux';
import { StatusState } from 'reducers/status';
import createMockStore from 'redux-mock-store';
import { routerMiddleware } from 'connected-react-router';
import history from 'modules/hist';
import { ThemeProvider } from '@mui/material/styles';
import globalTheme from 'modules/theme';
import { initialQueryState } from 'reducers/query';
import _ from 'lodash';
import ServerErrorView from './ServerErrorView';

describe('ServerErrorView', () => {
  it('should render correctly when API is up but some systems are down', () => {
    const status: StatusState = {
      tdrOperational: true,
      apiIsUp: true,
      serverStatus: {
        ok: true,
        systems: {
          database: { ok: true },
          service1: { ok: false },
          service2: { ok: true },
        },
      },
    };

    const mockStore = createMockStore([routerMiddleware(history)]);
    const store = mockStore({ status, query: _.cloneDeep(initialQueryState) });

    mount(
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <ServerErrorView />
        </ThemeProvider>
      </Provider>,
    );

    // Verify title is displayed
    cy.contains('Uh oh, something went wrong!').should('be.visible');

    // Verify message about services down is displayed
    cy.contains(
      'It looks like the Data Repository server is up, but some required services are down.',
    ).should('be.visible');

    // Verify table is displayed with correct data
    cy.contains('System').should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('database').should('be.visible');
    cy.contains('service1').should('be.visible');
    cy.contains('service2').should('be.visible');

    // Check for correct status indicators
    cy.get('tr').eq(1).should('contain', '✅'); // database row
    cy.get('tr').eq(2).should('contain', '❌'); // service1 row
    cy.get('tr').eq(3).should('contain', '✅'); // service2 row
  });

  it('should render correctly when API is down', () => {
    const mockStore = createMockStore([routerMiddleware(history)]);
    const store = mockStore({ status: { tdrOperational: false, apiIsUp: false } });

    mount(
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <ServerErrorView />
        </ThemeProvider>
      </Provider>,
    );

    // Verify title is displayed
    cy.contains('Uh oh, something went wrong!').should('be.visible');

    // Verify message about server being down is displayed
    cy.contains('The Data Repository server is down!').should('be.visible');
    cy.contains('Please check back in later.').should('be.visible');

    // Verify table is not displayed
    cy.contains('System').should('not.exist');
  });
});
