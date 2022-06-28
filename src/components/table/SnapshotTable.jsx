import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { renderCloudPlatforms } from '../../libs/render-utils';

import LightTable from './LightTable';

const styles = (theme) => ({
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

class SnapshotTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    filteredSnapshotCount: PropTypes.number,
    handleFilterSnapshots: PropTypes.func,
    loading: PropTypes.bool.isRequired,
    searchString: PropTypes.string,
    snapshotCount: PropTypes.number,
    snapshots: PropTypes.array.isRequired,
  };

  render() {
    const {
      classes,
      handleFilterSnapshots,
      snapshotCount,
      filteredSnapshotCount,
      loading,
      snapshots,
      searchString,
    } = this.props;
    // TODO add back modified_date column
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
      {
        label: 'Storage Regions',
        name: 'storage',
        allowSort: false,
        render: (row) => Array.from(new Set(row.storage.map((s) => s.region))).join(', '),
      },
      {
        label: 'Cloud Platform',
        name: 'platform',
        allowSort: false,
        render: renderCloudPlatforms,
      },
    ];
    return (
      <div>
        <LightTable
          columns={columns}
          handleEnumeration={handleFilterSnapshots}
          noRowsMessage={
            filteredSnapshotCount < snapshotCount
              ? 'No snapshots match your filter'
              : 'No snapshots have been created yet'
          }
          rows={snapshots}
          totalCount={snapshotCount}
          filteredCount={filteredSnapshotCount}
          searchString={searchString}
          loading={loading}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SnapshotTable);
