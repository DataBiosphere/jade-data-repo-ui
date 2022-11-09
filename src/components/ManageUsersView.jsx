import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { isEmail } from 'validator';

const styles = (theme) => ({
  chip: {
    marginBottom: theme.spacing(1),
  },
  chipContainer: {
    margin: 0,
    width: '100%',
  },
});

class ManageUsersView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newEmail: '',
      emailValid: false,
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    defaultValue: PropTypes.string,
    removeUser: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.string),
  };

  render() {
    const { classes, defaultValue, users, removeUser } = this.props;
    const { emailValid, newEmail } = this.state;
    const userChips =
      !!users &&
      users.map((user) => (
        <div key={user}>
          <Chip
            className={classes.chip}
            color="primary"
            label={user}
            key={user}
            onDelete={() => removeUser(user)}
            variant="outlined"
          />
        </div>
      ));
    return (
      <div>
        {users && users.length > 0 && <div className={classes.chipContainer}>{userChips}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(ManageUsersView);
