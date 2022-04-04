import React, { Fragment } from 'react';
import { List, ListItem, Box, Drawer } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.lightContrast,
    position: 'absolute',
    top: '112px',
    right: '0px',
    bottom: '0px',
    zIndex: 10,
  },
  drawer: {
    top: '112px',
    right: '56px',
    bottom: '0px',
    flexShrink: 0,
    backgroundColor: theme.palette.primary.light,
    height: 'initial',
    zIndex: 10,
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
    canLink: PropTypes.bool,
    classes: PropTypes.object,
    handleDrawerWidth: PropTypes.func,
    panels: PropTypes.array,
    selected: PropTypes.string,
    table: PropTypes.object,
  };

  handleOpenPanel = (InputPanelComponent) => {
    const { handleDrawerWidth, panels } = this.props;
    const { PanelComponent } = this.state;
    // look through panels prop for the width of the given InputPanelComponent
    const { width } = panels.find((panel) => panel.component === InputPanelComponent);

    if (PanelComponent === InputPanelComponent) {
      this.setState({ PanelComponent: null });
    } else {
      handleDrawerWidth(width);
      this.setState({ PanelComponent: InputPanelComponent });
    }
  };

  render() {
    const { panels, classes, table, selected, canLink } = this.props;
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
              canLink={canLink}
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
