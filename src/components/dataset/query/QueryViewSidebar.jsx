import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

import QueryViewSidebarItem from './QueryViewSidebarItem';
import { applyFilters } from '../../../actions';

const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
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
    'border-radius': '0%',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    top: 'auto',
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
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
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});

export class QueryViewSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      filterMap: {},
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    table: PropTypes.object,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChange = value => {
    const { filterMap } = this.state;
    const clonedMap = _.clone(filterMap);

    if (value.value.length <= 0) {
      delete clonedMap[value.name];
    } else {
      clonedMap[value.name] = value.value;
    }

    this.setState({ filterMap: clonedMap });
  };

  handleFilters = () => {
    const { dispatch } = this.props;
    const { filterMap } = this.state;
    dispatch(applyFilters(filterMap));
  };

  render() {
    const { classes, table } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          anchor="right"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          open={open}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={this.handleDrawerClose}
            className={clsx(classes.menuButton, {
              [classes.hide]: !open,
            })}
          >
            <ChevronRightIcon />
          </IconButton>
          <Button onClick={this.handleFilters}>Apply Filters</Button>
          <Divider />
          {table &&
            table.columns.map(c => (
              <ExpansionPanel key={c.name}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-content-${c.name}`}
                  id={`panel-header-${c.name}`}
                >
                  <Typography className={classes.heading}>{c.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <QueryViewSidebarItem column={c} handleChange={this.handleChange} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
        </Drawer>
      </div>
    );
  }
}

export default connect()(withStyles(styles)(QueryViewSidebar));
