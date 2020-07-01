import React, { Fragment } from 'react';
import { List, ListItem, Box, Drawer } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = (theme) => ({
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
  drawerOpen: (props) => ({
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
  active: {
    backgroundColor: theme.palette.primary.light,
  },
});

export class SidebarDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      PanelComponent: null,
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

  handleOpenPanel = (PanelComponent) => {
    const { handleDrawerWidth, panels } = this.props;
    // look through panels prop for the width of the given PanelComponent
    const { width } = panels.find((panel) => panel.component === PanelComponent);

    if (this.state.PanelComponent === PanelComponent) {
      this.setState({ PanelComponent: null });
    } else {
      handleDrawerWidth(width);
      this.setState({ PanelComponent });
    }
  };

  render() {
    const { panels, classes, table, selected } = this.props;
    const { PanelComponent } = this.state;
    const open = PanelComponent !== null;
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
            <PanelComponent
              open={open}
              table={table}
              selected={selected}
              switchPanels={this.handleOpenPanel}
            />
          )}
        </Drawer>
        <Box className={classes.root}>
          <List>
            {panels.map((panel, i) => {
              const IconComponent = panel.icon;
              return (
                <ListItem
                  className={clsx({
                    [classes.active]: panel.component === PanelComponent,
                  })}
                  button
                  key={i}
                  onClick={() => this.handleOpenPanel(panel.component)}
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
