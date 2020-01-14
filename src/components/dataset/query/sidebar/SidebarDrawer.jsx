import React, { Fragment } from 'react';
import { List, ListItem, Box, Drawer } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.light,
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
    backgroundColor: theme.palette.primary.lightContrast,
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
    backgroundColor: theme.palette.primary.lightContrast,
  }
});

export class SidebarDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentKey: null,
      PanelComponent: null,
      table: null,
      dataset: null,
      prevKey: null,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    panels: PropTypes.array,
    handleDrawerWidth: PropTypes.func,
    width: PropTypes.number,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleButtonClick = (key, PanelComponent, table, dataset, width) => {
    const { currentKey, open } = this.state;
    const { handleDrawerWidth } = this.props;
    console.log(key);
    if (currentKey == null || !open) {
      handleDrawerWidth(width);
      this.setState({ open: true, currentKey: key, PanelComponent, table, dataset });
    } else if (currentKey !== key && open) {
      handleDrawerWidth(width);
      this.setState({ currentKey: key, PanelComponent, table, dataset });
    } else {
      this.setState({ open: false, currentKey: null });
    }
  };

  render() {
    const { panels, classes } = this.props;
    const { open, PanelComponent, table, dataset, currentKey } = this.state;
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
          {PanelComponent != null && <PanelComponent open={open} table={table} dataset={dataset} />}
        </Drawer>
        <Box className={classes.root}>
          <List>
            {panels.map((panel, i) => {
              const IconComponent = panel.icon;
              return (
                <ListItem className={clsx({
                  [classes.active]: i === currentKey,
                })}
                  button
                  key={i}
                  onClick={() =>
                    this.handleButtonClick(i, panel.component, panel.table, panel.dataset, panel.width)
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
