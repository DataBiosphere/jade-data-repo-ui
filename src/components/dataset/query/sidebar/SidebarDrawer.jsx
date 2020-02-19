import React, { Fragment } from 'react';
import { List, ListItem, Box, Drawer } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.lightContrast,
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
    backgroundColor: theme.palette.primary.light,
  },
  drawerPosition: {
    position: 'absolute',
  },
  drawerOpen: props => ({
    width: props.width,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    [theme.breakpoints.up('sm')]: {
      width: 0,
    },
  },
  iconList: {
    color: theme.palette.primary.light,
  },
  active: {
    backgroundColor: theme.palette.primary.light,
  },
});

export class SidebarDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentKey: null,
      PanelComponent: null,
      dataset: null,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    handleDrawerWidth: PropTypes.func,
    panels: PropTypes.array,
    selected: PropTypes.string,
    width: PropTypes.number,
    table: PropTypes.object,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleButtonClick = (key, PanelComponent, dataset, width) => {
    const { currentKey, open } = this.state;
    const { handleDrawerWidth } = this.props;

    if (currentKey == null || !open) {
      handleDrawerWidth(width);
      this.setState({ open: true, currentKey: key, PanelComponent, dataset });
    } else if (currentKey !== key && open) {
      handleDrawerWidth(width);
      this.setState({ currentKey: key, PanelComponent, dataset });
    } else {
      this.setState({ open: false, currentKey: null });
    }
  };

  render() {
    const { panels, classes, table, selected } = this.props;
    const { open, PanelComponent, dataset, currentKey } = this.state;

    return (
      <Fragment>
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
          {PanelComponent != null && (
            <PanelComponent open={open} table={table} dataset={dataset} selected={selected} />
          )}
        </Drawer>
        <Box className={classes.root}>
          <List>
            {panels.map((panel, i) => {
              const IconComponent = panel.icon;
              return (
                <ListItem
                  className={clsx({
                    [classes.active]: i === currentKey,
                  })}
                  button
                  key={i}
                  onClick={() =>
                    this.handleButtonClick(i, panel.component, panel.dataset, panel.width)
                  }
                >
                  <IconComponent />
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
