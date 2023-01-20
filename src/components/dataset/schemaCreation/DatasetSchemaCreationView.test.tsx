import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import React from 'react';
import _ from 'lodash';
import { initialUserState } from 'reducers/user';
import DatasetSchemaCreationView from './DatasetSchemaCreationView';
import globalTheme from '../../../modules/theme';
import history from '../../../modules/hist';
import { ActionTypes } from '../../../constants';

const initialState = {
  searchString: '',
  profiles: {
    profiles: [
      { id: 'default', profileName: 'default profile', cloudPlatform: 'gcp' },
      { id: 'second', profileName: 'second profile', cloudPlatform: 'azure' },
    ],
  },
  datasets: {
    dialogIsOpen: false,
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
  cy.get('#dataset-defaultProfileId').type('default');
  cy.get('#dataset-defaultProfileId-option-0').click();
};

interface InitialTableState {
  name?: string;
  columns?: {
    name?: string;
  }[];
}

const createInitialTableState = (schema: InitialTableState[]) => {
  schema?.forEach((table: any) => {
    cy.get('#schemabuilder-createTable').click();
    if (table.name) {
      cy.get('#table-name').clear().type(table.name);
    }
    if (table.columns) {
      table.columns.forEach((column: any) => {
        cy.get('#schemabuilder-createColumn').click();
        if (column.name) {
          cy.get('#column-name').clear().type(column.name);
        }
      });
    }
  });
};

const assertCreateDatasetWasNotCalled = (store: MockStoreEnhanced<unknown, unknown>) => {
  expect(
    store
      .getActions()
      .map((a) => a.type)
      .indexOf(ActionTypes.CREATE_DATASET),
  ).to.be.eq(-1);
};

const assertCreateDatasetWasCalled = (store: MockStoreEnhanced<unknown, unknown>) => {
  expect(
    store
      .getActions()
      .map((a) => a.type)
      .indexOf(ActionTypes.CREATE_DATASET),
  ).to.be.greaterThan(-1);
};

beforeEach(() => {
  const mockStore = createMockStore([]);
  const store = mockStore(initialState);
  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <DatasetSchemaCreationView />
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
      cy.get('.MuiTabs-scroller button')
        .eq(1)
        .click()
        .then(() => {
          cy.get('.MuiTabs-scroller button').eq(1).should('have.class', 'Mui-selected');
          cy.get('[data-cy="component-root"]').contains('Build a schema');
          done();
        });
    });

    it('should not submit if errors exist', () => {
      const mockStore = createMockStore([]);
      const store = mockStore(initialState);
      mount(
        <Router history={history}>
          <Provider store={store}>
            <ThemeProvider theme={globalTheme}>
              <DatasetSchemaCreationView />
            </ThemeProvider>
          </Provider>
        </Router>,
      );
      cy.get('.MuiTabs-scroller button').eq(1).click();
      cy.get('button[type="submit"]')
        .click()
        .then(() => assertCreateDatasetWasNotCalled(store));
      cy.get('.Mui-error').should('exist');
      cy.get('[data-cy="error-details"]').find('li').should('have.length', 8);
    });

    it('should submit if valid', () => {
      const mockStore = createMockStore([]);
      const store = mockStore(initialState);
      mount(
        <Router history={history}>
          <Provider store={store}>
            <ThemeProvider theme={globalTheme}>
              <DatasetSchemaCreationView />
            </ThemeProvider>
          </Provider>
        </Router>,
      );

      fillValidInfoFields();

      // Setting required fields for table
      cy.get('.MuiTabs-scroller button').eq(1).click();
      createInitialTableState([{ columns: [{}] }]);

      // Submitting
      cy.get('button[type="submit"]')
        .click()
        .then(() => assertCreateDatasetWasCalled(store));
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
      cy.get('[data-cy="schema-navigator"]').children().should('have.length', 0);
      cy.get('.cm-theme').should('exist');
      cy.get('.cm-theme').contains('If you already have json, please paste your code here');
    });

    describe('Tables', () => {
      it('should create a single table', () => {
        createInitialTableState([{}]);
        cy.get('[data-cy="schema-navigator"]').children().should('have.length', 1);

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
        cy.get('[data-cy="schema-navigator"]').children().should('have.length', 1);

        // Should automatically select the new table
        cy.get('[data-cy="schemaBuilder-detailView"]').should('exist');
        cy.get('#table-name').clear().type('party');

        cy.get('#schemabuilder-createTable').click();
        cy.get('[data-cy="schema-navigator"]').children().should('have.length', 2);
        // Should select the new table again
        cy.get('#table-name').should('have.value', 'table_name1');

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'party',
                columns: [],
                primaryKey: [],
              },
              {
                name: 'table_name1',
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
        mount(
          <Router history={history}>
            <Provider store={store}>
              <ThemeProvider theme={globalTheme}>
                <DatasetSchemaCreationView />
              </ThemeProvider>
            </Provider>
          </Router>,
        );
        cy.get('.MuiTabs-scroller button').eq(1).click();
        cy.get('#schemabuilder-createTable')
          .click()
          .then(() => assertCreateDatasetWasNotCalled(store));
        cy.get('#table-name')
          .clear()
          .type('party{enter}')
          .then(() => assertCreateDatasetWasNotCalled(store));
      });

      it('should expand and collapse the tables contents', () => {
        createInitialTableState([
          { name: 'party', columns: [{ name: 'streamers' }, { name: 'streamers' }] },
          { name: 'colors', columns: [{ name: 'red' }] },
        ]);

        // all three columns are expanded
        cy.get('li[data-cy="column-name"]').should('have.length', 3);

        // minimize the first table
        cy.get('h6[data-cy="table-name"]').eq(0).click();

        // only one columns is now expanded
        cy.get('li[data-cy="column-name"]').should('have.length', 1);
      });

      it('should duplicate a table', () => {
        createInitialTableState([
          { name: 'party' },
          { name: 'colors', columns: [{ name: 'red' }, { name: 'yellow' }] },
        ]);

        // select the second table
        cy.get('h6[data-cy="table-name"]').eq(1).click();

        cy.get('#details-menu-button').click();
        cy.get('ul[aria-labelledby="details-menu-button"]').children().eq(0).click();

        // there should be three tables
        cy.get('h6[data-cy="table-name"]').should('have.length', 3);
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
                    name: 'red',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                  {
                    name: 'yellow',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
              {
                name: 'colors',
                columns: [
                  {
                    name: 'red',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                  {
                    name: 'yellow',
                    datatype: 'string',
                    array_of: false,
                    required: false,
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
        createInitialTableState([{ name: 'party' }, { name: 'colors' }]);

        cy.get('#details-menu-button').click();
        cy.get('ul[aria-labelledby="details-menu-button"]').children().eq(2).click();

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

      it('should be able to move tables up in the list', () => {
        createInitialTableState([{ name: 'party' }, { name: 'colors' }]);

        cy.get('#datasetSchema-up').click();
        cy.get('h6[data-cy="table-name"]').eq(0).contains('colors');

        cy.get('#datasetSchema-up').should('have.attr', 'disabled');
      });

      it('should be able to move tables down in the list', () => {
        createInitialTableState([{ name: 'party' }, { name: 'colors' }]);

        cy.get('h6[data-cy="table-name"]').eq(0).click();

        cy.get('#datasetSchema-down').click();
        cy.get('h6[data-cy="table-name"]').eq(1).contains('party');

        cy.get('#datasetSchema-down').should('have.attr', 'disabled');
      });
    });

    describe('Columns', () => {
      it('should disable column creation until a table exists', () => {
        cy.get('#schemabuilder-createColumn').should('have.attr', 'disabled');
        createInitialTableState([{}]);
        cy.get('#schemabuilder-createColumn').should('not.have.attr', 'disabled');
      });

      it('should create a single column', () => {
        createInitialTableState([{}]);
        cy.get('li[data-cy="column-name"]').should('not.exist');
        cy.get('#schemabuilder-createColumn').click();
        cy.get('li[data-cy="column-name"]').should('exist');
        cy.get('li[data-cy="column-name"]').should('have.length', 1);
      });

      it('should create a multiple columns', () => {
        createInitialTableState([{}]);
        cy.get('li[data-cy="column-name"]').should('not.exist');
        cy.get('#schemabuilder-createColumn').click();
        cy.get('#schemabuilder-createColumn').click();
        cy.get('li[data-cy="column-name"]').should('exist');
        cy.get('li[data-cy="column-name"]').should('have.length', 2);
      });

      it('should not submit on text field enter', () => {
        const mockStore = createMockStore([]);
        const store = mockStore(initialState);
        mount(
          <Router history={history}>
            <Provider store={store}>
              <ThemeProvider theme={globalTheme}>
                <DatasetSchemaCreationView />
              </ThemeProvider>
            </Provider>
          </Router>,
        );
        cy.get('.MuiTabs-scroller button').eq(1).click();
        createInitialTableState([{ columns: [{ name: 'red{enter}' }] }]);
        assertCreateDatasetWasNotCalled(store);
      });

      it('should duplicate a column', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }, { name: 'yellow' }],
          },
        ]);

        cy.get('#details-menu-button').click();
        cy.get('ul[aria-labelledby="details-menu-button"]').children().eq(2).click();

        cy.get('li[data-cy="column-name"]').should('have.length', 3);
        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'colors',
                columns: [
                  {
                    name: 'red',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                  {
                    name: 'yellow',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                  {
                    name: 'yellow',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('should delete a column', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }, { name: 'yellow' }],
          },
        ]);

        cy.get('#details-menu-button').click();
        cy.get('ul[aria-labelledby="details-menu-button"]').children().eq(4).click();

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'colors',
                columns: [
                  {
                    name: 'red',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('should be able to move columns up in the list', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }, { name: 'yellow' }],
          },
        ]);

        cy.get('#datasetSchema-up').click();
        cy.get('li[data-cy="column-name"]').eq(0).contains('yellow');

        cy.get('#datasetSchema-up').should('have.attr', 'disabled');
      });

      it('should be able to move tables down in the list', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }, { name: 'yellow' }],
          },
        ]);

        cy.get('li[data-cy="column-name"]').eq(0).click();

        cy.get('#datasetSchema-down').click();
        cy.get('li[data-cy="column-name"]').eq(1).contains('red');

        cy.get('#datasetSchema-down').should('have.attr', 'disabled');
      });

      it('should update column array_of', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }],
          },
        ]);

        cy.get('[data-cy="schemaBuilder-column-array"]').click();

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'colors',
                columns: [
                  {
                    name: 'red',
                    datatype: 'string',
                    array_of: true,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));

          cy.get('[data-cy="schemaBuilder-column-array"]')
            .click()
            .then(() => {
              comparison.tables[0].columns[0].array_of = false;
              expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
            });
        });
      });

      it('should update column required', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }],
          },
        ]);

        cy.get('[data-cy="schemaBuilder-column-required"]').click();

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'colors',
                columns: [
                  {
                    name: 'red',
                    datatype: 'string',
                    array_of: false,
                    required: true,
                  },
                ],
                primaryKey: [],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));

          cy.get('[data-cy="schemaBuilder-column-required"]')
            .click()
            .then(() => {
              comparison.tables[0].columns[0].required = false;
              expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
            });
        });
      });

      it('should update column primary', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }],
          },
        ]);

        cy.get('[data-cy="schemaBuilder-column-primary"]').click();

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'colors',
                columns: [
                  {
                    name: 'red',
                    datatype: 'string',
                    array_of: false,
                    required: true,
                  },
                ],
                primaryKey: ['red'],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
          cy.get('[data-cy="schemaBuilder-column-required"] input').should('have.attr', 'disabled');
          cy.get('[data-cy="schemaBuilder-column-array"] input').should('have.attr', 'disabled');

          cy.get('[data-cy="schemaBuilder-column-primary"]')
            .click()
            .then(() => {
              comparison.tables[0].primaryKey = [];
              expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
              cy.get('[data-cy="schemaBuilder-column-required"] input').should(
                'not.have.attr',
                'disabled',
              );
              cy.get('[data-cy="schemaBuilder-column-array"] input').should(
                'have.attr',
                'disabled',
              );
            });
        });
      });

      it('should update impacted fields when the column name changes', () => {
        createInitialTableState([
          {
            name: 'colors',
            columns: [{ name: 'red' }],
          },
        ]);

        cy.get('[data-cy="schemaBuilder-column-primary"]').click();
        cy.get('#column-name').clear().type('burgundy');

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'colors',
                columns: [
                  {
                    name: 'burgundy',
                    datatype: 'string',
                    array_of: false,
                    required: true,
                  },
                ],
                primaryKey: ['burgundy'],
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });
    });

    describe('Relationships', () => {
      it('modal button should be available after 2 tables', () => {
        cy.get('#datasetSchema-linkRel').should('have.attr', 'disabled');
        cy.get('#schemabuilder-createTable').click();
        cy.get('#datasetSchema-linkRel').should('have.attr', 'disabled');
        cy.get('#schemabuilder-createTable').click();
        cy.get('#datasetSchema-linkRel').should('not.have.attr', 'disabled');
      });

      it('should open relationship modal on click', () => {
        createInitialTableState([{}, {}]);
        cy.get('#datasetSchema-linkRel').click();
        cy.get('.MuiDialog-container').should('exist');

        cy.get('#from-table').should('be.empty');
        cy.get('#from-column').should('be.empty');
        cy.get('#to-table').should('be.empty');
        cy.get('#to-column').should('be.empty');
      });

      it('should open relationship modal on column click', () => {
        createInitialTableState([{ columns: [{}] }, { columns: [{}, {}] }]);
        cy.get('#details-menu-button').click();
        cy.get('ul[aria-labelledby="details-menu-button"]').children().eq(0).click();
        cy.get('#from-table').contains('table_name1');
        cy.get('#from-column').contains('new_column1');
        cy.get('#to-table').should('be.empty');
        cy.get('#to-column').should('be.empty');
      });

      it('should update the from value on click', () => {
        createInitialTableState([{ columns: [{}] }, { columns: [{}, {}] }]);
        cy.get('#datasetSchema-linkRel').click();

        // Expand second "from" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(1).click();
        // Select second column
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(1).click();
        cy.get('#from-table').contains('table_name1');
        cy.get('#from-column').contains('new_column1');
      });

      it('should update the to value on click', () => {
        createInitialTableState([{ columns: [{}] }, { columns: [{}, {}] }]);
        cy.get('#datasetSchema-linkRel').click();

        // Expand first "to" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(2).click();
        // Select first column
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(0).click();
        cy.get('#to-table').contains('table_name');
        cy.get('#to-column').contains('new_column');
      });

      it('should allow user to add a relationship after all values are provided!', () => {
        createInitialTableState([{ columns: [{}] }, { columns: [{}, {}] }]);
        cy.get('#datasetSchema-linkRel').click();
        // Expand second "from" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(1).click();
        // Select second column
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(1).click();
        // Expand first "to" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(2).click();
        // Select first column (it's the third overall column)
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(2).click();
        cy.get('#submitButton').should('have.attr', 'disabled');
        cy.get('#table-name').should('have.value', '');
        cy.get('#table-name').type('rel-name');
        cy.get('#submitButton').should('not.have.attr', 'disabled');
        cy.get('#submitButton').click();

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'table_name',
                columns: [
                  {
                    name: 'new_column',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
              {
                name: 'table_name1',
                columns: [
                  {
                    name: 'new_column',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                  {
                    name: 'new_column1',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
            ],
            relationships: [
              {
                name: 'rel-name',
                from: {
                  table: 'table_name1',
                  column: 'new_column1',
                },
                to: {
                  table: 'table_name',
                  column: 'new_column',
                },
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('updating table name should update relationship value', () => {
        createInitialTableState([{ columns: [{}] }, { columns: [{}] }]);
        cy.get('#datasetSchema-linkRel').click();
        // Expand second "from" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(1).click();
        // Select second column
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(0).click();
        // Expand first "to" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(2).click();
        // Select first column (it's the second overall column)
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(1).click();
        cy.get('#table-name').type('rel-name');
        cy.get('#submitButton').click();

        // Rename the first table
        cy.get('h6[data-cy="table-name"]').eq(0).click();
        cy.get('#table-name').clear().type('party');

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'party',
                columns: [
                  {
                    name: 'new_column',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
              {
                name: 'table_name1',
                columns: [
                  {
                    name: 'new_column',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
            ],
            relationships: [
              {
                name: 'rel-name',
                from: {
                  table: 'table_name1',
                  column: 'new_column',
                },
                to: {
                  table: 'party',
                  column: 'new_column',
                },
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });

      it('updating column name should update relationship value', () => {
        createInitialTableState([{ columns: [{}] }, { columns: [{}] }]);
        cy.get('#datasetSchema-linkRel').click();
        // Expand second "from" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(1).click();
        // Select second column
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(0).click();
        // Expand first "to" table
        cy.get('.MuiModal-root h6[data-cy="table-name"]').eq(2).click();
        // Select first column (it's the second overall column)
        cy.get('.MuiModal-root li[data-cy="column-name"]').eq(1).click();
        cy.get('#table-name').type('rel-name');
        cy.get('#submitButton').click();

        // This column happens to be selected
        cy.get('#column-name').clear().type('party');

        cy.get('.cm-theme').then((elem) => {
          const comparison = {
            tables: [
              {
                name: 'table_name',
                columns: [
                  {
                    name: 'new_column',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
              {
                name: 'table_name1',
                columns: [
                  {
                    name: 'party',
                    datatype: 'string',
                    array_of: false,
                    required: false,
                  },
                ],
                primaryKey: [],
              },
            ],
            relationships: [
              {
                name: 'rel-name',
                from: {
                  table: 'table_name1',
                  column: 'party',
                },
                to: {
                  table: 'table_name',
                  column: 'new_column',
                },
              },
            ],
          };
          expect(elem.attr('data-cy')).to.equal(JSON.stringify(comparison));
        });
      });
    });
  });
});
