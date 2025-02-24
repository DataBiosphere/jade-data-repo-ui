import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import globalTheme from 'modules/theme';
import React from 'react';
import createMockStore from 'redux-mock-store';
import _ from 'lodash';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import {
  CreateModalSteps,
  CreateModalStepsProps,
} from 'components/common/FullViewSnapshotModal/CreateModalSteps';
import { FullViewSnapshotModalSteps } from 'components/common/FullViewSnapshotModal/constants';

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

function mountCreateModalSteps(props: CreateModalStepsProps) {
  const mockStore = createMockStore([]);
  const store = mockStore({
    ...initialState,
  });
  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <CreateModalSteps {...props} />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
}

describe('CreateModalSteps', () => {
  it('allows selecting details', () => {
    mountCreateModalSteps({
      step: FullViewSnapshotModalSteps.SECURITY,
      onStepChange: cy.stub().as('onStepChange'),
    });
    cy.get('button').contains('Basic Information and Billing').click();
    cy.get('@onStepChange').should('be.calledWith', FullViewSnapshotModalSteps.DETAILS);
  });
  it('allows selecting sharing', () => {
    mountCreateModalSteps({
      step: FullViewSnapshotModalSteps.DETAILS,
      onStepChange: cy.stub().as('onStepChange'),
    });
    cy.get('button').contains('Sharing').click();
    cy.get('@onStepChange').should('be.calledWith', FullViewSnapshotModalSteps.SHARING);
  });
  it('allows selecting security options', () => {
    mountCreateModalSteps({
      step: FullViewSnapshotModalSteps.DETAILS,
      onStepChange: cy.stub().as('onStepChange'),
    });
    cy.get('button').contains('Additional Security Options').click();
    cy.get('@onStepChange').should('be.calledWith', FullViewSnapshotModalSteps.SECURITY);
  });
});
