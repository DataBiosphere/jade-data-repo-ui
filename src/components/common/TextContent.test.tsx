import React from 'react';
import { mount } from '@cypress/react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/styles';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import history from '../../modules/hist';
import globalTheme from '../../modules/theme';
import TextContent from './TextContent';

const markdownText = '# Lorem Ipsum \n\n[Link](https://broadinstitute.org)';

const htmlText = '<a href="www.badsite.com">A bad day</a>';

describe('WithoutStylesMarkdownContent', () => {
  const mockStore = createMockStore([]);
  const store = mockStore({});
  it('should render markdown', () => {
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TextContent text={markdownText} markdown={true} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('div#__cy_root > div').children().should('have.length', 2);
    cy.get('div#__cy_root > div > h1').should('contain.text', 'Lorem Ipsum');
    cy.get('div#__cy_root > div > p').children().should('have.length', 1);
    cy.get('div#__cy_root > div > p > a').should('have.attr', 'href').and('include', 'broad');
  });
  it('should render as text', () => {
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TextContent text={htmlText} markdown={true}/>
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('div#__cy_root > div').children().should('have.length', 1);
    cy.get('div#__cy_root > div > p').should('contain.text', 'A bad day');
    cy.get('div#__cy_root > div > p').children().should('have.length', 0);
  });
  it('should contain empty text', () => {
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TextContent text={undefined} markdown={true} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('div#__cy_root').children().should('have.length', 1);
    cy.get('div#__cy_root').children().should('have.text', '(empty)');
  });
  it('should contain custom empty text', () => {
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TextContent text={undefined} emptyText="custom" markdown={true}/>
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('div#__cy_root').children().should('have.length', 1);
    cy.get('div#__cy_root').children().should('have.text', 'custom');
  });

  it('should strip markdown', () => {
    mount(
      <Router history={history}>
        <Provider store={store}>
          <ThemeProvider theme={globalTheme}>
            <TextContent text={markdownText} stripMarkdown={true} markdown={true} />
          </ThemeProvider>
        </Provider>
      </Router>,
    );
    cy.get('div#__cy_root').children().should('have.length', 0);
    cy.get('div#__cy_root').should('have.text', 'Lorem Ipsum\nLink');
  });
});
