import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { getDatasets, getSnapshots } from 'actions/index';
import Tab from '@material-ui/core/Tab';
import { Tabs } from '@material-ui/core';
import DatasetView from './DatasetView';
import SnapshotView from './SnapshotView';

const styles = (theme) => ({
  header: {
    alignItems: 'center',
    color: theme.typography.color,
    display: 'flex',
    fontWeight: 500,
    fontSize: 16,
    height: 21,
    letterSpacing: 1,
  },
  jadeTableSpacer: {
    paddingBottom: theme.spacing(12),
  },
  jadeLink: {
    ...theme.mixins.jadeLink,
    float: 'right',
    fontSize: 16,
    fontWeight: 500,
    height: 20,
    letterSpacing: 0.3,
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  title: {
    color: theme.palette.secondary.dark,
    fontSize: '1.5rem',
    fontWeight: 700,
    paddingBottom: '1rem',
  },
  wrapper: {
    display: 'flex',
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    ...theme.mixins.containerWidth,
  },
  tabsRoot: {
    color: '#333F52',
    fontFamily: theme.typography.fontFamily,
    height: 18,
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 18,
    textAlign: 'center',
  },
  tabSelected: {
    fontWeight: 700,
    color: theme.palette.secondary.dark,
    bottomBar: '6px',
  },
  tabsIndicator: {
    borderBottom: `6px solid ${theme.palette.secondary.main}`,
    transition: 'none',
  },
});

class HomeView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: '/datasets',
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasets: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    features: PropTypes.object,
    snapshots: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getDatasets(5));
    dispatch(getSnapshots(5));
  }

  handleTabChange = (event, value) => {
    console.log(value);
    this.setState({ tabValue: value });
  };

  render() {
    const { classes, datasets, features, snapshots } = this.props;
    const { tabValue } = this.state;
    let tableValue;

    if (tabValue === '/datasets') {
      tableValue = <DatasetView />;
    } else if (tabValue === '/snapshots') {
      tableValue = <SnapshotView />;
    } else {
      throw 'Invalid tab value';
    }

    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.title}>Terra Data Repository</div>
          <Tabs
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
            value={tabValue}
            onChange={this.handleTabChange}
          >
            <Tab
              label="Datasets"
              component={Link}
              value="/datasets"
              to="/datasets"
              classes={{ selected: classes.tabSelected }}
              disableFocusRipple
              disableRipple
            />
            <Tab
              label="Snapshots"
              component={Link}
              value="/snapshots"
              to="/snapshots"
              classes={{ selected: classes.tabSelected }}
              disableFocusRipple
              disableRipple
            />
          </Tabs>
          {tableValue}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    datasets: state.datasets.datasets,
    features: state.user.features,
    snapshots: state.snapshots.snapshots,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(HomeView));
