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
    snapshotCount: PropTypes.number,
    snapshots: PropTypes.array.isRequired,
    summary: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch, dataset } = this.props;
    dispatch(getDatasetSnapshots(null, null, null, null, [dataset.id]));
  }

  handleFilterSnapshots = (limit, offset, sort, sortDirection) => {
    const { dispatch, dataset } = this.props;
    dispatch(getDatasetSnapshots(limit, offset, sort, sortDirection, [dataset.id]));
  };

  render() {
    const { classes, snapshotCount, snapshots, summary } = this.props;
    const columns = [
      {
        label: 'Snapshot Name',
        property: 'name',
        render: (row) => (
          <Link to={`/snapshots/details/${row.id}`}>
            <span className={classes.jadeLink}>{row.name}</span>
          </Link>
        ),
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Date created',
        property: 'created_date',
        render: (row) => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div>
        <LightTable
          columns={columns}
          handleEnumeration={this.handleFilterSnapshots}
          itemType="snapshots"
          rows={snapshots}
          summary={summary}
          totalCount={snapshotCount}
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
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetSnapshotsTable));
