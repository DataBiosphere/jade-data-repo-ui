import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import { routerMiddleware } from 'connected-react-router';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import React from 'react';
import { TableColumnType } from 'reducers/query';
import RangeFilter from './RangeFilter';
import globalTheme from '../../../../../modules/theme';
import history from '../../../../../modules/hist';
import { ActionTypes } from '../../../../../constants';

function createState(column: TableColumnType): any {
  return {
    datasets: {
      dataset: {
        description: 'A dataset description',
        phsId: '12345',
      },
    },
    column,
  };
}

const baseStringColumn = {
  name: 'p_value',
  label: 'p_value',
};

let store: MockStoreEnhanced<unknown, unknown>;
const filterMap = { type: 'range', value: [0, 534] };

function mountComponent(state: any) {
  const mockStore = createMockStore([routerMiddleware(history)]);
  store = mockStore(state);
  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <RangeFilter
            key={state.column.name}
            column={state.column}
            filterMap={filterMap}
            handleChange={() => null}
            handleFilters={() => null}
            tableName="tableName"
          />
        </ThemeProvider>
      </Router>
    </Provider>,
  );
}

describe('Initial load of RangeFilter', () => {
  beforeEach(() => {
    const initialState = createState({ ...baseStringColumn, isExpanded: false });
    mountComponent(initialState);
  });
  it('should have NOT loaded column stats', () => {
    assertGetColumnStatsWasNotCalled();
  });
  it('No values are returned, so component should not be displayed', () => {
    cy.get('circle').should('not.exist');
  });
});

describe('First expansion of column', () => {
  beforeEach(() => {
    const state = createState({ ...baseStringColumn, isExpanded: true });
    mountComponent(state);
  });
  it('Load column stats on first load', () => {
    assertGetColumnStatsWasCalled();
  });
});

describe('Handle empty field', () => {
  beforeEach(() => {
    const state = createState({ ...baseStringColumn, isExpanded: true, isLoading: false });
    mountComponent(state);
  });
  it('should have have attempted to load column stats', () => {
    assertGetColumnStatsWasCalled();
  });
  it('Empty column text should appear', () => {
    cy.get('[data-cy="empty-column-message"]').should('exist');
  });
});

describe('Expanded column after another column has updated', () => {
  beforeEach(() => {
    const state = createState({
      ...baseStringColumn,
      isExpanded: true,
      filterHasUpdated: true,
      minValue: 1,
      maxValue: 534,
    });
    mountComponent(state);
  });
  it('Do not reload column stats after filter has changed for numeric range field', () => {
    assertGetColumnStatsWasNotCalled();
  });
  it('Range component is displayed', () => {
    cy.get('[aria-labelledby="range-slider"]').should('exist');
  });
});

describe('Loading component is correctly displayed', () => {
  beforeEach(() => {
    const state = createState({
      ...baseStringColumn,
      isLoading: true,
      isExpanded: true,
      filterHasUpdated: true,
    });
    mountComponent(state);
  });
  it('Loading spinner is displayed', () => {
    cy.get('circle').should('exist');
  });
});

const assertGetColumnStatsWasNotCalled = () => {
  expect(
    store
      .getActions()
      .map((a) => a.type)
      .indexOf(ActionTypes.GET_COLUMN_STATS),
  ).to.be.eq(-1);
};

const assertGetColumnStatsWasCalled = () => {
  expect(
    store
      .getActions()
      .map((a) => a.type)
      .indexOf(ActionTypes.GET_COLUMN_STATS),
  ).to.be.greaterThan(-1);
};
