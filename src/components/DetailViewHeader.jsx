import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ManageUsersModal from './ManageUsersModal';

const styles = theme => ({
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
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing(3),
  },
});

export class DetailViewHeader extends React.PureComponent {
  static propTypes = {
    addUser: PropTypes.func,
    classes: PropTypes.object.isRequired,
    custodians: PropTypes.arrayOf(PropTypes.object).isRequired,
    of: PropTypes.object,
    removeUser: PropTypes.func,
  };

  render() {
    const { addUser, classes, removeUser, of, custodians } = this.props;
    return (
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item zeroMinWidth xs={9}>
          <Typography noWrap className={classes.title}>
            {of.name}
          </Typography>
          <Typography>{of.description}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card}>
            {of && of.createdDate && (
              <div>
                <div className={classes.header}> Date Created: </div>
                <div className={classes.values}> {moment(of.createdDate).fromNow()} </div>
              </div>
            )}
            {custodians.length > 0 ? (
              <div>
                <div className={classes.header}>Custodians: </div>
                <div className={classes.values}>
                  {custodians.map(custodian => (
                    <div key={custodian}>{custodian}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div />
            )}
            <div>
              {of && of.id && (
                <ManageUsersModal
                  addUser={addUser}
                  removeUser={removeUser}
                  modalText="Manage Custodians"
                  users={custodians}
                />
              )}
            </div>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DetailViewHeader);
