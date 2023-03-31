import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import moment from 'moment';
import history from '../../../modules/hist';
import globalTheme from '../../../modules/theme';
import SnapshotOverviewPanel from './SnapshotOverviewPanel';

const duosFirecloudGroup = {
  duosId: 'Test DUOS ID',
  lastSynced: '2022-04-04T18:53:45.158566Z',
};

const snapshot = {
  id: 'uuid',
  name: 'Test snapshot',
  description: 'Test description',
  createdDate: '2022-04-04T18:53:45.158566Z',
  source: [
    {
      dataset: {
        id: 'datasetId',
        name: 'SourceDataset',
        storage: [
          { cloudResource: 'bigquery', region: 'us-east4' },
          { cloudResource: 'firestore', region: 'us-east4' },
          { cloudResource: 'bucket', region: 'us-east4' },
        ],
      },
    },
  ],
  duosFirecloudGroup,
};

const initialState = {
  snapshots: {
    pendingSave: {
      consentCode: false,
      description: false,
      duosDataset: false,
    },
    snapshot,
    snapshotPolicies: [
      {
        name: 'steward',
        members: ['steward@gmail.com'],
      },
      {
        name: 'reader',
        members: ['reader@gmail.com'],
      },
      {
        name: 'discoverer',
        members: [],
      },
    ],
    userRoles: ['steward', 'reader'],
    exportIsProcessing: false,
    exportIsDone: false,
    exportResponse: {},
  },
  configuration: {
    configObject: {
      terraUrl: 'https://dev-terra.org',
    },
  },
};

describe('Snapshot overview panel', () => {
  beforeEach(() => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotOverviewPanel
              dispatch={store.dispatch}
              pendingSave={initialState.snapshots.pendingSave}
              snapshot={snapshot}
              userRoles={initialState.snapshots.userRoles}
            />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });
  it('Displays snapshot info', () => {
    cy.get('[data-cy="snapshot-summary-tab"]')
      .should('contain.text', 'Snapshot Summary')
      .should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="description-editable-field-view"] [data-cy="react-markdown-text"]').should(
      'contain.text',
      snapshot.description,
    );
    cy.get('[data-cy="duos-id-editable-field-view"] [data-cy="react-markdown-text"]').should(
      'contain.text',
      snapshot.duosFirecloudGroup.duosId,
    );
    cy.get('[data-cy="snapshot-source-dataset"]').should(
      'contain.text',
      snapshot.source[0].dataset.name,
    );
    cy.get('[data-cy="snapshot-date-created"]').should(
      'contain.text',
      moment(snapshot.createdDate).fromNow(),
    );
    cy.get('[data-cy="storage-resource"]').then(($resource) => {
      expect($resource[0]).to.contain('bigquery: us-east4');
      expect($resource[1]).to.contain('firestore: us-east4');
      expect($resource[2]).to.contain('bucket: us-east4');
    });
  });
});
