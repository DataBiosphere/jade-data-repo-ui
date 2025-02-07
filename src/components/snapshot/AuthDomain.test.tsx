import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import React from 'react';
import createMockStore from 'redux-mock-store';
import { ManagedGroupMembershipEntry } from 'src/models/group';
import history from '../../modules/hist';
import AuthDomain from './AuthDomain';
import globalTheme from '../../modules/theme';

const mountAuthDomain = (userGroups: Array<ManagedGroupMembershipEntry>) => {
  const state = {
    user: {
      userGroups,
    },
  };

  const mockStore = createMockStore([]);
  const store = mockStore(state);

  cy.intercept('GET', 'https://sam.dsde-dev.broadinstitute.org/api/groups/v1').as('getUserGroups');

  mount(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <AuthDomain
            setParentAuthDomain={() => {
              /* no-op */
            }}
          />
        </ThemeProvider>
      </Provider>
    </Router>,
  );
};

describe('Test AuthDomain component', () => {
  it('Displays authorization domain section', () => {
    mountAuthDomain([]);

    cy.get('label[for="authorization-domain"]')
      .should('contain.text', 'Authorization Domain')
      .should('contain.text', '(optional)');
  });

  it('Shows authorization domain dropdown with options when user groups exist', () => {
    const userGroups = [
      { groupEmail: 'email1', groupName: 'group1', role: 'READER' },
      { groupEmail: 'email2', groupName: 'group2', role: 'READER' },
    ];
    mountAuthDomain(userGroups);

    cy.get('#authorization-domain-select')
      .should('exist')
      .should('not.be.disabled')
      .should('have.value', '');

    cy.get('#authorization-domain-select').parent().click();
    cy.get('[data-cy^=menuItem]').should('have.length', userGroups.length);
  });

  it('Select an authorization domain when user groups exist', () => {
    const userGroups = [
      { groupEmail: 'email1', groupName: 'group1', role: 'READER' },
      { groupEmail: 'email2', groupName: 'group2', role: 'READER' },
    ];
    mountAuthDomain(userGroups);

    cy.get('#authorization-domain-select').parent().click();
    cy.get('[data-cy=menuItem-group2]').click();
    cy.get('#authorization-domain-select').should('have.value', 'group2');
  });

  it('Enables authorization domain dropdown when sufficient user groups', () => {
    const userGroups = [{ groupEmail: 'email1', groupName: 'group1', role: 'READER' }];
    mountAuthDomain(userGroups);
    cy.get('#authorization-domain-select').should('not.be.disabled');
  });

  it('Disables authorization domain dropdown when empty user groups', () => {
    mountAuthDomain([]);
    cy.get('#authorization-domain-select').should('be.disabled');
  });
});
