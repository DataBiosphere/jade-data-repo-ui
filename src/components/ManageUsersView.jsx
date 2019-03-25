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
    addReader: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    defaultValue: PropTypes.string,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeReader: PropTypes.func.isRequired,
  };

  validateEmail(newEmail) {
    if (isEmail(newEmail)) {
      this.setState({ newEmail, emailValid: true });
    } else {
      this.setState({ emailValid: false });
    }
  }

  render() {
    const { addReader, classes, defaultValue, readers, removeReader } = this.props;
    const { emailValid, newEmail } = this.state;
    const readerChips = readers.map(reader => { return (
      <div key={reader}>
        <Chip
         label={reader}
         onDelete={() => removeReader(reader)}
         className={classes.chip}
         color="primary"
         variant="outlined"
         />
      </div>
     )
   });

    return (
      <div>
        <div>
          <TextField
            placeholder={defaultValue || 'New'}
            onChange={e => this.validateEmail(e.target.value)}
            style={{ width: '300px' }}
            variant="outlined"
          />
          <Button
            className={classes.addButton}
            color="primary"
            disabled={!emailValid}
            onClick={() => addReader(newEmail)}
            type="button"
            variant="contained"
          >
            ADD
          </Button>
        </div>
        <div className={classes.chipContainer}>
          {readerChips}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ManageUsersView);
