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
});

export class CreateSnapshotPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    handleCreateSnapshot: PropTypes.func,
  };

  render() {
    const { classes, handleCreateSnapshot } = this.props;

    return (
      <div className={clsx(classes.rowTwo, classes.saveButtonContainer)}>
        <TextField id="snapshotName" label="Snapshot Name" />
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
          >
            Save Snapshot
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CreateSnapshotPanel);
