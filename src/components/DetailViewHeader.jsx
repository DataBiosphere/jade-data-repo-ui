import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
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
});

export class DetailViewHeader extends React.PureComponent {
  static propTypes = {
    addReader: PropTypes.func,
    addSteward: PropTypes.func,
    canReadPolicies: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    of: PropTypes.object,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeReader: PropTypes.func,
    terraUrl: PropTypes.string,
    removeSteward: PropTypes.func,
    stewards: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const {
      addSteward,
      addReader,
      classes,
      stewards,
      of,
      readers,
      removeSteward,
      removeReader,
      terraUrl,
      canReadPolicies,
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
                <div className={classes.header}> Date Created:</div>
                <div className={classes.values}> {moment(of.createdDate).fromNow()} </div>
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
            <Button className={classes.exportButton} variant="contained" color="primary">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${terraUrl}/#import-data?url=${window.location.origin}&snapshotId=${of.id}&snapshotName=${of.name}&format=snapshot`}
              >
                Export to Workspace
              </a>
            </Button>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DetailViewHeader);
