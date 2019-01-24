import { Component } from 'react'
import * as Nav from '../libs/nav'

import _ from 'lodash/fp'
import { div, h, h2 } from 'react-hyperscript-helpers'
import FooterWrapper from './FooterWrapper'
import TopBar from './TopBar'

const pageWrapStyle = { minHeight: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }

const initNavPaths = () => {
  Nav.clearPaths()
}

export default class Router extends Component {
  constructor(props) {
    super(props)
    this.state = { pathname: undefined }
  }

  componentDidMount() {
    initNavPaths()
    this.setState({ pathname: Nav.history.location.pathname, search: Nav.history.location.search })
    this.unlisten = Nav.history.listen(
      ({ pathname, search }) => this.setState({ pathname, search })
    )
  }

  // FIXME - shouldn't be using unsafe methods
  UNSAFE_componentWillReceiveProps() { // eslint-disable-line camelcase
    initNavPaths()
  }

  componentDidUpdate(prevProps, prevState) {
    const { pathname, search } = this.state
    if (prevState.pathname === pathname) return

    const handler = Nav.findHandler(pathname)

    if (handler && handler.title) {
      if (_.isFunction(handler.title)) {
        document.title = handler.title(Nav.getHandlerProps(handler, pathname, search))
      } else {
        document.title = handler.title
      }
    } else {
      document.title = 'Terra'
    }
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { pathname, search } = this.state
    if (pathname === undefined) {
      return null
    }
    const handler = Nav.findHandler(pathname)
    if (!handler) {
      return h(FooterWrapper, [
        h(TopBar),
        div({ style: { marginLeft: '1rem', ...pageWrapStyle } }, [
          h2('Page not found')
        ])
      ])
    }
    const el = div({ style: pageWrapStyle }, [
      h(handler.component, {
        key: pathname, // forces a remount even if component is the same
        ...Nav.getHandlerProps(handler, pathname, search)
      })
    ])
    return h("AuthContainer, { isPublic: handler.public }, [el]")
  }
}
