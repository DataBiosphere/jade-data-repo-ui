import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Switch, Route } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import { withStyles } from 'tss-react/mui';
import { AppBar, Backdrop, Button, Menu, MenuItem, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import Home from 'routes/Home';
import HeadlessLogin from 'routes/HeadlessLogin';
import Private from 'routes/Private';
import NotFound from 'routes/NotFound';
import Logo from 'components/Logo';

import RoutePublic from 'components/RoutePublic';
import RoutePrivate from 'components/RoutePrivate';
import { ReactComponent as CarrotSVG } from 'media/icons/angle-line.svg';
import { ReactComponent as SignOutSVG } from 'media/icons/logout-line.svg';
import HeaderLeft from 'media/images/header-left-hexes.svg';
import HeaderRight from 'media/images/header-right-hexes.svg';
import 'react-notifications-component/dist/theme.css';
import ServerErrorView from 'components/ServerErrorView';
import { LogoutIframe, IdleStatusMonitor } from 'components/IdleStatusMonitor';
import { useAuth } from 'react-oidc-context';
import TerraAvatar from 'components/common/TerraAvatar';
import LoadingSpinner from 'components/common/LoadingSpinner';

import { logOut, logInSuccess, getUserStatus, userRefresh } from '../actions';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    height: '100%',
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight,
    backgroundColor: '#fafafa',
  },
  grow: {
    flexGrow: 1,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    background: `0px url(${HeaderLeft}) no-repeat,right url(${HeaderRight}) no-repeat`,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    borderBottom: '1px solid #FFFF00',
    borderBottomColor: theme.palette.terra.green,
    boxShadow: 'none',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: 0,
  },
  carrotClose: {
    fill: theme.palette.primary.contrastText,
    height: 19,
    transform: 'scaleY(-1)',
    width: 19,
  },
  carrotOpen: {
    fill: theme.palette.primary.contrastText,
    height: 19,
    width: 19,
  },
  carrotButton: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  content: {
    height: '100%',
  },
  userName: {
    height: 15,
    fontSize: 12,
    fontWeight: 600,
    paddingLeft: 10,
  },
  userSection: {
    alignItems: 'center',
    display: 'flex',
  },
  signOut: {
    height: 15,
  },
  signOutText: {
    fontSize: 12,
    padding: `0 ${theme.spacing(2)} 0 0`,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
});

export function App(props) {
  const { classes, user, dispatch, configuration, status } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [renderLogout, setRenderLogout] = useState(false);
  const open = Boolean(anchorEl);

  const auth = useAuth();
  // This effect clause is needed to handle when the auth library loads the token on page refresh
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading && !user.isAuthenticated && !auth.activeNavigator) {
      dispatch(logInSuccess(auth.user));
      dispatch(getUserStatus());
      auth.events.addUserLoaded((u) => dispatch(userRefresh(u)));
    }
  }, [auth, dispatch, user]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = () => {
    const { isTimeoutEnabled } = user;
    dispatch(logOut(auth));
    handleClose();
    if (isTimeoutEnabled) {
      setRenderLogout(true);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <IdleStatusMonitor user={user} signOut={signOut} />
      {renderLogout && <LogoutIframe id={user.id} dismissLogout={() => setRenderLogout(false)} />}
      <ReactNotifications />
      <AppBar classes={{ root: classes.appBar }}>
        <Toolbar className={classes.toolbar}>
          <Logo />
          <div className={classes.grow} />
          {user.isAuthenticated && user.isInitiallyLoaded && (
            <div className={classes.userSection}>
              <div>
                <TerraAvatar />
              </div>
              <div className={classes.userName}>{user.name}</div>
              <div>
                <Button
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={handleMenu}
                  className={classes.carrotButton}
                  color="inherit"
                  disableRipple
                >
                  <CarrotSVG className={open ? classes.carrotOpen : classes.carrotClose} />
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  getcontentanchorel={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem className={classes.signOutText} onClick={signOut}>
                    <SignOutSVG className={classes.signOut} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        {!status.tdrOperational && <ServerErrorView />}
        {status.tdrOperational && configuration.configObject.clientId && !auth.isLoading && (
          <Switch>
            <Route path="/redirect-from-oauth" exact component={LoadingSpinner} />
            <RoutePublic
              isAuthenticated={user.isAuthenticated}
              path="/login"
              exact
              component={Home}
            />
            <RoutePublic
              isAuthenticated={user.isAuthenticated}
              path="/login/e2e"
              exact
              component={HeadlessLogin}
            />
            {user.isInitiallyLoaded && (
              <RoutePrivate
                isAuthenticated={user.isAuthenticated}
                path="/"
                component={Private}
                features={user.features}
              />
            )}
            {!user.isInitiallyLoaded && (
              <RoutePrivate
                isAuthenticated={auth.isAuthenticated && !auth.isLoading && !user.isTest}
                path="/"
                component={LoadingSpinner}
              />
            )}
            <Route component={NotFound} />
          </Switch>
        )}
        {/* Show the welcome page with an overlay while the login dialog is open */}
        {status.tdrOperational && configuration.configObject.clientId && auth.isLoading && (
          <Fragment>
            <Home key="home" />
            <Backdrop key="backdrop" className={classes.backdrop} open={true} />
          </Fragment>
        )}
      </div>
    </div>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  configuration: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    configuration: state.configuration,
    status: state.status,
  };
}

export default hot(connect(mapStateToProps)(withStyles(App, styles)));
