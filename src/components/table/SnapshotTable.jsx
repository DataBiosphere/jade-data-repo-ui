import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { renderCloudPlatforms } from '../../libs/render-utils';

import LightTable from './LightTable';

const styles = (theme) => ({
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

function SnapshotTable({
  classes,
  filteredSnapshotCount,
  handleFilterSnapshots,
  searchString,
  snapshotCount,
  snapshots,
  summary,
}) {
  // TODO add back modified_date column
  const columns = [
    {
      label: 'Snapshot Name',
      name: 'name',
      allowSort: true,
      render: (row) => (
        <Link to={`/snapshots/${row.id}`} className={classes.jadeLink}>
          {row.name}
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
        itemType="snapshots"
        rows={snapshots}
        summary={summary}
        totalCount={snapshotCount}
        filteredCount={filteredSnapshotCount}
        searchString={searchString}
      />
    </div>
  );
}

SnapshotTable.propTypes = {
  classes: PropTypes.object.isRequired,
  filteredSnapshotCount: PropTypes.number,
  handleFilterSnapshots: PropTypes.func,
  searchString: PropTypes.string,
  snapshotCount: PropTypes.number,
  snapshots: PropTypes.array.isRequired,
  summary: PropTypes.bool,
};

export default withStyles(styles)(SnapshotTable);
