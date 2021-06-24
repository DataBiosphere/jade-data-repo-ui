import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import LightTable from './LightTable';

const styles = (theme) => ({
  jadeLink: {
    color: theme.palette.common.link,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

class SnapshotTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleFilterSnapshots: PropTypes.func,
    snapshotCount: PropTypes.number,
    filteredSnapshotCount: PropTypes.number,
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
    } = this.props;
    // TODO add back modified_date column
    const columns = [
      {
        label: 'Snapshot Name',
        property: 'name',
        render: (row) => (
          <Link to={`/snapshots/details/${row.id}`} className={classes.jadeLink}>
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
        />
      </div>
    );
  }
}

export default withStyles(styles)(SnapshotTable);
