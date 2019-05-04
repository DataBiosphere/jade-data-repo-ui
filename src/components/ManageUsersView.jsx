import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { isEmail } from 'validator';

const styles = theme => ({
  addButton: {
    margin: theme.spacing.unit,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  chipContainer: {
    margin: theme.spacing.unit,
    maxHeight: theme.spacing.unit * 20,
    overflow: 'scroll',
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
    const readerChips = readers.map(reader => (
      <div key={reader}>
        <Chip
          label={reader}
          onDelete={() => removeUser(reader)}
          className={classes.chip}
          color="primary"
          variant="outlined"
        />
      </div>
    ));

    return (
      <div>
        <div>
          <TextField
            placeholder={defaultValue || 'Add email address'}
            onChange={e => this.validateEmail(e.target.value)}
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
        <div className={classes.chipContainer}>{readerChips}</div>
      </div>
    );
  }
}

export default withStyles(styles)(ManageUsersView);
