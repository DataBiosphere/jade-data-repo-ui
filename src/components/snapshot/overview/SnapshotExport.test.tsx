import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../../../modules/hist';
import globalTheme from '../../../modules/theme';
import SnapshotExport from './SnapshotExport';
import { SnapshotModel } from '../../../generated/tdr';

const snapshot: SnapshotModel = {
  id: 'uuid',
  name: 'Snapshot',
  cloudPlatform: 'gcp',
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
  it('Test steward can export with permission sync', () => {
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
    cy.get('[data-cy="tdr-sync-permissions-checkbox"] input')
      .should('not.be.disabled')
      .and('be.checked');
  });
  it('Test reader can export without permission sync', () => {
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
    cy.get('[data-cy="export-snapshot-button"]').should('contain.text', 'Export snapshot');
    cy.get('[data-cy="tdr-sync-permissions-checkbox"] input')
      .should('be.disabled')
      .and('not.be.checked');
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
        cy.get('a')
          .should('have.attr', 'href')
          .and('include', configuration.configObject.terraUrl)
          .and('include', 'tdrSyncPermissions=true');
      });
  });
});
