import React from 'react';
import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import { Status } from '../../constants';
import TerraAvatar from './TerraAvatar';
import { UserState } from '../../reducers/user';

const initialStateGen = (): UserState => ({
  isInitiallyLoaded: true,
  isAuthenticated: true,
  status: Status.READY,
  name: 'Foo bar',
  email: 'foobar@baz.com',
  token: 'mytoken',
  delegateToken: 'mydeltoken',
  tokenExpiration: 0,
  features: {},
  isTimeoutEnabled: false,
  id: 'myid',
});

describe('TerraAvatar', () => {
  it('should render image if present', () => {
    const initialUserState = initialStateGen();
    initialUserState.image = 'http://urltopicture';
    const mockStore = createMockStore([]);
    const store = mockStore({ user: initialUserState });
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TerraAvatar />
          </ThemeProvider>
        </Provider>
      </Router>,
    );

    cy.get('[data-cy=avatar]').should('contain.text', '');
    cy.get('[data-cy=avatar] img').should('have.attr', 'src', 'http://urltopicture');
  });
  it('should render text avatar with first and last', () => {
    const initialUserState = initialStateGen();
    const mockStore = createMockStore([]);
    const store = mockStore({ user: initialUserState });
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TerraAvatar />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy=avatar]').should('contain.text', 'FB');
  });
  it('should render text avatar with only single name', () => {
    const initialUserState = initialStateGen();
    initialUserState.name = 'Foo';
    const mockStore = createMockStore([]);
    const store = mockStore({ user: initialUserState });
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TerraAvatar />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy=avatar]').should('contain.text', 'F');
  });
});
