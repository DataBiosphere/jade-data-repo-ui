import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';

import { logOut, logIn } from 'actions/index';
import config from 'config';

class WelcomeView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };


  render() {
    const onSignInFailure = response => {
      const { dispatch } = this.props;
      dispatch(logOut());
    };

    const onSignInSuccess = response => {
      const { dispatch } = this.props;
      dispatch(logIn());
    };
    return (
      <div>
        <h1>Welcome to the {config.description}</h1>
        <div>
          <GoogleLogin // stealing clientId from Terra
            clientId="500025638838-s2v23ar3spugtd5t2v1vgfa2sp7ppg0d.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={onSignInSuccess}
            onFailure={onSignInFailure}
            theme="dark"
          />
        </div>

        <h3>New User?</h3>
        <h3>Data Repository Requires a Terra Google account.</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.
          Proin sodales pulvinar sic tempor.
        </p>
        <a ref="https://app.terra.bio/">Need to create a Terra account?</a>
        <hr />

        <div>
          <div>
            <div>Warning Notice</div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
              bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.
              Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient
              montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis
              tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeView;
