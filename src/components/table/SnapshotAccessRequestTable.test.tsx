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
import SnapshotAccessRequestTable from 'components/table/SnapshotAccessRequestTable';
import { SnapshotAccessRequestResponse } from 'generated/tdr';

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

const snapshotAccessRequests: SnapshotAccessRequestResponse[] = [
  { id: 'abc', snapshotName: 'abc', createdDate: '2024-05-20T19:16:26.320429Z' },
  { id: 'def', snapshotName: 'def', createdDate: '2024-05-20T13:16:26.320429Z' },
  { id: 'ghi', snapshotName: 'ghi', createdDate: '2024-05-20T17:16:26.320429Z' },
  { id: 'ljk', snapshotName: 'ljk', createdDate: '2024-05-20T15:16:26.320429Z' },
];

describe('SnapshotAccessRequestTable', () => {
  it('is ordered by date', () => {
    // Arrange
    const mockStore = createMockStore([routerMiddleware(history)]);

    const store = mockStore(initialState);
    // Act
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotAccessRequestTable
              searchString=""
              dispatch={store.dispatch}
              loading={false}
              refreshCnt={0}
              snapshotAccessRequests={snapshotAccessRequests}
            />
          </ThemeProvider>
        </Router>
      </Provider>,
    );
    // Assert
    cy.get('tbody tr').should('have.length', snapshotAccessRequests.length);
    cy.get('[data-cy=cellValue-snapshotName-0]').should(
      'have.text',
      snapshotAccessRequests[0].snapshotName,
    );
    cy.get('[data-cy=cellValue-snapshotName-1]').should(
      'have.text',
      snapshotAccessRequests[2].snapshotName,
    );
    cy.get('[data-cy=cellValue-snapshotName-2]').should(
      'have.text',
      snapshotAccessRequests[3].snapshotName,
    );
    cy.get('[data-cy=cellValue-snapshotName-3]').should(
      'have.text',
      snapshotAccessRequests[1].snapshotName,
    );
  });

  it('filters by search text', () => {
    // Arrange
    const mockStore = createMockStore([routerMiddleware(history)]);

    const store = mockStore(initialState);
    // Act
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotAccessRequestTable
              searchString="abc"
              dispatch={store.dispatch}
              loading={false}
              refreshCnt={0}
              snapshotAccessRequests={snapshotAccessRequests}
            />
          </ThemeProvider>
        </Router>
      </Provider>,
    );
    // Assert
    cy.get('[data-cy=cellValue-snapshotName-0]').should(
      'have.text',
      snapshotAccessRequests[0].snapshotName,
    );
    cy.get('tbody tr').should('have.length', 1);
  });
});
