import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import createMockStore from 'redux-mock-store';
import React from 'react';
import _ from 'lodash';
import { initialUserState } from 'reducers/user';
import { initialQueryState } from 'reducers/query';
import { JobModelJobStatusEnum } from 'generated/tdr';
import JobView from './JobView';
import globalTheme from '../modules/theme';
import history from '../modules/hist';

const testDate = new Date();
const initialState = {
  searchString: '',
  jobs: {
    jobs: [
      {
        id: 'testingId',
        job_status: JobModelJobStatusEnum.Failed,
        status_code: 200,
        description: 'the first pancake always burns',
        class_name: 'this.is.fake.class',
        submitted: testDate.toISOString(),
      },
      {
        id: 'testingId2',
        job_status: JobModelJobStatusEnum.Succeeded,
        status_code: 200,
        description: 'Ingest from source.json to ArraysInputsTable in dataset id (uuid)',
        class_name: 'this.is.fake.class2',
        submitted: new Date(testDate.valueOf() - 2 * 60000).toISOString(),
      },
      {
        id: 'testingId3',
        job_status: JobModelJobStatusEnum.Running,
        status_code: 200,
        class_name: 'this.is.fake.class2',
        submitted: new Date(testDate.valueOf() - 2 * 120000).toISOString(),
      },
    ],
  },
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
    // IT DOES NOT DO THIS AT ALL
    cy.get('tbody tr').should('have.length', initialState.jobs.jobs.length);
  });

  it('should show successful jobs', () => {
    cy.get('tbody tr').eq(0).children().should('have.length', 5);
    cy.get('tbody tr').eq(0).children().eq(0).should('have.text', initialState.jobs.jobs[0].id);
    cy.get('tbody tr').eq(0).children().eq(1).should('have.text', 'class');
    cy.get('tbody tr')
      .eq(0)
      .children()
      .eq(2)
      .should('have.text', initialState.jobs.jobs[0].description);
    cy.get('tbody tr').eq(0).children().eq(3).should('have.text', 'a few seconds ago');
    cy.get('tbody tr').eq(0).children().eq(4).should('have.text', 'Failed');
    cy.get('tbody tr').eq(0).children().eq(0).click();
  });

  it('should show failed jobs', () => {
    cy.get('tbody tr').eq(1).children().should('have.length', 5);
    cy.get('tbody tr').eq(1).children().eq(0).should('have.text', initialState.jobs.jobs[1].id);
    cy.get('tbody tr').eq(1).children().eq(1).should('have.text', 'class2');
    cy.get('tbody tr')
      .eq(1)
      .children()
      .eq(2)
      .should('have.text', initialState.jobs.jobs[1].description);
    cy.get('tbody tr').eq(1).children().eq(3).should('have.text', '2 minutes ago');
    cy.get('tbody tr').eq(1).children().eq(4).should('have.text', 'Completed');
  });

  it('should show in progress jobs', () => {
    cy.get('tbody tr').eq(2).children().should('have.length', 5);
    cy.get('tbody tr').eq(2).children().eq(0).should('have.text', initialState.jobs.jobs[2].id);
    cy.get('tbody tr').eq(2).children().eq(1).should('have.text', 'class2');
    cy.get('tbody tr').eq(2).children().eq(2).should('have.text', '(empty)');
    cy.get('tbody tr').eq(2).children().eq(3).should('have.text', '4 minutes ago');
    cy.get('tbody tr').eq(2).children().eq(4).should('have.text', 'In Progress');
  });

  it('should open the dialog modal to see more details', () => {
    cy.get('tbody tr:first-of-type button')
      .click()
      .then(() => {
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
          .should('have.text', initialState.jobs.jobs[0].id);
        cy.get('#see-more-dialog-content-text > div > div')
          .eq(1)
          .children()
          .eq(0)
          .should('have.text', 'Class Name');
        cy.get('#see-more-dialog-content-text > div > div')
          .eq(1)
          .children()
          .eq(1)
          .should('have.text', initialState.jobs.jobs[0].class_name);
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
  });

  it('should allow closing the modal', () => {
    cy.get('tbody tr:first-of-type button')
      .click()
      .then(() => {
        cy.get('.MuiDialog-container').should('exist');
        cy.get('.MuiDialog-container h2 button').should('exist');
        cy.get('.MuiDialog-container h2 button')
          .click()
          .then(() => {
            cy.get('.MuiDialog-container').should('not.exist');
          });
      });
  });
});
