import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

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
  return { user: state.user };
}

export default connect(mapStateToProps)(withStyles(styles)(HeadlessLogin));
