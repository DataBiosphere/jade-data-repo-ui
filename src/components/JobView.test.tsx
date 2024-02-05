import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import createMockStore from 'redux-mock-store';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import { JobModelJobStatusEnum } from 'generated/tdr';
import { routerMiddleware } from 'connected-react-router';
import JobView from './JobView';
import globalTheme from '../modules/theme';
import history from '../modules/hist';
import JobResultModal from './job/JobResultModal';

const testDate = new Date();
const initialState = {
  searchString: '',
  jobs: {
    jobs: [
      {
        id: 'testingId1',
        job_status: JobModelJobStatusEnum.Failed,
        status_code: 200,
        description: 'the first pancake always burns',
        class_name: 'this.is.fake.class1',
        submitted: testDate.toISOString(),
        completed: moment(testDate).add(2, 'seconds').toISOString(),
      },
      {
        id: 'testingId2',
        job_status: JobModelJobStatusEnum.Succeeded,
        status_code: 200,
        description: 'Ingest from source.json to ArraysInputsTable in dataset id (uuid)',
        class_name: 'this.is.fake.class2',
        submitted: moment(testDate).subtract(2, 'minutes').toISOString(),
        completed: moment(testDate).subtract(1, 'minutes').toISOString(),
      },
      {
        id: 'testingId3',
        job_status: JobModelJobStatusEnum.Running,
        status_code: 200,
        class_name: 'this.is.fake.class3',
        submitted: moment(testDate).subtract(4, 'minutes').toISOString(),
        completed: undefined,
      },
    ],
  },
  user: _.cloneDeep(initialUserState),
  query: _.cloneDeep(initialQueryState),
  router: { location: {} },
};

beforeEach(() => {
  const mockStore = createMockStore([routerMiddleware(history)]);
  const store = mockStore(initialState);
  momentDurationFormatSetup(moment as any);
  mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <JobView searchString={initialState.searchString} />
        </ThemeProvider>
      </Router>
    </Provider>,
  );
});

describe('JobView', () => {
  it('should have the bones of the basic table', () => {
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length', initialState.jobs.jobs.length);
  });

  it('should expose table columns for data', () => {
    cy.get('th[data-cy="columnHeader-id"]').should('exist');
    cy.get('th[data-cy="columnHeader-class_name"]').should('exist');
    cy.get('th[data-cy="columnHeader-description"]').should('exist');
    cy.get('th[data-cy="columnHeader-submitted"]').should('exist');
    cy.get('th[data-cy="columnHeader-job_status"]').should('exist');
    cy.get('th[data-cy="columnHeader-job_duration"]').should('exist');
  });

  it('should show failed jobs', () => {
    cy.get('tbody tr').eq(0).children().should('have.length', 6);
    cy.get('tbody tr').eq(0).children().eq(0).should('have.text', 'testingId1');
    cy.get('tbody tr').eq(0).children().eq(1).should('have.text', 'class1');
    cy.get('tbody tr')
      .eq(0)
      .children()
      .eq(2)
      .should('have.text', initialState.jobs.jobs[0].description);
    cy.get('tbody tr').eq(0).children().eq(3).should('have.text', 'a few seconds ago');
    cy.get('tbody tr').eq(0).children().eq(4).should('have.text', 'Failed');
    cy.get('tbody tr').eq(0).children().eq(5).should('have.text', '2 secs');
  });

  it('should show successful jobs', () => {
    cy.get('tbody tr').eq(1).children().should('have.length', 6);
    cy.get('tbody tr').eq(1).children().eq(0).should('have.text', 'testingId2');
    cy.get('tbody tr').eq(1).children().eq(1).should('have.text', 'class2');
    cy.get('tbody tr')
      .eq(1)
      .children()
      .eq(2)
      .should('have.text', initialState.jobs.jobs[1].description);
    cy.get('tbody tr').eq(1).children().eq(3).contains('2 minutes ago');
    cy.get('tbody tr').eq(1).children().eq(4).should('have.text', 'Completed');
    cy.get('tbody tr').eq(1).children().eq(5).should('have.text', '1 min 0 secs');
  });

  it('should show in progress jobs', () => {
    cy.get('tbody tr').eq(2).children().should('have.length', 6);
    cy.get('tbody tr').eq(2).children().eq(0).should('have.text', 'testingId3');
    cy.get('tbody tr').eq(2).children().eq(1).should('have.text', 'class3');
    cy.get('tbody tr').eq(2).children().eq(2).should('have.text', '(empty)');
    cy.get('tbody tr').eq(2).children().eq(3).contains('minutes ago');
    cy.get('tbody tr').eq(2).children().eq(4).should('have.text', 'In Progress');
    cy.get('tbody tr').eq(2).children().eq(5).should('have.text', '--');
  });

  it('should show the dialog modal to see more details', () => {
    const mockStore = createMockStore([routerMiddleware(history)]);

    const store = mockStore({
      ...initialState,
      // mock the router state to show if there is an expandedJob query parameter
      router: { location: { query: { expandedJob: initialState.jobs.jobs[0].id } } },
      // mock that the job results were fetched
      jobs: {
        ...initialState.jobs,
        jobResult: {
          resultType: initialState.jobs.jobs[0],
          result: 'foo',
          jobInfo: initialState.jobs.jobs[0],
        },
      },
    });
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={globalTheme}>
            <JobResultModal />
            <JobView searchString={initialState.searchString} />
          </ThemeProvider>
        </Router>
      </Provider>,
    );

    cy.get('.MuiDialog-container').should('exist');
    cy.get('.MuiDialog-container h2').should('have.text', 'Job Details');
    cy.get('#see-more-dialog-content-text > div > div').should('have.length', 3);
    cy.get('#see-more-dialog-content-text > div > div')
      .eq(0)
      .children()
      .eq(0)
      .should('have.text', 'ID');
    cy.get('#see-more-dialog-content-text > div > div')
      .eq(0)
      .children()
      .eq(1)
      .should('have.text', 'testingId1');
    cy.get('#see-more-dialog-content-text > div > div')
      .eq(1)
      .children()
      .eq(0)
      .should('have.text', 'Class Name');
    cy.get('#see-more-dialog-content-text > div > div')
      .eq(1)
      .children()
      .eq(1)
      .should('have.text', 'this.is.fake.class1');
    cy.get('#see-more-dialog-content-text > div > div')
      .eq(2)
      .children()
      .eq(0)
      .should('have.text', 'Description');
    cy.get('#see-more-dialog-content-text > div > div')
      .eq(2)
      .children()
      .eq(1)
      .should('have.text', initialState.jobs.jobs[0].description);
  });

  it('should NOT show the dialog modal to see more details', () => {
    cy.get('.MuiDialog-container').should('not.exist');
  });
});
