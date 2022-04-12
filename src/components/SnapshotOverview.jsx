import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import {
  getSnapshotById,
  getSnapshotPolicy,
  addSnapshotPolicyMember,
  removeSnapshotPolicyMember,
  getUserSnapshotRoles,
} from '../actions';
import DatasetTable from './table/DatasetTable';
import { BreadcrumbType, SnapshotIncludeOptions, SnapshotRoles } from '../constants';
import OverviewHeader from './OverviewHeader';
import { getRoleMembersFromPolicies } from '../libs/utils';
import AppBreadcrumbs from './AppBreadcrumbs/AppBreadcrumbs';

const styles = (theme) => ({
  pageRoot: { ...theme.mixins.pageRoot },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
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

export class SnapshotOverview extends React.PureComponent {
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
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    snapshot: PropTypes.object,
    snapshotPolicies: PropTypes.arrayOf(PropTypes.object).isRequired,
    terraUrl: PropTypes.string,
    user: PropTypes.object,
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
          SnapshotIncludeOptions.SOURCES,
          SnapshotIncludeOptions.TABLES,
          SnapshotIncludeOptions.RELATIONSHIPS,
          SnapshotIncludeOptions.ACCESS_INFORMATION,
          SnapshotIncludeOptions.PROFILE,
          SnapshotIncludeOptions.DATA_PROJECT,
        ],
      }),
    );
    dispatch(getSnapshotPolicy(snapshotId));
    dispatch(getUserSnapshotRoles(snapshotId));
  }

  addReader = (newEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(addSnapshotPolicyMember(snapshot.id, newEmail, SnapshotRoles.READER));
  };

  removeReader = (removeableEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(removeSnapshotPolicyMember(snapshot.id, removeableEmail, SnapshotRoles.READER));
  };

  addSteward = (newEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(addSnapshotPolicyMember(snapshot.id, newEmail, SnapshotRoles.STEWARD));
  };

  removeSteward = (removeableEmail) => {
    const { snapshot, dispatch } = this.props;
    dispatch(removeSnapshotPolicyMember(snapshot.id, removeableEmail, SnapshotRoles.STEWARD));
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
      loading,
    } = this.props;
    const { filteredDatasets } = this.state;

    const snapshotReaders = getRoleMembersFromPolicies(snapshotPolicies, SnapshotRoles.READER);
    const snapshotStewards = getRoleMembersFromPolicies(snapshotPolicies, SnapshotRoles.STEWARD);
    const datasets = snapshot && snapshot.source && snapshot.source.map((s) => s.dataset);

    return (
      <div className={classes.pageRoot}>
        <AppBreadcrumbs
          context={{
            type: BreadcrumbType.SNAPSHOT,
            id: snapshot.id || '',
            name: snapshot.name || '',
          }}
        />
        <div id="snapshot-detail-view" className={classes.wrapper}>
          <div className={classes.width}>
            <OverviewHeader
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
                loading={loading}
              />
            )}
          </div>
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
    terraUrl: state.configuration.configObject.terraUrl,
    canReadPolicies: state.snapshots.canReadPolicies,
    userRoles: state.snapshots.userRoles,
    loading: state.snapshots.loading,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotOverview));
