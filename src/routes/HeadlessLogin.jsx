import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import history from '../modules/hist';

import { logIn } from '../actions/index';

const styles = theme => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: theme.typography.fontFamily,
  minHeight: '100vh',
});

export class HeadlessLogin extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const [throwaway, login, token] = history.location.pathname.split('/');

    dispatch(logIn('user.name', 'user.imageUrl', 'user.email', token, 1615064728000));
  }

  render() {
    const { classes, dispatch } = this.props;

    return <div></div>;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(withStyles(styles)(HeadlessLogin));
