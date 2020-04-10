import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import { Button, TextField } from '@material-ui/core';

const styles = theme => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButtonContainer: {
    backgroundColor: theme.palette.primary.light,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  saveButton: {
    marginTop: theme.spacing(1),
    alignSelf: 'flex-start',
  },
  cancelButton: {
    alignSelf: 'flex-end',
  },
  textField: {
    backgroundColor: theme.palette.common.white,
    borderRadius: '5px',
    marginBottom: theme.spacing(1),
  },
});

export class CreateSnapshotPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    handleCreateSnapshot: PropTypes.func,
    handleSaveSnapshot: PropTypes.func,
  };

  render() {
    const { classes, handleCreateSnapshot, handleSaveSnapshot } = this.props;
    const { name, description } = this.state;
    return (
      <div className={clsx(classes.rowTwo, classes.saveButtonContainer)}>
        <TextField
          id="snapshotName"
          label="Name"
          variant="outlined"
          size="small"
          fullWidth
          className={classes.textField}
          onChange={event => this.setState({ name: event.target.value })}
          value={name}
        />
        <TextField
          id="snapshotDescription"
          label="Description"
          variant="outlined"
          size="small"
          multiline
          rows={3}
          fullWidth
          className={classes.textField}
          onChange={event => this.setState({ description: event.target.value })}
          value={description}
        />
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            className={clsx(classes.saveButton, { [classes.hide]: !open })}
            onClick={() => handleCreateSnapshot(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className={clsx(classes.cancelButton, { [classes.hide]: !open })}
            onClick={() => handleSaveSnapshot()}
          >
            Save Snapshot
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CreateSnapshotPanel);
