import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserList from './UserList';

const styles = theme => ({
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
});

export class DetailViewHeader extends React.PureComponent {
  static propTypes = {
    addCustodian: PropTypes.func,
    addReader: PropTypes.func,
    classes: PropTypes.object.isRequired,
    custodians: PropTypes.arrayOf(PropTypes.string).isRequired,
    of: PropTypes.object,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeCustodian: PropTypes.func,
    removeReader: PropTypes.func,
  };

  render() {
    const {
      addCustodian,
      addReader,
      classes,
      custodians,
      of,
      readers,
      removeCustodian,
      removeReader,
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
                <div className={classes.header}> Date Created: </div>
                <div className={classes.values}> {moment(of.createdDate).fromNow()} </div>
              </div>
            )}
            {custodians && (
              <UserList
                typeOfUsers="Custodians"
                users={custodians}
                addUser={addCustodian}
                removeUser={removeCustodian}
                canManageUsers={true}
              />
            )}
            {readers && (
              <UserList
                typeOfUsers="Readers"
                users={readers}
                addUser={addReader}
                removeUser={removeReader}
                canManageUsers={true}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DetailViewHeader);
