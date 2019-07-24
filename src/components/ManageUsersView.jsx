import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { isEmail } from 'validator';

const styles = theme => ({
  addButton: {
    margin: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(1),
  },
  chipContainer: {
    margin: theme.spacing(1),
    maxHeight: theme.spacing(20),
    overflowY: 'scroll',
    width: '100%',
  },
  manageUsers: {
    alignItems: 'center',
    display: 'flex',
    ' && button': {
      padding: '4px 8px',
      margin: '0 16px',
    },
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
    addUser: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    defaultValue: PropTypes.string,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeUser: PropTypes.func.isRequired,
  };

  validateEmail(newEmail) {
    if (isEmail(newEmail)) {
      this.setState({ newEmail, emailValid: true });
    } else {
      this.setState({ newEmail, emailValid: false });
    }
  }

  addUserClean(email) {
    const { addUser } = this.props;
    addUser(email);
    this.setState({ newEmail: '' });
  }

  render() {
    const { classes, defaultValue, readers, removeUser } = this.props;
    const { emailValid, newEmail } = this.state;
    const readerChips =
      !!readers &&
      readers.map(reader => (
        <div key={reader}>
          <Chip
            className={classes.chip}
            color="primary"
            label={reader}
            key={reader}
            onDelete={() => removeUser(reader)}
            variant="outlined"
          />
        </div>
      ));
    return (
      <div>
        <div className={classes.manageUsers}>
          <TextField
            placeholder={defaultValue || 'Add email address'}
            onChange={e => this.validateEmail(e.target.value)}
            onKeyPress={e =>
              e.key === 'Enter' && emailValid && e.target && this.addUserClean(e.target.value)
            }
            style={{ width: '300px' }}
            value={newEmail}
            variant="outlined"
          />
          <Button
            className={classes.addButton}
            color="primary"
            disabled={!emailValid}
            onClick={() => this.addUserClean(newEmail)}
            type="button"
            variant="contained"
          >
            ADD
          </Button>
        </div>
        {readers.length > 0 && <div className={classes.chipContainer}>{readerChips}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(ManageUsersView);
