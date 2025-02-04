import createMockStore from 'redux-mock-store';
import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import globalTheme from 'modules/theme';
import React from 'react';
import DatasetOverviewPanel from 'components/dataset/overview/DatasetOverviewPanel';

const initialState = {
  datasets: {
    dataset: {
      id: 'uuid',
      name: 'Test Dataset',
      description: 'Test Description',
      schema: {
        relationships: [],
      },
    },
    userRoles: [],
    pendingSave: {},
  },
  profiles: {
    profiles: [],
  },
  snapshots: {
    snapshots: [],
  },
  user: {
    groups: [],
  },
  query: {
    orderDirection: 'asc',
  },
};
describe('DatasetOverviewPanel', () => {
  beforeEach(() => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);

    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <DatasetOverviewPanel />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });
  it('shows the button "Create Full View Snapshot" appears on the Snapshots page', () => {
    const snapshotsTab = cy.contains('Snapshots');
    snapshotsTab.click();
    cy.contains('Create Full View Snapshot').should('be.visible');
  });
});
