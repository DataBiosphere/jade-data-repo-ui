import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import { routerMiddleware } from 'connected-react-router';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import React from 'react';
import CategoryWrapper from './CategoryWrapper';
import globalTheme from '../../../../../modules/theme';
import history from '../../../../../modules/hist';
import { ActionTypes } from '../../../../../constants';
import { TableColumnType } from 'reducers/query';

function createState(column: TableColumnType): any {
  return {
    datasets: {
      dataset: {
        description: 'A dataset description',
        phsId: '12345',
      },
    },
    column: column,
  };
}

const baseStringColumn = {
  name: 'variant_id',
  label: 'variant_id',
};

let store: MockStoreEnhanced<unknown, unknown>;

function mountComponent(state: any) {
  const mockStore = createMockStore([routerMiddleware(history)]);
  store = mockStore(state);
  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <CategoryWrapper
            key={state.column.name}
            column={state.column}
            filterMap={{}}
            handleChange={() => console.log('handleChange')}
            handleFilters={() => console.log('handleFilters')}
            tableName={'tableName'}
            toggleExclude={() => console.log('toggleExclude')}
          />
        </ThemeProvider>
      </Router>
    </Provider>,
  );
}

describe('Initial load of CategoryWrapper', () => {
  beforeEach(() => {
    const initialState = createState({ ...baseStringColumn, isExpanded: false });
    mountComponent(initialState);
  });
  it('should have NOT loaded column stats', () => {
    assertGetColumnStatsWasNotCalled(store);
  });
  it('No values are returned, so component should not be displayed', () => {
    cy.get('[data-cy="categoryFilterCheckbox-a"]').should('not.exist');
    cy.get('[id="autocomplete-variant_id"]').should('not.exist');
    cy.get('circle').should('not.exist');
  });
});

describe('First expansion of column', () => {
  beforeEach(() => {
    const state = createState({ ...baseStringColumn, isExpanded: true });
    mountComponent(state);
  });
  it('Load column stats on first load', () => {
    assertGetColumnStatsWasCalled(store);
  });
});

describe('Expanded column after another column has updated - Checkbox', () => {
  beforeEach(() => {
    const state = createState({
      ...baseStringColumn,
      isExpanded: true,
      filterHasUpdated: true,
      values: [{ value: 'a', count: 1 }],
      originalValues: [
        { value: 'a', count: 1 },
        { value: 'b', count: 2 },
      ],
    });
    mountComponent(state);
  });
  it('Load column stats after filter has changed for checkbox fields', () => {
    assertGetColumnStatsWasCalled(store);
  });
  it('Checkbox component is displayed', () => {
    cy.get('[data-cy="categoryFilterCheckbox-a"]').should('exist');
  });
});

describe('Expanded column after another column has updated - Freetext', () => {
  beforeEach(() => {
    const state = createState({
      ...baseStringColumn,
      isExpanded: true,
      filterHasUpdated: true,
      values: [{ value: 'a', count: 1 }],
      originalValues: [
        { value: 'a', count: 1 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
        { value: 'b', count: 2 },
      ],
    });
    mountComponent(state);
  });
  it('Load column stats should NOT run after filter has changed for Free text fields', () => {
    assertGetColumnStatsWasNotCalled(store);
  });
  it('Freetext dropdown component is displayed', () => {
    cy.get('[id="autocomplete-variant_id"]').should('exist');
  });
});

describe('Loading component is correctly displayed', () => {
  beforeEach(() => {
    const state = createState({
      ...baseStringColumn,
      isLoading: true,
      isExpanded: true,
      filterHasUpdated: true,
      values: [{ value: 'a', count: 1 }],
      originalValues: [
        { value: 'a', count: 1 },
        { value: 'b', count: 2 },
      ],
    });
    mountComponent(state);
  });
  it('Loading spinner is displayed', () => {
    cy.get('circle').should('exist');
  });
});

const assertGetColumnStatsWasNotCalled = (store: MockStoreEnhanced<unknown, unknown>) => {
  expect(
    store
      .getActions()
      .map((a) => a.type)
      .indexOf(ActionTypes.GET_COLUMN_STATS),
  ).to.be.eq(-1);
};

const assertGetColumnStatsWasCalled = (store: MockStoreEnhanced<unknown, unknown>) => {
  expect(
    store
      .getActions()
      .map((a) => a.type)
      .indexOf(ActionTypes.GET_COLUMN_STATS),
  ).to.be.greaterThan(-1);
};
