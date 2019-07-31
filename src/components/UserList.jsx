import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ManageUsersModal from './ManageUsersModal';

const styles = theme => ({
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing(1),
  },
  root: {
    marginTop: theme.spacing(3),
  },
});

class UserList extends React.PureComponent {
  static propTypes = {
    addUser: PropTypes.func,
    classes: PropTypes.object.isRequired,
    removeUser: PropTypes.func,
    typeOfUsers: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const { addUser, classes, removeUser, typeOfUsers, users } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.header}>{typeOfUsers}: </div>
        <div className={classes.values}>
          {users.map(user => (
            <Typography noWrap key={user}>
              {user}
            </Typography>
          ))}
        </div>
        <ManageUsersModal
          addUser={addUser}
          removeUser={removeUser}
          modalText={`Manage ${typeOfUsers}`}
          users={users}
        />
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
