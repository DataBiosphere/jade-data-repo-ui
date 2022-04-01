import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';
import { logIn } from '../actions/index';

const styles = () => ({
  wrapper: {
    marginTop: 500,
  },
});

export class HeadlessLogin extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleChange = (event) => {
    this.setState({
      token: event.target.value,
    });
  };

  handleLoginButton = () => {
    const { dispatch } = this.props;
    const { token } = this.state;

    const expireTime = Date.now() + 8640000;

    dispatch(logIn('user.name', 'user.imageUrl', 'user.email', token, expireTime));
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <h1>michael's secret login page</h1>
        <TextField id="tokenInput" label="Password" type="password" onChange={this.handleChange} />
        <Button id="e2eLoginButton" onClick={this.handleLoginButton}>
          Log In
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(withStyles(styles)(HeadlessLogin));
