import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import UserList from './UserList';

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
            <div>
              <div className={classes.header}> Date Created: </div>
              <div className={classes.values}> {moment(of.createdDate).fromNow()} </div>
            </div>
            {custodians && (
              <UserList
                typeOfUsers="Custodians"
                users={custodians}
                addUser={addCustodian}
                removeUser={removeCustodian}
              />
            )}
            {readers && (
              <UserList
                typeOfUsers="Readers"
                users={readers}
                addUser={addReader}
                removeUser={removeReader}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DetailViewHeader);
