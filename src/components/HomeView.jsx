import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { getDatasets, getSnapshots } from 'actions/index';
import SnapshotTable from './table/SnapshotTable';
import DatasetTable from './table/DatasetTable';

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
    color: theme.palette.common.link,
    float: 'right',
    fontSize: 16,
    fontWeight: 500,
    height: 20,
    letterSpacing: 0.3,
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(4),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  wrapper: {
    display: 'flex',
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    width: '70%',
  },
});

class HomeView extends React.PureComponent {
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

  render() {
    const { classes, datasets, features, snapshots } = this.props;
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.title}>Terra Data Repository at a glance</div>
          <div className={classes.header}> RECENT DATASETS </div>
          <DatasetTable summary datasets={datasets} features={features} />
          <div>
            <Link to="/datasets" className={classes.jadeLink}>
              See all Datasets
            </Link>
          </div>
          <div className={classes.jadeTableSpacer} />
          <div className={classes.header}>RECENT SNAPSHOTS</div>
          <SnapshotTable summary snapshots={snapshots} />
          <div>
            <Link to="/snapshots" className={classes.jadeLink}>
              See all Snapshots
            </Link>
          </div>
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
