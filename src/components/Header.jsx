import React from 'react';
import PropTypes from 'prop-types';
import rgba from 'polished/lib/color/rgba';
import Button from '@material-ui/core/Button';

import { appColor, headerHeight } from 'modules/theme';
import Logo from 'components/Logo';

const wrapperStyles = {
  backgroundColor: rgba(appColor, 0.9),
  height: headerHeight + 'px',
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 200,
};

const containerStyles = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  height: '100%',
  justifyContent: 'space-between',
};

export default class Header extends React.PureComponent {
  static propTypes = {
    logOutClicked: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user, logOutClicked } = this.props;
    return (
      <div>
        <div style={wrapperStyles}>
          <div style={containerStyles}>
            <Logo />
            {user.isAuthenticated && (
              <Button variant="outlined" onClick={logOutClicked}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
