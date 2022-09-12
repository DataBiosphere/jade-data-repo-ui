import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import createMockStore from 'redux-mock-store';
import React from 'react';
import DescriptionView from './DescriptionView';
import { DatasetRoles } from '../constants';
import globalTheme from '../modules/theme';
import history from '../modules/hist';

const userRoles = [DatasetRoles.STEWARD];
const initialState = {
  dataset: {
    description: 'A dataset description',
  },
};

beforeEach(() => {
  const mockStore = createMockStore([]);
  const store = mockStore(initialState);
  mount(
    <Router history={history}>
      <Provider store={store} />
      <ThemeProvider theme={globalTheme}>
        <DescriptionView
          description={initialState.dataset.description}
          userRoles={userRoles}
          updateDescriptionFn={(text) => {
            initialState.dataset.description = text;
          }}
        />
      </ThemeProvider>
    </Router>,
  );
});

describe('DescriptionView', () => {
  it('should have loaded a description', () => {
    cy.get('[data-cy=description-edit-button').should('not.be.disabled');
    cy.get('textarea').should('have.value', initialState.dataset.description);
    cy.get('[data-cy=description-undo-button]').should('not.exist');
    cy.get('[data-cy=description-save-button]').should('not.exist');
  });
  it('save and undo appear when clicking edit button.', () => {
    cy.get('button[data-cy=description-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('textarea').should('have.value', initialState.dataset.description);
        cy.get('[data-cy=description-undo-button]').should('be.disabled');
        cy.get('[data-cy=description-save-button]').should('be.disabled');
      });
    cy.get('textarea')
      .first({ timeout: 5 })
      .type('change', { force: true })
      .then(() => {
        cy.get('[data-cy=description-undo-button]').should('be.enabled');
        cy.get('[data-cy=description-save-button]').should('be.enabled');
        cy.get('textarea').should('not.have.value', initialState.dataset.description);
      });
  });
  it('undo button resets input state', () => {
    cy.get('textarea')
      .first({ timeout: 5 })
      .type('change', { force: true })
      .then(() => {
        cy.get('button[data-cy=description-undo-button]')
          .click({ force: true })
          .then(() => {
            cy.get('textarea').should('have.value', initialState.dataset.description);
            cy.get('[data-cy=description-undo-button]').should('not.be.enabled');
            cy.get('[data-cy=description-save-button]').should('not.be.enabled');
          });
      });
  });
  it('ensure buttons are removed when focus changes.', () => {
    cy.get('button[data-cy=description-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('[data-cy=description-undo-button]', { timeout: 5 }).should('be.disabled');
        cy.get('[data-cy=description-save-button]', { timeout: 5 }).should('be.disabled');
      });
    cy.get('textarea').first({ timeout: 5 }).blur({ force: true });
    cy.get('[data-cy=description-undo-button]', { timeout: 5 }).should('not.exist');
    cy.get('[data-cy=description-save-button]', { timeout: 5 }).should('not.exist');
  });
  it('ensure save/undo are added and removed when focus changes.', () => {
    cy.get('textarea').first({ timeout: 5 }).focus();
    cy.get('[data-cy=description-undo-button]', { timeout: 5 }).should('be.disabled');
    cy.get('[data-cy=description-save-button]', { timeout: 5 }).should('be.disabled');
    cy.get('textarea').first({ timeout: 5 }).blur({ force: true });
    cy.get('[data-cy=description-undo-button]', { timeout: 5 }).should('not.exist');
    cy.get('[data-cy=description-save-button]', { timeout: 5 }).should('not.exist');
  });
  it('ensure save/update buttons remain when focus changes after text changed.', () => {
    cy.get('textarea').first({ timeout: 5 }).type('change', { force: true });
    cy.get('textarea').first({ timeout: 5 }).blur({ force: true });
    cy.get('[data-cy=description-undo-button]').should('be.enabled');
    cy.get('[data-cy=description-save-button]').should('be.enabled');
  });
});
