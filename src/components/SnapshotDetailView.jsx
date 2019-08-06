import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getSnapshotById,
  getSnapshotPolicy,
  addReaderToSnapshot,
  removeReaderFromSnapshot,
  addCustodianToSnapshot,
  removeCustodianFromSnapshot,
} from 'actions/index';
import DetailViewHeader from './DetailViewHeader';

import DatasetTable from './table/DatasetTable';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    width: '70%',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing(4),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  info: {
    width: '70%',
  },
  values: {
    paddingBottom: theme.spacing(3),
  },
});

export class SnapshotDetailView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    snapshot: PropTypes.object,
    snapshotPolicies: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const snapshotId = match.params.uuid;
    dispatch(getSnapshotById(snapshotId));
    dispatch(getSnapshotPolicy(snapshotId));
  }

  addReader = newEmail => {
    const { snapshot, dispatch } = this.props;
    dispatch(addReaderToSnapshot(snapshot.id, [newEmail]));
  };

  removeReader = removeableEmail => {
    const { snapshot, dispatch } = this.props;
    dispatch(removeReaderFromSnapshot(snapshot.id, removeableEmail));
  };

  addCustodian = newEmail => {
    const { snapshot, dispatch } = this.props;
    dispatch(addCustodianToSnapshot(snapshot.id, [newEmail]));
  };

  removeCustodian = removeableEmail => {
    const { snapshot, dispatch } = this.props;
    dispatch(removeCustodianFromSnapshot(snapshot.id, removeableEmail));
  };

  render() {
    const { classes, snapshot, snapshotPolicies } = this.props;
    const snapshotReadersObj = snapshotPolicies.find(policy => policy.name === 'reader');
    const snapshotReaders = (snapshotReadersObj && snapshotReadersObj.members) || [];
    const snapshotCustodiansObj = snapshotPolicies.find(policy => policy.name === 'custodian');
    const snapshotCustodians = (snapshotCustodiansObj && snapshotCustodiansObj.members) || [];
    const datasets = snapshot && snapshot.source && snapshot.source.map(s => s.dataset);
    return (
      <div id="snapshot-detail-view" className={classes.wrapper}>
        <div className={classes.width}>
          <DetailViewHeader
            of={snapshot}
            custodians={snapshotCustodians}
            addCustodian={this.addCustodian}
            removeCustodian={this.removeCustodian}
            readers={snapshotReaders}
            addReader={this.addReader}
            removeReader={this.removeReader}
          />
          {snapshot && snapshot.source && (
            <DatasetTable rows={datasets} datasetListName="DATASETS IN THIS SNAPSHOT" />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    snapshot: state.snapshots.snapshot,
    snapshotPolicies: state.snapshots.snapshotPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotDetailView));
