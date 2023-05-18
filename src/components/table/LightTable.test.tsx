import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import _ from 'lodash';
import createMockStore from 'redux-mock-store';
import React from 'react';
import { routerMiddleware } from 'connected-react-router';
import LightTable from './LightTable';
import globalTheme from '../../modules/theme';
import history from '../../modules/hist';

const initialState = {
  orderedColumns: [
    { width: 100, name: 'column1', arrayOf: false, label: 'column1' },
    { width: 100, name: 'arrayCol', arrayOf: true, label: 'arrayCol' },
  ],
  rows: [
    { column1: 23, arrayCol: [2, 23] },
    { column1: [], arrayCol: null },
  ],
  user: _.cloneDeep(initialUserState),
  query: _.cloneDeep(initialQueryState),
  router: { location: {} },
};

beforeEach(() => {
  const mockStore = createMockStore([routerMiddleware(history)]);
  const store = mockStore(initialState);
  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <LightTable
            columns={initialState.orderedColumns}
            filteredCount={initialState.rows.length}
            handleEnumeration={() => null}
            loading={false}
            noRowsMessage="No rows"
            rows={initialState.rows}
            searchString=""
            tableName="table1"
            totalCount={initialState.rows.length}
            refreshCnt={0}
          />
        </ThemeProvider>
      </Router>
    </Provider>,
  );
});

describe('LightTable', () => {
  it('should have the bones of the basic table', () => {
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length', initialState.rows.length);
  });
  it('correctly display values and array values', () => {
    cy.get('[data-cy=columnHeader-column1]').scrollIntoView().click({ force: true });
    cy.get('[data-cy=cellValue-column1-0]').should('have.text', initialState.rows[0].column1);
    cy.get('[data-cy=columnHeader-arrayCol]').scrollIntoView().click({ force: true });
    cy.get('[data-cy=cellValue-arrayCol-0]').should('have.text', '2, 23(2 items)');
  });
  it('correctly display empty values and empty arrays', () => {
    cy.get('[data-cy=columnHeader-column1]').scrollIntoView().click({ force: true });
    cy.get('[data-cy=cellValue-column1-1]').should('have.text', '(empty)');
    cy.get('[data-cy=columnHeader-arrayCol]').scrollIntoView().click({ force: true });
    cy.get('[data-cy=cellValue-arrayCol-1]').should('have.text', '(empty)');
  });
});
