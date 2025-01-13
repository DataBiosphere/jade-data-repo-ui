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
import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import FullViewSnapshotButton from './FullViewSnapshotButton';

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

const mountFullViewSnapshotButton = (
  dataset: DatasetModel,
  billingProfiles: Array<BillingProfileModel>,
) => {
  const mockStore = createMockStore([]);
  const store = mockStore({ ...initialState, profiles: { profiles: billingProfiles } });

  // Intercept the getBillingProfiles API call onMount
  cy.intercept('GET', '/api/resources/v1/profiles?offset=0&limit=1000').as('getBillingProfiles');

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
      mountFullViewSnapshotButton(dataset, profiles);
    });

    it('Displays the button with correct text', () => {
      cy.get('button').should('contain.text', 'Create Full View Snapshot');
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
  });

  describe('FullViewSnapshotButton component without permission', () => {
    beforeEach(() => {
      const dataset = { defaultProfileId: 'profile2' };
      const profiles: BillingProfileModel[] = [];
      mountFullViewSnapshotButton(dataset, profiles);
    });

    it('Button is disabled and has tooltip with the no access message', () => {
      cy.get('button').should('be.disabled');
      cy.get('button').trigger('mouseover', { force: true });
      cy.contains('You do not have access to any billing profiles to create a snapshot').should(
        'be.visible',
      );
    });
  });

  describe('FullViewSnapshotButton component without default billing profile', () => {
    beforeEach(() => {
      const dataset = {};
      const profiles = [
        { id: 'profile1', profileName: 'profile1' },
        { id: 'profile2', profileName: 'profile2' },
      ];
      mountFullViewSnapshotButton(dataset, profiles);
    });

    it('Button is disabled and has tooltip with the no billing profile message', () => {
      cy.get('button').click();
    });
  });
});
