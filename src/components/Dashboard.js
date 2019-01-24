import React, { Component } from 'react'
import { div, h } from 'react-hyperscript-helpers'
import * as Nav from '../nav'

import jade from '../jade.png';
import '../App.css';

class HeroDashboard extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={jade} className="App-logo" alt="jade" />
          <p>
            Welcome to the Jade Data Repository!
          </p>
          <a
            className="App-link"
            href="https://github.com/DataBiosphere/jade-data-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            See the Jade source code
          </a>
        </header>
      </div>
    )
  }
}

const addNavPaths = () => {
  Nav.defRedirect({ regex: /^.{0}$/, makePath: () => 'dashboard' })
  Nav.defPath(
    'dashboard',
    {
      component: props => h(HeroDashboard, props),
      regex: /dashboard/,
      makeProps: () => {},
      makePath: () => 'dashboard'
    }
  )
}

export { HeroDashboard, addNavPaths }
