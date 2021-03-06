import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getSnapshotById,
  getSnapshotPolicy,
  addSnapshotPolicyMember,
  removeSnapshotPolicyMember,
} from 'actions/index';
import DetailViewHeader from './DetailViewHeader';

import DatasetTable from './table/DatasetTable';
import { SNAPSHOT_ROLES } from '../constants';

const styles = (theme) => ({
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
  constructor(props) {
    super(props);
    this.state = {
      filteredDatasets: null,
    };
  }

  static propTypes = {
    canReadPolicies: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    features: PropTypes.object,
    match: PropTypes.object.isRequired,
    snapshot: PropTypes.object,
    snapshotPolicies: PropTypes.arrayOf(PropTypes.object).isRequired,
    terraUrl: PropTypes.string,
  };

  // TODO: this will be overhauled once we tweak the snapshot view
  UNSAFE_componentWillMount() {
    const { dispatch, match } = this.props;
    const snapshotId = match.params.uuid;
    dispatch(getSnapshotById(snapshotId));
    dispatch(getSnapshotPolicy(snapshotId));
  }

  addReader = (newEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(addSnapshotPolicyMember(snapshot.id, newEmail, SNAPSHOT_ROLES.READER));
  };

  removeReader = (removeableEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(removeSnapshotPolicyMember(snapshot.id, removeableEmail, SNAPSHOT_ROLES.READER));
  };

  addSteward = (newEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(addSnapshotPolicyMember(snapshot.id, newEmail, SNAPSHOT_ROLES.STEWARD));
  };

  removeSteward = (removeableEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(removeSnapshotPolicyMember(snapshot.id, removeableEmail, SNAPSHOT_ROLES.STEWARD));
  };

  handleFilterDatasets = (limit, offset, sort, sortDirection, searchString) => {
    const { snapshot } = this.props;
    const datasets = snapshot.source.map((s) => s.dataset);
    const filtered = datasets.filter((d) =>
      d.name.toLowerCase().includes(searchString.toLowerCase()),
    );
    const sorted = _.orderBy(filtered, sort, sortDirection);
    const paged = _.take(_.drop(sorted, offset), limit);
    this.setState({ filteredDatasets: paged });
  };

  render() {
    const { classes, features, snapshot, snapshotPolicies, terraUrl, canReadPolicies } = this.props;
    const { filteredDatasets } = this.state;
    const snapshotReadersObj = snapshotPolicies.find((policy) => policy.name === 'reader');
    const snapshotReaders = (snapshotReadersObj && snapshotReadersObj.members) || [];
    const snapshotStewardsObj = snapshotPolicies.find((policy) => policy.name === 'steward');
    const snapshotStewards = (snapshotStewardsObj && snapshotStewardsObj.members) || [];
    const datasets = snapshot && snapshot.source && snapshot.source.map((s) => s.dataset);
    return (
      <div id="snapshot-detail-view" className={classes.wrapper}>
        <div className={classes.width}>
          <DetailViewHeader
            of={snapshot}
            stewards={snapshotStewards}
            addSteward={this.addSteward}
            removeSteward={this.removeSteward}
            readers={snapshotReaders}
            addReader={this.addReader}
            removeReader={this.removeReader}
            terraUrl={terraUrl}
            canReadPolicies={canReadPolicies}
          />
          {snapshot && snapshot.source && (
            <DatasetTable
              datasets={filteredDatasets || datasets}
              datasetsCount={snapshot.source.length}
              features={features}
              handleFilterDatasets={this.handleFilterDatasets}
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    features: state.user.features,
    snapshot: state.snapshots.snapshot,
    snapshotPolicies: state.snapshots.snapshotPolicies,
    terraUrl: state.configuration.terraUrl,
    canReadPolicies: state.snapshots.canReadPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotDetailView));
