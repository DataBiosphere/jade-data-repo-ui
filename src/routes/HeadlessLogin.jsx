import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { logIn } from '../actions/index';

export class HeadlessLogin extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(
      logIn(
        'user.name',
        'user.imageUrl',
        'user.email',
        process.env.REACT_APP_GOOGLE_TOKEN,
        1615064728000,
      ),
    );
  }

  render() {
    return <div />;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(HeadlessLogin);
