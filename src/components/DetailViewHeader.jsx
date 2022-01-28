import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { exportSnapshot } from 'actions/index';
import { connect } from 'react-redux';
import { Card, Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import UserList from './UserList';
import TerraTooltip from './common/TerraTooltip';

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
  },
  centered: {
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing(2),
  },
  circularProgress: {
    paddingRight: '5px',
  },
});

export class DetailViewHeader extends React.PureComponent {
  static propTypes = {
    addReader: PropTypes.func,
    addSteward: PropTypes.func,
    canReadPolicies: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool,
    isDone: PropTypes.bool,
    of: PropTypes.object,
    exportResponse: PropTypes.object,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeReader: PropTypes.func,
    terraUrl: PropTypes.string,
    removeSteward: PropTypes.func,
    stewards: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  exportToWorkspaceCopy = () => {
    const { dispatch, of } = this.props;
    dispatch(exportSnapshot(of.id));
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
    } = this.props;
    const loading = _.isNil(of) || _.isEmpty(of);

    return (
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item zeroMinWidth xs={8}>
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
        <Grid item xs={4}>
          <Card className={classes.card}>
            {loading ? (
              <CircularProgress />
            ) : (
              <div>
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
              </div>
            )}
            {stewards && canReadPolicies && (
              <UserList
                typeOfUsers="Stewards"
                users={stewards}
                addUser={addSteward}
                removeUser={removeSteward}
                canManageUsers={true}
              />
            )}
            {readers && canReadPolicies && (
              <UserList
                typeOfUsers="Readers"
                users={readers}
                addUser={addReader}
                removeUser={removeReader}
                canManageUsers={true}
              />
            )}
            {!isProcessing && !isDone && (
              <TerraTooltip title="Exporting a snapshot to a workspace means that all members of your workspace will be able to have read only access to the tables and files in the snapshot">
                <Button
                  onClick={this.exportToWorkspaceCopy}
                  className={classes.exportButton}
                  variant="contained"
                  color="primary"
                >
                  Export snapshot
                </Button>
              </TerraTooltip>
            )}
            {isProcessing && !isDone && (
              <Button className={classes.exportButton} variant="contained" color="primary">
                <CircularProgress className={classes.circularProgress} />
                Preparing snapshot
              </Button>
            )}
            {!isProcessing && isDone && (
              <Button className={classes.exportButton} variant="contained" color="primary">
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
