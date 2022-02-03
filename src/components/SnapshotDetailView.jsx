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
  getUserSnapshotRoles,
} from 'actions/index';
import DetailViewHeader from './DetailViewHeader';

import DatasetTable from './table/DatasetTable';
import { SNAPSHOT_INCLUDE_OPTIONS, SNAPSHOT_ROLES } from '../constants';
import { getRoleMembersFromPolicies } from '../libs/utils';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    ...theme.mixins.containerWidth,
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
    user: PropTypes.object,
    match: PropTypes.object.isRequired,
    snapshot: PropTypes.object,
    snapshotPolicies: PropTypes.arrayOf(PropTypes.object).isRequired,
    terraUrl: PropTypes.string,
    userRoles: PropTypes.arrayOf(PropTypes.string),
  };

  // TODO: this will be overhauled once we tweak the snapshot view
  UNSAFE_componentWillMount() {
    const { dispatch, match } = this.props;
    const snapshotId = match.params.uuid;
    dispatch(
      getSnapshotById({
        snapshotId,
        include: [
          SNAPSHOT_INCLUDE_OPTIONS.SOURCES,
          SNAPSHOT_INCLUDE_OPTIONS.TABLES,
          SNAPSHOT_INCLUDE_OPTIONS.RELATIONSHIPS,
          SNAPSHOT_INCLUDE_OPTIONS.ACCESS_INFORMATION,
          SNAPSHOT_INCLUDE_OPTIONS.PROFILE,
          SNAPSHOT_INCLUDE_OPTIONS.DATA_PROJECT,
        ],
      }),
    );
    dispatch(getSnapshotPolicy(snapshotId));
    dispatch(getUserSnapshotRoles(snapshotId));
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
      d.name.toLowerCase().includes((searchString || '').toLowerCase()),
    );
    const sorted = _.orderBy(filtered, sort, sortDirection);
    const paged = _.take(_.drop(sorted, offset), limit);
    this.setState({ filteredDatasets: paged });
  };

  render() {
    const {
      classes,
      user,
      snapshot,
      snapshotPolicies,
      terraUrl,
      canReadPolicies,
      dispatch,
      userRoles,
    } = this.props;
    const { filteredDatasets } = this.state;

    const snapshotReaders = getRoleMembersFromPolicies(snapshotPolicies, SNAPSHOT_ROLES.STEWARD);
    const snapshotStewards = getRoleMembersFromPolicies(snapshotPolicies, SNAPSHOT_ROLES.STEWARD);
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
            dispatch={dispatch}
            userRoles={userRoles}
            user={user}
          />
          {snapshot && snapshot.source && (
            <DatasetTable
              datasets={filteredDatasets || datasets}
              datasetsCount={snapshot.source.length}
              features={user.features}
              handleFilterDatasets={this.handleFilterDatasets}
              searchString=""
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    snapshot: state.snapshots.snapshot,
    snapshotPolicies: state.snapshots.snapshotPolicies,
    terraUrl: state.configuration.terraUrl,
    canReadPolicies: state.snapshots.canReadPolicies,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotDetailView));
