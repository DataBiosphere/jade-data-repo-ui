import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import moment from 'moment';
import history from '../../../modules/hist';
import globalTheme from '../../../modules/theme';
import SnapshotOverviewPanel from './SnapshotOverviewPanel';
import { DatasetModel, DuosFirecloudGroupModel, SnapshotModel } from '../../../generated/tdr';
import { DuosDatasetModel } from '../../../reducers/duos';

const duosId = 'DUOS-0002';
const lastSynced = '2022-04-04T18:53:45.158566Z';

const dataset: DatasetModel = {
  id: 'datasetId',
  name: 'SourceDataset',
  storage: [
    { cloudResource: 'bigquery', region: 'us-east4' },
    { cloudResource: 'firestore', region: 'us-east4' },
    { cloudResource: 'bucket', region: 'us-east4' },
  ],
};

const duosDatasets: Array<DuosDatasetModel> = [
  { dataSetId: 1, datasetName: 'DS1', datasetIdentifier: 'DUOS-0001' },
  { dataSetId: 2, datasetName: 'DS2', datasetIdentifier: 'DUOS-0002' },
  { dataSetId: 3, datasetName: 'DS3', datasetIdentifier: 'DUOS-0003' },
];

function createSnapshot(duosFirecloudGroup?: DuosFirecloudGroupModel): SnapshotModel {
  return {
    id: 'uuid',
    name: 'Test snapshot',
    description: 'Test description',
    createdDate: '2022-04-04T18:53:45.158566Z',
    source: [{ dataset }],
    duosFirecloudGroup,
  };
}

function createInitialState(snapshot?: SnapshotModel): any {
  return {
    snapshots: {
      snapshotAuthDomains: ['authdomain1', 'authdomain2', 'authdomain3'],
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
}

function mockSnapshotOverviewPanel(snapshot: any): any {
  const mockStore = createMockStore([]);
  const initialState = createInitialState(snapshot);
  const store = mockStore(initialState);
  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <SnapshotOverviewPanel
            dispatch={store.dispatch}
            duosDatasets={duosDatasets}
            pendingSave={initialState.snapshots.pendingSave}
            snapshot={snapshot}
            userRoles={initialState.snapshots.userRoles}
          />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
}

describe('Snapshot overview panel', () => {
  it('Displays snapshot info', () => {
    const duosFirecloudGroup = { duosId, lastSynced };
    const snapshot = createSnapshot(duosFirecloudGroup);
    mockSnapshotOverviewPanel(snapshot);
    cy.get('[data-cy="snapshot-summary-tab"]')
      .should('contain.text', 'Snapshot Summary')
      .should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="description-editable-field-view"] [data-cy="react-markdown-text"]').should(
      'contain.text',
      snapshot.description,
    );
    cy.get('[data-cy="duos-id-editable-field-view"] input').should(
      'contain.value',
      'DUOS-0002 - DS2',
    );
    cy.get('[data-cy="snapshot-duos-last-synced"]').should(
      'contain.text',
      moment(lastSynced).fromNow(),
    );
    cy.get('[data-cy="snapshot-source-dataset"]').should('contain.text', dataset.name);
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
  it('Handles missing DUOS link', () => {
    const snapshot = createSnapshot();
    mockSnapshotOverviewPanel(snapshot);
    cy.get('[data-cy="duos-id-editable-field-view"] input').should('contain.value', '');
    cy.get('[data-cy="snapshot-duos-last-synced"]').should('not.exist');
  });
  it('Handles unsynced linked DUOS group', () => {
    const unsyncedDuosFirecloudGroup = { duosId };
    const snapshot = createSnapshot(unsyncedDuosFirecloudGroup);
    mockSnapshotOverviewPanel(snapshot);
    cy.get('[data-cy="duos-id-editable-field-view"] input').should(
      'contain.value',
      'DUOS-0002 - DS2',
    );
    cy.get('[data-cy="snapshot-duos-last-synced"]').should('contain.text', 'Never');
  });
});
