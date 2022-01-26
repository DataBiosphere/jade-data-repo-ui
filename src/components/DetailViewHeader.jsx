import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { exportSnapshot } from 'actions/index';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import {
  Card,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from '@material-ui/core';
import clsx from 'clsx';
import UserList from './UserList';

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
});

export class DetailViewHeader extends React.PureComponent {
  static propTypes = {
    addReader: PropTypes.func,
    addSteward: PropTypes.func,
    canReadPolicies: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    of: PropTypes.object,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeReader: PropTypes.func,
    terraUrl: PropTypes.string,
    removeSteward: PropTypes.func,
    stewards: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  exportToWorkspaceCopy = () => {
    const { dispatch, of, terraUrl } = this.props;
    dispatch(exportSnapshot(of.id, of.name, terraUrl));
  };

  render() {
    const {
      addSteward,
      addReader,
      canReadPolicies,
      classes,
      isOpen,
      of,
      readers,
      removeSteward,
      removeReader,
      stewards,
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
            <Dialog open={isOpen}>
              <DialogContent>
                <Typography variant="h5">Your data snapshot is being exported</Typography>
                {/* TODO: Make this loading state more descriptive */}
                <div className={clsx(classes.centered, classes.content)}>
                  <CircularProgress />
                </div>
              </DialogContent>
            </Dialog>
            <Tooltip title="Exporting a snapshot to a workspace means that all members of your workspace will be able to have read only access to the tables and files in the snapshot">
              <Button
                onClick={this.exportToWorkspaceCopy}
                className={classes.exportButton}
                variant="contained"
                color="primary"
              >
                Export to Workspace
              </Button>
            </Tooltip>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.snapshots.dialogIsOpen,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DetailViewHeader));
