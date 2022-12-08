import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import createMockStore from 'redux-mock-store';
import React from 'react';
import _ from 'lodash';
import DatasetSchemaCreationView from './DatasetSchemaCreationView';
import { initialUserState } from 'reducers/user';
import globalTheme from '../../../modules/theme';
import history from '../../../modules/hist';

const initialState = {
  searchString: '',
  profiles: {
    profiles: [
      { profileName: 'default profile' },
      { profileName: 'second profile' },
    ],
  },
  user: _.cloneDeep(initialUserState),
};

beforeEach(() => {
  const mockStore = createMockStore([]);
  const store = mockStore(initialState);
  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <DatasetSchemaCreationView history={history} />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
});

describe('DatasetSchemaCreationView', () => {
  describe('CreationView', () => {
    it('should create!', () => {
      cy.get('[data-cy="component-root"]').should('exist');
      cy.get('.MuiTabs-scroller').should('exist');
      cy.get('.MuiTabs-scroller button').should('have.length', 2);
      cy.get('.MuiTabs-scroller button').eq(0).should('have.class', 'Mui-selected');
    });
  
    it('should validate input fields on blur', () => {
      cy.get('#dataset-name').should('exist');
      cy.get('#dataset-name').focus().blur();
      cy.get('.Mui-error').should('exist');
      cy.get('.Mui-error').contains('Name is required');
      cy.get('[data-cy="error-summary"]').should('exist');
    });
  
    it('should switch tabs', (done) => {
      cy.get('.MuiTabs-scroller button').eq(1).click().then(() => {
        cy.get('.MuiTabs-scroller button').eq(1).should('have.class', 'Mui-selected');
        cy.get('[data-cy="component-root"]').contains('Build a schema');
        done();
      });
    });
  })

  describe('Information view', () => {
    it('should validate name on regex pattern', () => {
      cy.get('#dataset-name').type('a, b').blur();
      cy.get('.Mui-error').should('exist');
      cy.get('.Mui-error').contains('Name should fit pattern: ^[a-zA-Z0-9][_a-zA-Z0-9]*$');
      cy.get('#dataset-name').clear();
      cy.get('#dataset-name').type('ab').blur();
      cy.get('.Mui-error').should('not.exist');
    });

    it('should load a default billing profile', () => {
      cy.get('#dataset-defaultProfile').should('have.value', 'default profile');
    });

    it('should update regions when the cloud platform is updated', () => {
      // Confirm orig works
      cy.get('#dataset-cloudPlatform').contains('Google Cloud Platform');
      cy.get('[data-cy="dataset-region"] .MuiAutocomplete-popupIndicator').click();
      cy.get('.MuiAutocomplete-popper').should('exist');
      cy.get('.MuiAutocomplete-popper').contains('asia-east1');
      cy.get('#dataset-region-option-0').click();

      // Update platform
      cy.get('#dataset-cloudPlatform').click();
      cy.get('.MuiMenuItem-root').eq(1).click();

      // Confirm new values exist
      cy.get('#dataset-region').should('have.value', '');
      cy.get('[data-cy="dataset-region"] .MuiAutocomplete-popupIndicator').click();
      cy.get('.MuiAutocomplete-popper').should('exist');
      cy.get('.MuiAutocomplete-popper').contains('East US');
    });

    it('should validate custodians for required', () => {
      cy.get('#dataset-stewards').focus().blur();
      cy.get('.Mui-error').should('not.exist');
      cy.get('#dataset-custodians').focus().blur();
      cy.get('.Mui-error').should('exist');
    });

    it('should validate emails for stewards', () => {
      cy.get('#dataset-stewards').focus().type('haha{enter}').blur();
      cy.get('.Mui-error').should('exist');
      cy.get('#dataset-stewards-helper-text').contains('Invalid emails: "haha"');
    });

    it('should validate emails for custodians', () => {
      cy.get('#dataset-custodians')
        .focus()
        .type('haha{enter}')
        .type('hehe{enter}')
        .type('hoho{enter}')
        .blur();
      cy.get('.Mui-error').should('exist');
      cy.get('#dataset-custodians-helper-text').contains('Invalid emails: "haha", "hehe", "hoho"');
    });
  });
});
