import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Switch, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';

import { logout } from 'modules/auth';
import Home from 'routes/Home';
import HeadlessLogin from 'routes/HeadlessLogin';
import Private from 'routes/Private';
import NotFound from 'routes/NotFound';
import Logo from 'components/Logo';

import RoutePublic from 'components/RoutePublic';
import RoutePrivate from 'components/RoutePrivate';
import { ReactComponent as CarrotSVG } from 'media/icons/angle-line.svg';
import { ReactComponent as SignOutSVG } from 'media/icons/logout-line.svg';
import { logOut } from 'actions';

import 'react-notifications-component/dist/theme.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight,
    flex: 1,
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
    borderBottomColor: 'rgba(116,174,67,0.75)',
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
      backgroundColor: 'transparent',
    },
  },
  content: {
    flexGrow: 1,
    paddingTop: 64,
    display: 'flex',
    flexDirection: 'column',
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
    padding: `0 ${theme.spacing(2)}px 0 0`,
  },
}));

export function App(props) {
  const { user, dispatch, configuration } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ReactNotification />
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Logo />
          <div className={classes.grow} />
          {user.isAuthenticated && (
            <div className={classes.userSection}>
              <div>
                {user.image ? <Avatar src={user.image} alt={user.name} /> : <AccountCircle />}
              </div>
              <div className={classes.userName}>{user.name}</div>
              <div>
                <Button
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={handleMenu}
                  className={classes.carrotButton}
                  color="inherit"
                >
                  <CarrotSVG className={open ? classes.carrotOpen : classes.carrotClose} />
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
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
                  <MenuItem
                    className={classes.signOutText}
                    onClick={() => {
                      logout({ clientId: configuration.clientId }).then(() => {
                        dispatch(logOut());
                        handleClose();
                      });
                    }}
                  >
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
        <Switch>
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
          <RoutePrivate
            isAuthenticated={user.isAuthenticated}
            path="/"
            component={Private}
            features={user.features}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

App.propTypes = {
  configuration: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    configuration: state.configuration,
  };
}

export default hot(connect(mapStateToProps)(App));
