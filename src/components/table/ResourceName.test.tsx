import React from 'react';
import createMockStore from 'redux-mock-store';
import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';

import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import ResourceName from './ResourceName';
import { ResourceType } from '../../constants';

const DS_1 = { id: 'f31483ee-4b35-47fa-9729-5c5286c7e81f', name: 'ds1' };
const DS_2 = { id: 'bd84ef00-b908-46ea-aebe-63c7811891a6', name: 'ds2' };

const ROLE_MAPS = {
  [DS_1.id]: ['admin', 'steward'],
  [DS_2.id]: ['admin'],
};
const initialState = {
  dataset: {
    datasets: [DS_1, DS_2],
    roleMaps: ROLE_MAPS,
  },
};

describe('Resource Name rendering', () => {
  it('Displays dataset name and no admin button', () => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);

    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <ResourceName
              resourceType={ResourceType.DATASET}
              resource={DS_1}
              roleMaps={ROLE_MAPS}
            />
          </ThemeProvider>
        </Provider>
      </Router>,
    );

    cy.get(`[data-cy='resource-name-${DS_1.id}']`)
      .should('contain.text', DS_1.name)
      .within(() => {
        cy.get('[data-cy="add-self-as-steward"]').should('not.exist');
      });
  });

  it('Displays dataset name and admin button', () => {
    const mockStore = createMockStore([]);
    const store = mockStore(initialState);

    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <ResourceName
              resourceType={ResourceType.DATASET}
              resource={DS_2}
              roleMaps={ROLE_MAPS}
            />
          </ThemeProvider>
        </Provider>
      </Router>,
    );

    cy.get(`[data-cy='resource-name-${DS_2.id}']`)
      .should('contain.text', DS_2.name)
      .within(() => {
        cy.get('[data-cy="add-self-as-steward"]').should('exist');
      });
  });
});
