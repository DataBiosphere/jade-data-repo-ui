import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { ClassNameMap, ThemeProvider } from '@mui/styles';
import React from 'react';
import { TableDataType, TableModel } from 'generated/tdr';
import history from '../../../modules/hist';
import globalTheme from '../../../modules/theme';
import SchemaPanel from './SchemaPanel';

const snapshotId = 'testUUID';
const resourceType = 'Snapshot';
const dataLink = `${snapshotId}/data`;
const tables: Array<TableModel> = [
  {
    name: 'Participant',
    columns: [
      {
        name: 'id',
        datatype: TableDataType.String,
        array_of: false,
        required: false,
      },
      {
        name: 'age',
        datatype: TableDataType.Integer,
        array_of: false,
        required: false,
      },
    ],
  },
  {
    name: 'Sample',
    columns: [
      {
        name: 'specimen',
        datatype: TableDataType.String,
      },
      {
        name: 'disease',
        datatype: TableDataType.String,
      },
    ],
  },
];
beforeEach(() => {
  mount(
    <Router history={history}>
      <ThemeProvider theme={globalTheme}>
        <SchemaPanel tables={tables} resourceType={resourceType} resourceId={snapshotId} />
      </ThemeProvider>
    </Router>,
  );
});

describe('SchemaPanel', () => {
  it('should have link to view data', () => {
    cy.get('[data-cy=view-data-link]')
      .click()
      .then(() => {
        expect(location.pathname).to.contain(dataLink);
      });
    cy.get('[data-cy="view-data-link"] > button').should('contain.text', 'View Snapshot Data');
    cy.get('[data-cy="schema-header"]').should('contain.text', 'Snapshot Schema');
  });
  it('should list number of tables', () => {
    cy.get('[data-cy="table-count"]').should('contain.text', '2');
  });
  it('should show first table and column names by default', () => {
    cy.get('[data-cy="schema-navigator"] > :nth-child(1)')
      .should('have.attr', 'aria-expanded', 'true')
      .within(() => {
        cy.get('[data-cy="table-name"]').should('contain.text', 'Participant');
        cy.get('[data-cy="column-name"]').then((columns) => {
          expect(columns[0]).to.contain.text('id');
          expect(columns[1]).to.contain.text('age');
        });
      });
  });
  it('should expand tables', () => {
    cy.get('[data-cy="schema-navigator"] > :nth-child(2)')
      .should('have.attr', 'aria-expanded', 'false')
      .within(() => {
        cy.get('[data-cy="table-name"]').should('contain.text', 'Sample');
        cy.get('[data-testid=AddBoxOutlinedIcon]')
          .click()
          .then(() => {
            cy.get('[data-cy="column-name"]').then((columns) => {
              expect(columns[0]).to.contain.text('specimen');
              expect(columns[1]).to.contain.text('disease');
            });
          });
      });
  });
});
