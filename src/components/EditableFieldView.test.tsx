import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import createMockStore from 'redux-mock-store';
import React from 'react';
import EditableFieldView from './EditableFieldView';
import globalTheme from '../modules/theme';
import history from '../modules/hist';

function createState(pendingSave: boolean): any {
  return {
    dataset: {
      description: 'A dataset description',
      phsId: '12345',
    },
    pendingSave: {
      description: pendingSave,
      phsId: pendingSave,
    },
  };
}

const initialState = createState(false);
const pendingSaveSate = createState(true);

function mountComponent(state: any) {
  const mockStore = createMockStore([]);
  const store = mockStore(state);
  mount(
    <Router history={history}>
      <Provider store={store} />
      <ThemeProvider theme={globalTheme}>
        <EditableFieldView
          fieldValue={state.dataset.description}
          fieldName="Description"
          canEdit={true}
          isPendingSave={state.pendingSave.description}
          updateFieldValueFn={(text: any) => {
            initialState.dataset.description = text;
          }}
          useMarkdown={true}
        />
        <EditableFieldView
          fieldValue={state.dataset.phsId}
          fieldName="PHS Id"
          canEdit={true}
          isPendingSave={state.pendingSave.phsId}
          updateFieldValueFn={(text: any) => {
            initialState.dataset.phsId = text;
          }}
          useMarkdown={false}
        />
      </ThemeProvider>
    </Router>,
  );
}

describe('Description in Markdown EditableFieldView', () => {
  it('should have loaded a description', () => {
    mountComponent(initialState);
    cy.get('[data-cy=description-edit-button]').should('not.be.disabled');
    cy.get('p').should(($p) => {
      expect($p).to.have.length(2);
      expect($p.first()).to.contain(initialState.dataset.description);
    });
    cy.get('[data-cy=description-cancel-button]').should('not.exist');
    cy.get('[data-cy=description-save-button]').should('not.exist');
  });
  it('save and undo appear when clicking edit button.', () => {
    mountComponent(initialState);
    cy.get('button[data-cy=description-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('.CodeMirror-line > span').should(($s) => {
          expect($s).to.have.length(1);
          expect($s.first()).to.contain(initialState.dataset.description);
        });
        cy.get('[data-cy=description-cancel-button]').should('be.enabled');
        cy.get('[data-cy=description-save-button]').should('be.disabled');
      });
    cy.get('.CodeMirror textarea')
      .first({ timeout: 5 })
      .type('change ', { force: true })
      .then(() => {
        cy.get('[data-cy=description-cancel-button]').should('be.enabled');
        cy.get('[data-cy=description-save-button]').should('be.enabled');
        cy.get('.CodeMirror-line > span').should(($s) => {
          expect($s).to.have.length(1);
          expect($s.first()).to.contain(`change ${initialState.dataset.description}`);
        });
      });
  });
  it('cancel button resets input state, closes editor', () => {
    mountComponent(initialState);
    cy.get('button[data-cy=description-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('.CodeMirror textarea')
          .first({ timeout: 5 })
          .type('change ', { force: true })
          .then(() => {
            cy.get('button[data-cy=description-cancel-button]')
              .click({ force: true })
              .then(() => {
                cy.get('p').should(($p) => {
                  expect($p).to.have.length(2);
                  expect($p.first()).to.contain(initialState.dataset.description);
                });
                cy.get('[data-cy=description-cancel-button]').should('not.exist');
                cy.get('[data-cy=description-save-button]').should('not.exist');
              });
          });
      });
  });
  it('ensure save/update buttons remain when focus changes.', () => {
    mountComponent(initialState);
    cy.get('button[data-cy=description-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('.CodeMirror textarea').first({ timeout: 5 }).type('change', { force: true });
        cy.get('.CodeMirror textarea').first({ timeout: 5 }).blur({ force: true });
        cy.get('[data-cy=description-cancel-button]').should('be.enabled');
        cy.get('[data-cy=description-save-button]').should('be.enabled');
      });
  });
  it('pending save disables save and cancel buttons', () => {
    mountComponent(pendingSaveSate);
    cy.get('button[data-cy=description-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('.CodeMirror textarea')
          .first({ timeout: 5 })
          .type('change ', { force: true })
          .then(() => {
            // We cannot disable the textarea in a SimpleMdeReact component,
            // so for markdown EditableFieldViews we only disable the buttons on pending save.
            cy.get('[data-cy=description-cancel-button]').should('be.disabled');
            cy.get('[data-cy=description-save-button]')
              .should('be.disabled')
              .within(() => {
                cy.get('.MuiCircularProgress-root').should('be.visible');
              });
          });
      });
  });
});

describe('Plain text field in EditableFieldView', () => {
  it('should have loaded a phs id', () => {
    mountComponent(initialState);
    cy.get('[data-cy=phs-id-edit-button]').should('not.be.disabled');
    cy.get('[data-cy=phs-id-field-name]').should(($p) => {
      expect($p.first()).to.contain('PHS Id');
    });
    cy.get('p').should(($p) => {
      expect($p).to.have.length(2);
      expect($p[1]).to.contain(initialState.dataset.phsId);
    });
    cy.get('[data-cy=phs-id-cancel-button]').should('not.exist');
    cy.get('[data-cy=phs-id-save-button]').should('not.exist');
  });
  it('save and undo appear when clicking edit button.', () => {
    mountComponent(initialState);
    cy.get('button[data-cy=phs-id-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('[id="outlined-basic"').should('contain.value', initialState.dataset.phsId);
        cy.get('[data-cy=phs-id-cancel-button]').should('be.enabled');
        cy.get('[data-cy=phs-id-save-button]').should('be.disabled');
      });
    cy.get('[id="outlined-basic"')
      .first({ timeout: 5 })
      .type('change', { force: true })
      .then(() => {
        cy.get('[data-cy=phs-id-cancel-button]').should('be.enabled');
        cy.get('[data-cy=phs-id-save-button]').should('be.enabled');
        cy.get('[id="outlined-basic"').should(
          'contain.value',
          `${initialState.dataset.phsId}change`,
        );
      });
  });
  it('pending save disables text input, save and cancel buttons', () => {
    mountComponent(pendingSaveSate);
    cy.get('button[data-cy=phs-id-edit-button]')
      .click({ force: true })
      .then(() => {
        cy.get('[id="outlined-basic"')
          .first({ timeout: 5 })
          .type('change', { force: true })
          .then(() => {
            cy.get('[data-cy=phs-id-text-field] input').should('be.disabled');
            cy.get('[data-cy=phs-id-cancel-button]').should('be.disabled');
            cy.get('[data-cy=phs-id-save-button]')
              .should('be.disabled')
              .within(() => {
                cy.get('.MuiCircularProgress-root').should('be.visible');
              });
          });
      });
  });
});
