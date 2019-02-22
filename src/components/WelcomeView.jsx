import React from 'react';
import { GoogleLogin } from 'react-google-login';

class WelcomeView extends React.PureComponent {
  render() {
    const responseGoogle = response => {
      console.log(response);
    };
    return (
      <div>
        <div>
          <GoogleLogin
            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            theme="dark"
          />
        </div>

        <h3>New User?</h3>
        <h3>Data Repository Requires a Terra Google account.</h3>
        <a ref="https://app.terra.bio/">Need to create a Terra account?</a>
        <hr />

        <div>
          <div>
            Warning Notice Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
            bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.
            Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis
            tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeView;
