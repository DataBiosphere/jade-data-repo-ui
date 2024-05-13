import { mount } from 'cypress/react';
import SnapshotAccessRequestView from 'components/SnapshotAccessRequestView';
import { SnapshotAccessRequestResponse } from 'generated/tdr';
import _ from 'lodash';
import { TdrState } from 'reducers';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import createMockStore from 'redux-mock-store';
import { routerMiddleware } from 'connected-react-router';
import history from 'modules/hist';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import globalTheme from 'modules/theme';
import JobView from 'components/JobView';
import React from 'react';

const initialState = {
  snapshotAccessRequests: {
    snapshotAccessRequests: [{ id: 'abc' }, { id: 'def' }, { id: 'ghi' }, { id: 'ljk' }],
    snapshotAccessRequestRoleMaps: {} as { [key: string]: Array<string> },
    loading: false,
    refreshCnt: 0,
  },
  user: _.cloneDeep(initialUserState),
  query: _.cloneDeep(initialQueryState),
  router: { location: {} },
};

describe('SnapshotAccessRequestView', () => {
  it('Renders an unordered list of snapshot access request ids', () => {
    const mockStore = createMockStore([routerMiddleware(history)]);

    const store = mockStore(initialState);
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotAccessRequestView />
          </ThemeProvider>
        </Router>
      </Provider>,
    );

    for (let i = 0; i < 4; i++) {
      cy.get('ul > li')
        .eq(i)
        .should('have.text', initialState.snapshotAccessRequests.snapshotAccessRequests[i].id);
    }
  });
});
