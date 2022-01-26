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
import { exportSnapshot } from 'actions/index';
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
    dispatch: PropTypes.func.isRequired,
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
      classes,
      stewards,
      of,
      readers,
      removeSteward,
      removeReader,
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
            <Button
              onClick={this.exportToWorkspaceCopy}
              className={classes.exportButton}
              variant="contained"
              color="primary"
            >
              Export to Workspace
            </Button>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DetailViewHeader);
