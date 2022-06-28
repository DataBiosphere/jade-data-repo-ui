import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';

import { connect } from 'react-redux';
import LightTable from './LightTable';
import { getDatasetSnapshots } from '../../actions';

const styles = (theme) => ({
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

class DatasetSnapshotsTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    snapshotCount: PropTypes.number,
    snapshots: PropTypes.array.isRequired,
    summary: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch, dataset } = this.props;
    dispatch(getDatasetSnapshots(null, null, 'created_date', 'desc', [dataset.id]));
  }

  handleFilterSnapshots = (limit, offset, sort, sortDirection) => {
    const { dispatch, dataset } = this.props;
    dispatch(getDatasetSnapshots(limit, offset, sort, sortDirection, [dataset.id]));
  };

  render() {
    const { classes, loading, snapshotCount, snapshots, summary } = this.props;
    const columns = [
      {
        label: 'Snapshot Name',
        name: 'name',
        allowSort: true,
        render: (row) => (
          <Link to={`/snapshots/${row.id}`}>
            <span className={classes.jadeLink}>{row.name}</span>
          </Link>
        ),
      },
      {
        label: 'Description',
        name: 'description',
        allowSort: true,
      },
      {
        label: 'Date created',
        name: 'created_date',
        allowSort: true,
        render: (row) => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div>
        <LightTable
          columns={columns}
          handleEnumeration={this.handleFilterSnapshots}
          filteredCount={snapshotCount}
          noRowsMessage="No snapshots have been created yet"
          rows={snapshots}
          summary={summary}
          totalCount={snapshotCount}
          loading={loading}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    snapshots: state.datasets.datasetSnapshots,
    snapshotCount: state.datasets.datasetSnapshotsCount,
    loading: state.datasets.loading,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetSnapshotsTable));
