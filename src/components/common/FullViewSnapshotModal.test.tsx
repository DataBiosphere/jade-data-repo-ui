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
import { initialSnapshotState } from 'reducers/snapshot';
import { initialDatasetState } from 'reducers/dataset';
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';

const initialState = {
  snapshots: initialSnapshotState,
  datasets: initialDatasetState,
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
  cy.intercept('GET', '/api/resources/v1/profiles?offset=0&limit=1000');

  cy.intercept('GET', 'https://sam.dsde-dev.broadinstitute.org/api/groups/v1');

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

  it('allows clicking through steps', () => {
    cy.contains('Snapshot Name').should('be.visible');
    cy.get('[data-cy=next-step-button]').click();
    cy.contains('Roles').should('be.visible');
    cy.get('[data-cy=next-step-button]').click();
    cy.contains('Authorization Domain').should('be.visible');
    cy.get('[data-cy=next-step-button]').click();
    cy.intercept('POST', '/api/repository/v1/snapshots');
  });

  it('allows selecting a billing profile', () => {
    cy.get('#billing-profile-select').parent().click();
    cy.get('[data-cy=menuItem-profile2]').click();
    cy.get('#billing-profile-select').should('have.value', 'profile2');
  });

  it('allows selecting an auth domain', () => {
    cy.get('button').contains('Additional Security Options').click();
    cy.get('#select-authorization-domain-select').parent().click();
    cy.get('[data-cy=menuItem-group2]').click();
    cy.get('#select-authorization-domain-select').should('have.value', 'group2');
  });

  it('allows changing the name and description', () => {
    cy.get('#snapshot-name').clear();
    cy.get('#snapshot-name').type('New Name');
    cy.get('#snapshot-description').clear();
    cy.get('#snapshot-description').type('New Description');
    cy.get('#snapshot-name').should('have.value', 'New Name');
    cy.get('#snapshot-description').should('have.value', 'New Description');
  });
});
