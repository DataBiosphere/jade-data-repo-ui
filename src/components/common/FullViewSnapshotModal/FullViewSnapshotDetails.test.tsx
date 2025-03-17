import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import globalTheme from 'modules/theme';
import React from 'react';
import {
  FullViewSnapshotDetails,
  FullViewSnapshotDetailsProps,
} from 'components/common/FullViewSnapshotModal/FullViewSnapshotDetails';
import createMockStore from 'redux-mock-store';
import _ from 'lodash';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';

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

function mountFullViewSnapshotDetails(props: FullViewSnapshotDetailsProps) {
  const mockStore = createMockStore([]);
  const store = mockStore({
    ...initialState,
  });
  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <FullViewSnapshotDetails {...props} />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
}

describe('FullViewSnapshotDetails', () => {
  it('allows changing the name and description', () => {
    const profiles = [
      { id: 'profile1', profileName: 'profile1' },
      { id: 'profile2', profileName: 'profile2' },
    ];
    mountFullViewSnapshotDetails({
      snapshotName: 'Test Name',
      setSnapshotName: cy.stub().as('setSnapshotName'),
      snapshotDescription: 'Test Description',
      setSnapshotDescription: cy.stub().as('setSnapshotDescription'),
      selectedBillingProfile: profiles[0],
      setSelectedBillingProfile: cy.stub().as('setSelectedBillingProfile'),
      billingProfiles: profiles,
    });
    cy.get('#snapshot-name').clear();
    cy.get('#snapshot-description').clear();
    cy.get('#billing-profile-select').parent().click();
    cy.get('[data-cy=menuItem-profile2]').click();
    cy.get('@setSnapshotName').should('be.calledWith', '');
    cy.get('@setSnapshotDescription').should('be.calledWith', '');
    cy.get('@setSelectedBillingProfile').should('be.calledWith', profiles[1]);
  });
});
