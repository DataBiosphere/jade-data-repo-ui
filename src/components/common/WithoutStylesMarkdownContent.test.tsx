import React from 'react';
import { mount } from 'cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import WithoutStylesMarkdownContent from './WithoutStylesMarkdownContent';

describe('WithoutStylesMarkdownContent', () => {
  const mockStore = createMockStore([]);
  const store = mockStore({});
  const markdownText = '# Lorem Ipsum \n\n[Link](https://broadinstitute.org)';
  it('should render markdown', () => {
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <WithoutStylesMarkdownContent markdownText={markdownText} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.root().children().should('have.length', 2);
    cy.root().get('h1').should('contain.text', 'Lorem Ipsum');
    cy.root().get('p').children().should('have.length', 1);
    cy.root().get('p').get('a').should('have.attr', 'href').and('include', 'broad');
  });
  it('should render as text', () => {
    const htmlText = '<a href="www.badsite.com">A bad day</a>';
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <WithoutStylesMarkdownContent markdownText={htmlText} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.root().should('have.length', 1);
    cy.root().get('p').should('contain.text', 'A bad day');
    cy.root().get('p').children().should('have.length', 0);
  });
  it('should contain no text', () => {
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <WithoutStylesMarkdownContent markdownText={undefined} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('[data-cy="withoutstyles-markdown-text"]').children().should('have.length', 0);
  });
});
