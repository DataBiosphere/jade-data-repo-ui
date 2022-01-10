import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { getSnapshots } from 'actions/index';
import SnapshotTable from './table/SnapshotTable';
import SnapshotPopup from './snapshot/SnapshotPopup';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
    margin: '1rem',
  },
  width: {
    ...theme.mixins.containerWidth,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: 54,
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
});

class SnapshotView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    snapshotCount: PropTypes.number,
    filteredSnapshotCount: PropTypes.number,
    snapshots: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getSnapshots());
  }

  handleFilterSnapshots = (limit, offset, sort, sortDirection, searchString) => {
    const { dispatch } = this.props;
    // TODO: should we allow filtering on dataset id here?
    const datasetIds = [];
    dispatch(getSnapshots(limit, offset, sort, sortDirection, searchString, datasetIds));
  };

  render() {
    const { classes, snapshotCount, filteredSnapshotCount, snapshots } = this.props;
    return (
      <div id="snapshots" className={classes.wrapper}>
        <div className={classes.width}>
          <div>
            <SnapshotTable
              snapshotCount={snapshotCount}
              filteredSnapshotCount={filteredSnapshotCount}
              snapshots={snapshots}
              handleFilterSnapshots={this.handleFilterSnapshots}
            />
          </div>
        </div>
        <SnapshotPopup />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    snapshots: state.snapshots.snapshots,
    snapshotCount: state.snapshots.snapshotCount,
    filteredSnapshotCount: state.snapshots.filteredSnapshotCount,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotView));
