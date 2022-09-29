import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import history from '../../../modules/hist';
import globalTheme from '../../../modules/theme';
import SnapshotWorkspace from './SnapshotWorkspace';

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
};

const accessibleWorkspaces = [
  {
    workspaceId: '1234',
    workspaceName: 'An amazing workspace',
    workspaceLink: 'http://127.0.0.1',
    workspacePolicies: [
      {
        name: 'policy 1',
        members: ['user1@aol', 'user2@aol'],
      },
      {
        name: 'policy 2',
        members: ['user3@aol', 'user4@aol'],
      },
    ],
  },
];

const inaccessibleWorkspaces = [
  {
    workspaceId: '4567',
    workspaceName: null,
    workspaceLink: null,
    workspacePolicies: [
      {
        name: 'policy 1',
        members: ['user1@gmail', 'user2@gmail'],
      },
      {
        name: 'policy 2',
        members: ['user3@gmail', 'user4@gmail'],
      },
    ],
  },
];

const initialState = {
  snapshots: {
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
    snapshotWorkspaces: accessibleWorkspaces,
    snapshotInaccessibleWorkspaces: inaccessibleWorkspaces,
  },
  configuration: {
    configObject: {
      terraUrl: 'https://dev-terra.org',
    },
  },
};

describe('Snapshot workspace accordion - with workspace entries', () => {
  before(() => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotWorkspace />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });
  it('Displays accordion and workspaces', () => {
    cy.get('[data-cy="snapshot-workspace-accordion"]').should(
      'contain.text',
      'Workspaces with this snapshot',
    );
    cy.get('[data-cy="snapshot-workspace-list"]').children().should('have.length', 4);
    cy.get('[data-cy="snapshot-workspace-list"]').find('li').should('have.length', 2);
    cy.get('.MuiListItemButton-root').should('contain', 'An amazing workspace');
    cy.get('.MuiListItemText-root > .MuiTypography-root').should('contain', 'Workspace ID 4567');
  });
});

describe('Snapshot workspace accordion - without workspace entries', () => {
  before(() => {
    const initialStateWithoutWorkspaces = initialState;
    initialStateWithoutWorkspaces.snapshots.snapshotWorkspaces = [];
    initialStateWithoutWorkspaces.snapshots.snapshotInaccessibleWorkspaces = [];
    const mockStore = createMockStore([]);
    const store = mockStore(initialStateWithoutWorkspaces);
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <SnapshotWorkspace />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
  });
  it('Displays accordion and lists no workspaces', () => {
    cy.get('[data-cy="snapshot-workspace-accordion"]').should(
      'contain.text',
      'Workspaces with this snapshot',
    );
    cy.get('.MuiAccordionDetails-root > .MuiTypography-root').should(
      'contain.text',
      'Not used by any workspaces.',
    );
  });
});
