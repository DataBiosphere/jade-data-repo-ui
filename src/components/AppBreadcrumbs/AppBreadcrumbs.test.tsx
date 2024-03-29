import React from 'react';
import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import globalTheme from 'modules/theme';
import { ThemeProvider } from '@mui/styles';
import AppBreadcrumbs from './AppBreadcrumbs';
import { BreadcrumbType } from '../../constants';

describe('AppBreadcrumbs', () => {
  it('should render the path to the current dataset', () => {
    mount(
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <AppBreadcrumbs
            context={{ type: BreadcrumbType.DATASET, id: 'foo-bar', name: 'testDataset' }}
            childBreadcrumbs={[]}
          />
        </ThemeProvider>
      </Router>,
    );

    cy.get('.MuiBreadcrumbs-ol > :nth-child(1) > a')
      .should('contain.text', 'Datasets')
      .should('have.attr', 'href', '/datasets');

    cy.get('.MuiBreadcrumbs-ol > :nth-child(3) > a')
      .should('contain.text', 'testDataset')
      .should('have.attr', 'href', '/datasets/foo-bar');

    mount(
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <AppBreadcrumbs
            context={{ type: BreadcrumbType.DATASET, id: 'foo-bar', name: 'testDataset' }}
            childBreadcrumbs={[{ text: 'Data', to: 'data' }]}
          />
        </ThemeProvider>
      </Router>,
    );

    cy.get('.MuiBreadcrumbs-ol > :nth-child(3) > a')
      .should('contain.text', 'testDataset')
      .should('have.attr', 'href', '/datasets/foo-bar');

    cy.get('.MuiBreadcrumbs-ol > :nth-child(5) > a')
      .should('contain.text', 'Data')
      .should('have.attr', 'href', '/datasets/foo-bar/data');
  });

  it('should render the path to the current snapshot', () => {
    mount(
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <AppBreadcrumbs
            context={{
              type: BreadcrumbType.SNAPSHOT,
              id: 'foo-bar-snapshot',
              name: 'testSnapshot',
            }}
            childBreadcrumbs={[]}
          />
        </ThemeProvider>
      </Router>,
    );
    cy.get('.MuiBreadcrumbs-ol > :nth-child(1) > a')
      .should('contain.text', 'Snapshots')
      .should('have.attr', 'href', '/snapshots');

    cy.get('.MuiBreadcrumbs-ol > :nth-child(3) > a')
      .should('contain.text', 'testSnapshot')
      .should('have.attr', 'href', '/snapshots/foo-bar-snapshot');
  });

  it('should disable the last link in the breadcrumbs', () => {
    mount(
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <AppBreadcrumbs
            context={{ type: BreadcrumbType.DATASET, id: 'foo-bar', name: 'testDataset' }}
            childBreadcrumbs={[]}
          />
        </ThemeProvider>
      </Router>,
    );
    cy.get('.MuiBreadcrumbs-ol > :nth-child(1) > a > span').should('have.css', 'cursor', 'pointer');
    cy.get('.MuiBreadcrumbs-ol > :nth-child(3) > a > span ').should(
      'have.css',
      'cursor',
      'default',
    );

    mount(
      <Router history={history}>
        <ThemeProvider theme={globalTheme}>
          <AppBreadcrumbs
            context={{ type: BreadcrumbType.DATASET, id: 'foo-bar', name: 'testDataset' }}
            childBreadcrumbs={[{ text: 'Data', to: 'data' }]}
          />
        </ThemeProvider>
      </Router>,
    );

    cy.get('.MuiBreadcrumbs-ol > :nth-child(3) > a > span').should('have.css', 'cursor', 'pointer');
    cy.get('.MuiBreadcrumbs-ol > :nth-child(5) > a > span').should('have.css', 'cursor', 'default');
  });
});
