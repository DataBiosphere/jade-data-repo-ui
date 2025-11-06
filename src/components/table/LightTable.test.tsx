import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
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
  user: structuredClone(initialUserState),
  query: structuredClone(initialQueryState),
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

describe('LightTable Timestamp Display', () => {
  const timestampTestState = {
    orderedColumns: [
      { width: 100, name: 'variant_id', arrayOf: false, label: 'variant_id' },
      { width: 150, name: 'timestamp_column', arrayOf: false, label: 'timestamp_column' },
      {
        width: 150,
        name: 'timestamp_array_column',
        arrayOf: true,
        label: 'timestamp_array_column',
      },
    ],
    rows: [
      {
        variant_id: '12:101976753:T:C',
        timestamp_column: '6/1/2023, 1:02:40 AM',
        timestamp_array_column: ['6/2/2023, 1:04:40 AM'],
      },
      {
        variant_id: '1:123456789:A:G',
        timestamp_column: '12/25/2023, 11:30:15 PM',
        timestamp_array_column: ['1/1/2024, 12:00:00 AM', '2/14/2024, 2:30:45 PM'],
      },
    ],
    user: structuredClone(initialUserState),
    query: structuredClone(initialQueryState),
    router: { location: {} },
  };

  beforeEach(() => {
    const mockStore = createMockStore([routerMiddleware(history)]);
    const store = mockStore(timestampTestState);
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={globalTheme}>
            <LightTable
              columns={timestampTestState.orderedColumns}
              filteredCount={timestampTestState.rows.length}
              handleEnumeration={() => null}
              loading={false}
              noRowsMessage="No rows"
              rows={timestampTestState.rows}
              searchString=""
              tableName="all_data_types"
              totalCount={timestampTestState.rows.length}
              refreshCnt={0}
            />
          </ThemeProvider>
        </Router>
      </Provider>,
    );
  });

  it('displays timestamp values as provided', () => {
    // Verify that timestamp values are displayed exactly as passed in
    cy.get('[data-cy=cellValue-timestamp_column-0]').should('have.text', '6/1/2023, 1:02:40 AM');
    cy.get('[data-cy=cellValue-timestamp_column-1]').should('have.text', '12/25/2023, 11:30:15 PM');
  });

  it('displays timestamp arrays with item counts', () => {
    // Check single item array shows with count
    cy.get('[data-cy=cellValue-timestamp_array_column-0]').should(
      'have.text',
      '6/2/2023, 1:04:40 AM(1 item)',
    );

    // Check multiple items array shows with count
    cy.get('[data-cy=cellValue-timestamp_array_column-1]').should(
      'have.text',
      '1/1/2024, 12:00:00 AM, 2/14/2024, 2:30:45 PM(2 items)',
    );
  });
});
