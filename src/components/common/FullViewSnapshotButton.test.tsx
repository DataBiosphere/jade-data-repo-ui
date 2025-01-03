import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
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
  profiles: {
    profiles: [{ id: 'profile1', name: 'Test Profile 1' }],
  },
};

const mountFullViewSnapshotButton = (dataset) => {
  const mockStore = createMockStore([]);
  const store = mockStore(initialState);

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
      mountFullViewSnapshotButton(dataset);
    });

    it('Displays the button with correct text', () => {
      cy.get('button').should('contain.text', 'Create Full-View Snapshot');
    });

    it('Button is clickable and calls createSnapshot', () => {
      cy.get('button').click();
      cy.intercept('POST', '/api/repository/v1/snapshots');
    });
  });

  describe('FullViewSnapshotButton component without permission', () => {
    beforeEach(() => {
      const dataset = { defaultProfileId: 'profile2' };
      mountFullViewSnapshotButton(dataset);
    });

    it('Button is disabled and has tooltip with the no access message', () => {
      cy.get('button').should('be.disabled');
      cy.get('button').trigger('mouseover', { force: true });
      cy.contains(
        'You do not have access to the billing profile associated with this dataset.',
      ).should('be.visible');
    });
  });

  describe('FullViewSnapshotButton component without default billing profile', () => {
    beforeEach(() => {
      const dataset = { defaultProfileId: null };
      mountFullViewSnapshotButton(dataset);
    });

    it('Button is disabled and has tooltip with the no billing profile message', () => {
      cy.get('button').should('be.disabled');
      cy.get('button').trigger('mouseover', { force: true });
      cy.contains('There is no default billing profile associated with this dataset.').should(
        'be.visible',
      );
    });
  });
});
