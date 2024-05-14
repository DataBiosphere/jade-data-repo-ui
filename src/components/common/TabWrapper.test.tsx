import { mount } from 'cypress/react';
import _ from 'lodash';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import createMockStore from 'redux-mock-store';
import { routerMiddleware } from 'connected-react-router';
import history from 'modules/hist';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import globalTheme from 'modules/theme';
import React from 'react';
import TabWrapper from 'components/common/TabWrapper';
import { routes } from 'routes/Private';
import { SnapshotAccessRequestResponse } from 'generated/tdr';

const initialState = (snapshotAccessRequests: Array<SnapshotAccessRequestResponse>) => ({
  snapshotAccessRequests: {
    snapshotAccessRequests,
    snapshotAccessRequestRoleMaps: {} as { [key: string]: Array<string> },
    loading: false,
    refreshCnt: 0,
  },
  user: _.cloneDeep(initialUserState),
  query: _.cloneDeep(initialQueryState),
  router: { location: {} },
});

describe('TabWrapper', () => {
  it('Shows the requests tab if there are requests', () => {
    const mockStore = createMockStore([routerMiddleware(history)]);

    const store = mockStore(
      initialState([{ id: 'abc' }, { id: 'def' }, { id: 'ghi' }, { id: 'ljk' }]),
    );
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={globalTheme}>
            <TabWrapper routes={routes} />
          </ThemeProvider>
        </Router>
      </Provider>,
    );

    cy.contains('Requests').should('exist');
  });

  it('Hides the requests tab if there are no requests', () => {
    const mockStore = createMockStore([routerMiddleware(history)]);

    const store = mockStore(initialState([]));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={globalTheme}>
            <TabWrapper routes={routes} />
          </ThemeProvider>
        </Router>
      </Provider>,
    );

    cy.contains('Requests').should('not.exist');
  });
});
