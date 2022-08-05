import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../../../modules/hist';
import globalTheme from '../../../modules/theme';
import SnapshotExport from './SnapshotExport';

const snapshot = {
  id: 'uuid',
  name: 'Snapshot',
};

const configuration = {
  configObject: {
    terraUrl: 'https://bvdp-saturn-dev.appspot.com/',
  },
};

let mockStore: any;
describe('SnapshotExport', () => {
  beforeEach(() => {
    mockStore = createMockStore([]);
  });
  it('Test has export button', () => {
    const initialState = {
      snapshots: {
        snapshot,
        exportIsProcessing: false,
        exportIsDone: false,
        exportResponse: {},
        userRoles: ['steward'],
      },
      configuration,
    };
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotExport of={snapshot} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy="export-snapshot-button"]').should('contain.text', 'Export snapshot');
  });
  it('Test has export button disabled', () => {
    const initialState = {
      snapshots: {
        snapshot,
        exportIsProcessing: false,
        exportIsDone: false,
        exportResponse: {},
        userRoles: ['reader'],
      },
      configuration,
    };
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotExport of={snapshot} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy="export-snapshot-button"]').should('be.disabled');
  });
  it('Test preparing snapshot', () => {
    const preparingSnapshotState = {
      snapshots: {
        exportIsProcessing: true,
        exportIsDone: false,
        exportResponse: {},
        userRoles: ['steward'],
      },
      configuration,
    };
    const store = mockStore(preparingSnapshotState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotExport of={snapshot} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy="preparing-snapshot-button"]').should('contain.text', 'Preparing snapshot');
  });
  it('Test snapshot ready to export', () => {
    const readyForExportState = {
      snapshots: {
        exportIsProcessing: false,
        exportIsDone: true,
        exportResponse: {
          format: {
            parquet: {
              manifest: 'manifest',
            },
          },
        },
        userRoles: ['steward'],
      },
      configuration,
    };
    const store = mockStore(readyForExportState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotExport of={snapshot} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy="snapshot-export-ready-button"]')
      .should('contain.text', 'Snapshot ready - continue')
      .within(() => {
        cy.get('a').should('have.attr', 'href').and('include', configuration.configObject.terraUrl);
      });
  });
});
