import { Provider } from 'react-redux';
import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { routerMiddleware } from 'connected-react-router';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import React from 'react';
import globalTheme from '../../../../../modules/theme';
import history from '../../../../../modules/hist';
import FreetextFilter from './FreetextFilter';

function createState(filterMap: any, values: any): any {
  return {
    datasets: {
      dataset: {
        description: 'A dataset description',
        phsId: '12345',
      },
    },
    column: {
      name: 'column1',
      label: 'column1',
    },
    filterMap,
    values,
  };
}

let store: MockStoreEnhanced<unknown, unknown>;

function mountComponent(state: any) {
  const mockStore = createMockStore([routerMiddleware(history)]);
  store = mockStore(state);
  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <FreetextFilter
            classes={{ listItem: 'listItemClass', chip: 'chipClass' }}
            column={state.column}
            filterMap={state.filterMap}
            handleChange={() => null}
            handleFilters={() => null}
            toggleExclude={() => null}
            values={state.values}
          />
        </ThemeProvider>
      </Router>
    </Provider>,
  );
}

describe('Free text list that includes null value', () => {
  beforeEach(() => {
    const filterMap = {
      value: [null, '1:100891126:A:G'],
      type: 'value',
      exclude: false,
    };
    const values = [{ value: null }, { value: '1:100891126:A:G' }, { value: '2:100891126:A:G' }];
    const initialState = createState(filterMap, values);
    mountComponent(initialState);
  });
  it('Load Free text dropdown', () => {
    cy.get('[id="autocomplete-column1"]').should('exist').click();
    cy.get('#autocomplete-column1-option-0').should('contain.text', '(empty)');
    cy.get('#autocomplete-column1-option-1').should('contain.text', '1:100891126:A:G');
  });
});
