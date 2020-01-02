import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { getSnapshots } from 'actions/index';
import LightTable from './LightTable';

const styles = theme => ({
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
    dispatch: PropTypes.func.isRequired,
    snapshotCount: PropTypes.number,
    snapshots: PropTypes.array.isRequired,
    summary: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch, summary } = this.props;
    let limit = 5;
    if (!summary) {
      limit = 10;
    }
    dispatch(getSnapshots(limit));
  }

  handleFilterSnapshots = (limit, offset, sort, sortDirection, searchString) => {
    const { dispatch } = this.props;
    dispatch(getSnapshots(limit, offset, sort, sortDirection, searchString));
  };

  render() {
    const { classes, snapshotCount, snapshots, summary } = this.props;
    // TODO add back modified_date column
    const columns = [
      {
        label: 'Snapshot Name',
        property: 'name',
        render: row => (
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
        render: row => moment(row.createdDate).fromNow(),
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
    snapshots: state.snapshots.snapshots,
    snapshotCount: state.snapshots.snapshotCount,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotTable));
