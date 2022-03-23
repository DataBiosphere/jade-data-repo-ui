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

class SnapshotTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    filteredSnapshotCount: PropTypes.number,
    handleFilterSnapshots: PropTypes.func,
    searchString: PropTypes.string,
    snapshotCount: PropTypes.number,
    snapshots: PropTypes.array.isRequired,
    summary: PropTypes.bool,
  };

  render() {
    const {
      classes,
      handleFilterSnapshots,
      snapshotCount,
      filteredSnapshotCount,
      snapshots,
      summary,
      searchString,
    } = this.props;
    // TODO add back modified_date column
    const columns = [
      {
        label: 'Snapshot Name',
        property: 'name',
        render: (row) => (
          <Link to={`/snapshots/${row.id}`} className={classes.jadeLink}>
            {row.name}
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
      {
        label: 'Storage Regions',
        property: 'storage',
        render: (row) => Array.from(new Set(row.storage.map((s) => s.region))).join(', '),
      },
      {
        label: 'Cloud Platform',
        property: 'platform',
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
}

export default withStyles(styles)(SnapshotTable);
