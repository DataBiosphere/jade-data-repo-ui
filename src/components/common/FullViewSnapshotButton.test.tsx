import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { BillingProfileModel, DatasetModel } from 'generated/tdr';
import _ from 'lodash';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import { ManagedGroupMembershipEntry } from 'models/group';
import { initialSnapshotState } from 'reducers/snapshot';
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import FullViewSnapshotButton from './FullViewSnapshotButton';

const initialState = {
  snapshots: initialSnapshotState,
  user: _.cloneDeep(initialUserState),
  query: _.cloneDeep(initialQueryState),
  router: { location: {} },
};

const mountFullViewSnapshotButton = (
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
          <FullViewSnapshotButton dataset={dataset} />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
};

describe('FullViewSnapshotButton', () => {
  describe('FullViewSnapshotButton component with permission', () => {
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
      mountFullViewSnapshotButton(dataset, profiles, userGroups);
    });

    it('Displays the button with correct text', () => {
      cy.get('button').should('contain.text', 'Create Full View Snapshot');
    });

    it('Button is clickable and opens billing profile modal', () => {
      cy.get('button').click();
      cy.contains('Creating snapshot').should('be.visible');
    });
  });

  describe('FullViewSnapshotButton component without permission', () => {
    it('Button is disabled and has tooltip with the no access message', () => {
      const dataset = { defaultProfileId: 'profile2' };
      const profiles: BillingProfileModel[] = [];
      const groups: ManagedGroupMembershipEntry[] = [
        { groupEmail: 'group1', groupName: 'group1', role: 'READER' },
      ];
      mountFullViewSnapshotButton(dataset, profiles, groups);
      cy.get('button').should('be.disabled');
      cy.get('button').trigger('mouseover', { force: true });
      cy.contains('You do not have access to any billing profiles to create a snapshot').should(
        'be.visible',
      );
    });
  });
});
