import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import createMockStore from 'redux-mock-store';
import React from 'react';
import _ from 'lodash';
import JobView from './JobView';
import globalTheme from '../modules/theme';
import history from '../modules/hist';
import { initialJobState } from 'reducers/job';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import { JobModelJobStatusEnum } from 'generated/tdr';

const initialState = {
  searchString: '',
  jobs: _.cloneDeep(initialJobState),
  user: _.cloneDeep(initialUserState),
  query: _.cloneDeep(initialQueryState),
};

beforeEach(() => {
  const mockStore = createMockStore([]);
  const store = mockStore(initialState);
  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <JobView searchString={initialState.searchString} />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
});

describe('JobView', () => {
  it('should have the bones of the basic table', () => {
    cy.get('table').should('exist');
  });

  it('should expose table columns for data', () => {
    cy.get('th[data-cy="columnHeader-id"]').should('exist');
    cy.get('th[data-cy="columnHeader-class_name"]').should('exist');
    cy.get('th[data-cy="columnHeader-description"]').should('exist');
    cy.get('th[data-cy="columnHeader-submitted"]').should('exist');
    cy.get('th[data-cy="columnHeader-job_status"]').should('exist');
  });

  it('should make a request for jobs', () => {

  });

  it('should show the jobs', () => {
    initialState.jobs.jobs = [
      {
        id: 'testingId',
        job_status: JobModelJobStatusEnum.Succeeded,
        status_code: 200,
      }
    ];
  });

});
