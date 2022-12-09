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

const fillValidInfoFields = () => {
  // Setting required fields for information
  cy.get('#dataset-name').type('abc').blur();
  // we use `force: true` below because the codemirror textarea is hidden
  // and by default Cypress won't interact with hidden elements
  cy.get('.CodeMirror textarea').type('test test test test', { force: true });
  cy.get('[data-cy="dataset-region"] .MuiAutocomplete-popupIndicator').click();
  cy.get('#dataset-region-option-0').click();
  cy.get('#dataset-custodians').type('a@a.com{enter}').blur();
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
    it('should load the component', () => {
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

    it('should not submit if errors exist', () => {
      const mockStore = createMockStore([]);
      const store = mockStore(initialState);
      const historySpy = {
        push: cy.spy().as('historySpy')
      };
      mount(
        <Router history={history}>
          <Provider store={store}>
            <ThemeProvider theme={globalTheme}>
              <DatasetSchemaCreationView history={historySpy} />
            </ThemeProvider>
          </Provider>
        </Router>,
      );
      cy.get('.MuiTabs-scroller button').eq(1).click();
      cy.get('button[type="submit"]').click();
      cy.get('.Mui-error').should('exist');
      cy.get('[data-cy="error-details"]').find('li').should('have.length', 10);
      cy.get('@historySpy').should('not.have.been.calledWith', '/datasets');
    });

    it('should submit if valid', () => {
      const mockStore = createMockStore([]);
      const store = mockStore(initialState);
      const historySpy = {
        push: cy.spy().as('historySpy')
      };
      mount(
        <Router history={history}>
          <Provider store={store}>
            <ThemeProvider theme={globalTheme}>
              <DatasetSchemaCreationView history={historySpy} />
            </ThemeProvider>
          </Provider>
        </Router>,
      );

      fillValidInfoFields();

      // Setting required fields for table
      cy.get('.MuiTabs-scroller button').eq(1).click();
      cy.get('#schemabuilder-createTable').click();
      cy.get('#schemabuilder-createColumn').click();

      // Submitting
      cy.get('button[type="submit"]').click();
      cy.get('@historySpy').should('have.been.calledWith', '/datasets');
    });
  });

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
        .type('a@a.com{enter}')
        .type('hoho{enter}')
        .blur();
      cy.get('.Mui-error').should('exist');
      cy.get('#dataset-custodians-helper-text').contains('Invalid emails: "haha", "hehe", "hoho"');
    });
  });

  describe('Schema Builder view', () => {
    beforeEach(() => {
      cy.get('.MuiTabs-scroller button').eq(1).click();
    });

    it('should start with an empty schema', () => {
      cy.get('[data-cy="schema-builder-structure-view"]').children().should('have.length', 0);
      cy.get('.cm-theme').should('exist');
      cy.get('.cm-theme').contains('If you already have json, please paste your code here');
    });

    describe('Tables', () => {
      it('should create a single table', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('[data-cy="schema-builder-structure-view"]').children().should('have.length', 1);
  
        // Should automatically select the new table
        cy.get('[data-cy="schemaBuilder-detailView"]').should('exist');
        cy.get('#table-name').should('have.value', 'table_name');

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'table_name',
                columns: [],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('should create multiple tables', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('[data-cy="schema-builder-structure-view"]').children().should('have.length', 1);
  
        // Should automatically select the new table
        cy.get('[data-cy="schemaBuilder-detailView"]').should('exist');
        cy.get('#table-name')
          .clear()
          .type('party')
          .blur();

        cy.get('#schemabuilder-createTable').click();
        cy.get('[data-cy="schema-builder-structure-view"]').children().should('have.length', 2);
        // Should select the new table again
        cy.get('#table-name').should('have.value', 'table_name');

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'party',
                columns: [],
                primaryKey: [],
              },
              {
                name: 'table_name',
                columns: [],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('should not submit on text field enter', () => {
        const mockStore = createMockStore([]);
        const store = mockStore(initialState);
        const historySpy = {
          push: cy.spy().as('historySpy')
        };
        mount(
          <Router history={history}>
            <Provider store={store}>
              <ThemeProvider theme={globalTheme}>
                <DatasetSchemaCreationView history={historySpy} />
              </ThemeProvider>
            </Provider>
          </Router>,
        );
        cy.get('.MuiTabs-scroller button').eq(1).click();
        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name')
          .clear()
          .type('party{enter}');
        cy.get('@historySpy').should('not.have.been.calledWith', '/datasets');
      });

      it('should expand and collapse the table\s contents', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('party');

        cy.get('#schemabuilder-createColumn').click();
        cy.get('#column-name').clear().type('streamers');

        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('colors');

        cy.get('#schemabuilder-createColumn').click();
        cy.get('#column-name').clear().type('red');

        cy.get('div[data-cy="schemaBuilder-tableColumns"]')
          .should('have.length', 2);

        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button')
          .eq(0)
          .find('[data-testid="IndeterminateCheckBoxOutlinedIcon"]')
          .click();

        cy.get('div[data-cy="schemaBuilder-tableColumns"]')
          .should('have.length', 1);
      });

      it('should duplicate a table', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('party');

        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('colors');

        cy.get('#schemabuilder-createColumn').click();
        cy.get('#column-name').clear().type('red');

        cy.get('#schemabuilder-createColumn').click();
        cy.get('#column-name').clear().type('yellow');

        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(3).click();

        cy.get('#details-menu-button').click();
        cy.get('ul[aria-labelledby="details-menu-button"]')
          .children()
          .eq(0)
          .click();

        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').should('have.length', 6);
        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'party',
                columns: [],
                primaryKey: [],
              },
              {
                name: 'colors',
                columns: [
                  {
                    "name": "red",
                    "datatype": "string",
                    "array_of": false,
                    "required": false,
                  },
                  {
                    "name": "yellow",
                    "datatype": "string",
                    "array_of": false,
                    "required": false,
                  },
                ],
                primaryKey: [],
              },
              {
                name: 'colors',
                columns: [
                  {
                    "name": "red",
                    "datatype": "string",
                    "array_of": false,
                    "required": false,
                  },
                  {
                    "name": "yellow",
                    "datatype": "string",
                    "array_of": false,
                    "required": false,
                  },
                ],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('should delete a table', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('party');

        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('colors');
  
        cy.get('#details-menu-button').click();
        cy.get('ul[aria-labelledby="details-menu-button"]')
          .children()
          .eq(2)
          .click();
  
        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'party',
                columns: [],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('should be able to select and deselect a table', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('party');

        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('colors');

        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(1).click();
        cy.get('#table-name').should('have.value', 'party');

        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(1).click();
        cy.get('#table-name').should('not.exist');
      });

      it('should be able to move tables up in the list', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('party');

        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('colors');

        cy.get('#datasetSchema-up').click();
        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(1).contains('colors');

        cy.get('#datasetSchema-up').click();
        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(1).contains('colors');
      });

      it('should be able to move tables down in the list', () => {
        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('party');

        cy.get('#schemabuilder-createTable').click();
        cy.get('#table-name').clear().type('colors');

        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(1).click();

        cy.get('#datasetSchema-down').click();
        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(3).contains('party');

        cy.get('#datasetSchema-down').click();
        cy.get('div[data-cy="schemaBuilder-selectTableButton"] button').eq(3).contains('party');
      });
    });
  });
});
