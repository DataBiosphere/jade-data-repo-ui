import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { exportSnapshot, resetSnapshotExport } from 'actions/index';
import { connect } from 'react-redux';
import { Card, Grid, Typography, Button, CircularProgress, Divider } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import UserList from './UserList';
import TerraTooltip from './common/TerraTooltip';
import { SNAPSHOT_ROLES } from '../constants';

const styles = (theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '44px',
    paddingBottom: theme.spacing(4),
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing(4),
    width: '100%',
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  exportButton: {
    marginTop: '0.5rem',
    height: '36px',
    width: '100%',
  },
  centered: {
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing(2),
  },
  labelRight: {
    paddingLeft: '10px',
  },
  separator: {
    marginTop: '20px',
    marginBottom: '10px',
  },
});

export class DetailViewHeader extends React.PureComponent {
  static propTypes = {
    addReader: PropTypes.func,
    addSteward: PropTypes.func,
    canReadPolicies: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    exportResponse: PropTypes.object,
    isDone: PropTypes.bool,
    isProcessing: PropTypes.bool,
    of: PropTypes.object,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeReader: PropTypes.func,
    removeSteward: PropTypes.func,
    stewards: PropTypes.arrayOf(PropTypes.string).isRequired,
    terraUrl: PropTypes.string,
    user: PropTypes.object,
    userRoles: PropTypes.arrayOf(PropTypes.string),
  };

  exportToWorkspaceCopy = () => {
    const { dispatch, of } = this.props;
    dispatch(exportSnapshot(of.id));
  };

  resetExport = () => {
    const { dispatch } = this.props;
    dispatch(resetSnapshotExport());
  };

  render() {
    const {
      addSteward,
      addReader,
      canReadPolicies,
      classes,
      isProcessing,
      isDone,
      exportResponse,
      of,
      readers,
      removeSteward,
      removeReader,
      stewards,
      terraUrl,
      userRoles,
      user,
    } = this.props;
    const loading = _.isNil(of) || _.isEmpty(of);
    const canManageUsers = userRoles.includes(SNAPSHOT_ROLES.STEWARD);

    const linkToBq = of.accessInformation?.bigQuery !== undefined;
    const consoleLink = linkToBq
      ? `${of.accessInformation.bigQuery.link}&authuser=${user?.email}`
      : '';

    return (
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item zeroMinWidth xs={6}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Fragment>
              <Typography noWrap className={classes.title}>
                {of.name}
              </Typography>
              <Typography>{of.description}</Typography>
            </Fragment>
          )}
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container>
                <Grid item xs={6}>
                  <span className={classes.header}> Date Created:</span>
                  <span className={classes.values}> {moment(of.createdDate).fromNow()}</span>
                  <p className={classes.header}> Storage:</p>
                  <ul>
                    {of.source[0].dataset.storage.map((storageResource) => (
                      <li key={storageResource.cloudResource}>
                        {storageResource.cloudResource}: {storageResource.region}
                      </li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={6}>
                  {linkToBq && (
                    <TerraTooltip title="Click to navigate to the Google BigQuery console where you can perform more advanced queries against your snapshot tables">
                      <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        className={classes.button}
                        endIcon={<Launch />}
                      >
                        <a target="_blank" rel="noopener noreferrer" href={consoleLink}>
                          View in Google Console
                        </a>
                      </Button>
                    </TerraTooltip>
                  )}
                </Grid>
              </Grid>
            )}
            {stewards && canReadPolicies && (
              <UserList
                typeOfUsers="Stewards"
                users={stewards}
                addUser={addSteward}
                removeUser={removeSteward}
                canManageUsers={canManageUsers}
              />
            )}
            {readers && canReadPolicies && (
              <UserList
                typeOfUsers="Readers"
                users={readers}
                addUser={addReader}
                removeUser={removeReader}
                canManageUsers={canManageUsers}
              />
            )}
            <Divider className={classes.separator} />
            <Typography variant="h6" className={classes.section}>
              Export a copy of the snapshot metadata to an exisiting or new Terra workspace
            </Typography>
            {!isProcessing && !isDone && (
              <TerraTooltip title="Exporting a snapshot to a workspace means that all members of your workspace will be able to have read only access to the tables and files in the snapshot">
                <Button
                  onClick={this.exportToWorkspaceCopy}
                  className={classes.exportButton}
                  variant="outlined"
                  color="primary"
                >
                  Export snapshot
                </Button>
              </TerraTooltip>
            )}
            {isProcessing && !isDone && (
              <Button className={classes.exportButton} variant="outlined" color="primary">
                <CircularProgress size={25} />
                <div className={classes.labelRight}>Preparing snapshot</div>
              </Button>
            )}
            {!isProcessing && isDone && (
              <Button
                onClick={this.resetExport}
                className={classes.exportButton}
                variant="contained"
                color="primary"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${terraUrl}#import-data?url=${window.location.origin}&snapshotId=${of.id}&format=tdrexport&snapshotName=${of.name}&tdrmanifest=${exportResponse.format.parquet.manifest}`}
                >
                  Snapshot ready - continue
                </a>
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    isProcessing: state.snapshots.exportIsProcessing,
    isDone: state.snapshots.exportIsDone,
    exportResponse: state.snapshots.exportResponse,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DetailViewHeader));
