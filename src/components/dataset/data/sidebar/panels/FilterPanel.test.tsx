import createMockStore from 'redux-mock-store';
import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import globalTheme from 'modules/theme';
import React from 'react';
import { FilterPanel } from 'components/dataset/data/sidebar/panels/FilterPanel';

const initialState = {
  datasets: {},
  profiles: {
    profiles: [],
  },
  snapshots: {},
  user: {
    groups: [],
  },
  query: {
    columns: [],
    filterData: {},
    resultsCount: 0,
  },
};
describe('FilterPanel', () => {
  beforeEach(() => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);

    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <FilterPanel dispatch={() => {}} classes={{}} columns={[]} dataset={{ schema: {} }} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });
  it('shows the button "Create Full View Snapshot" appears on the FilterPanel', () => {
    cy.contains('Create Full View Snapshot').should('be.visible');
  });
});
