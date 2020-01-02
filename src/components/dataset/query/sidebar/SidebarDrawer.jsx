import React, { Fragment } from 'react';
import { List, ListItem, Box, Drawer } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    position: 'absolute',
    top: '65px',
    right: '0px',
    height: '100%',
    zIndex: 10,
  },
  drawer: {
    top: '65px',
    right: '56px',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPosition: {
    position: 'absolute',
  },
  drawerOpen: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  iconList: {
    color: theme.palette.primary.light,
  },
});

export class SidebarDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentKey: null,
      PanelComponent: null,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    panels: PropTypes.array,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleButtonClick = (key, PanelComponent) => {
    const { currentKey, open } = this.state;
    if (currentKey == null || !open) {
      this.setState({ open: true, currentKey: key, PanelComponent });
    } else {
      this.setState({ open: false, currentKey: null });
    }
  };

  render() {
    const { classes, panels } = this.props;
    const { open, PanelComponent } = this.state;
    return (
      <Fragment>
        {PanelComponent != null && (
          <Drawer
            variant="permanent"
            anchor="right"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx(classes.drawer, classes.drawerPosition, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
            open={open}
          >
            <PanelComponent />
          </Drawer>
        )}
        <Box className={classes.root}>
          <List>
            {panels.map((panel, i) => {
              const IconComponent = panel.icon;
              return (
                <ListItem button key={i}>
                  <IconComponent onClick={() => this.handleButtonClick(i, panel.component)} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Fragment>
    );
  }
}

export default withStyles(styles)(SidebarDrawer);
