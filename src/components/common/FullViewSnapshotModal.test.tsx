import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { BillingProfileModel, DatasetModel } from 'generated/tdr';
import _ from 'lodash';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import { ManagedGroupMembershipEntry } from 'models/group';
import FullViewSnapshotModal from 'components/common/FullViewSnapshotModal';
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';

const initialState = {
  snapshots: {
    snapshot: {
      id: 'uuid',
      name: 'Test Snapshot',
    },
  },
  user: _.cloneDeep(initialUserState),
  query: _.cloneDeep(initialQueryState),
  router: { location: {} },
};

const mountFullViewSnapshotModal = (
  dataset: DatasetModel,
  billingProfiles: Array<BillingProfileModel>,
  userGroups: Array<ManagedGroupMembershipEntry>,
) => {
  const mockStore = createMockStore([]);
  const store = mockStore({
    ...initialState,
    profiles: { profiles: billingProfiles },
    user: { userGroups },
  });

  // Intercept the getBillingProfiles API call onMount
  cy.intercept('GET', '/api/resources/v1/profiles?offset=0&limit=1000').as('getBillingProfiles');

  cy.intercept('GET', 'https://sam.dsde-dev.broadinstitute.org/api/groups/v1').as('getUserGroups');

  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <FullViewSnapshotModal dataset={dataset} modalOpen={true} onDismiss={() => {}} />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
};

describe('FullViewSnapshotModal', () => {
  beforeEach(() => {
    const dataset = { defaultProfileId: 'profile1' };
    const profiles = [
      { id: 'profile1', profileName: 'profile1' },
      { id: 'profile2', profileName: 'profile2' },
    ];
    const userGroups = [
      { groupEmail: 'group1', groupName: 'group1', role: 'READER' },
      { groupEmail: 'group2', groupName: 'group2', role: 'READER' },
    ];
    mountFullViewSnapshotModal(dataset, profiles, userGroups);
  });

  it('Button is clickable and opens billing profile modal', () => {
    cy.get('button').click();
    cy.contains('Creating snapshot - select a billing project').should('be.visible');
    cy.get('[data-cy=select-billing-profile-button]').click();
    cy.intercept('POST', '/api/repository/v1/snapshots');
  });

  it('calls create snapshot when billing profile is selected', () => {
    cy.get('button').click();
    cy.get('[data-cy=select-billing-profile-button]').click();
    cy.intercept('POST', '/api/repository/v1/snapshots');
  });

  it('allows selecting a billing profile', () => {
    cy.get('button').click();
    cy.get('#billing-profile-select').parent().click();
    cy.get('[data-cy=menuItem-profile2]').click();
    cy.get('#billing-profile-select').should('have.value', 'profile2');
  });

  it('allows selecting an auth domain', () => {
    cy.get('button').click();
    cy.get('#select-authorization-domain-select').parent().click();
    cy.get('[data-cy=menuItem-group2]').click();
    cy.get('#select-authorization-domain-select').should('have.value', 'group2');
  });

  it('allows changing the name and description', () => {
    cy.get('button').click();
    cy.get('#snapshot-name').clear().type('New Name');
    cy.get('#snapshot-description').clear().type('New Description');
    cy.get('#snapshot-name').should('have.value', 'New Name');
    cy.get('#snapshot-description').should('have.value', 'New Description');
  });
});
