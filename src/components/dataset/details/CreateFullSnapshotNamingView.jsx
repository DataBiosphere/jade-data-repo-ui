import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { validateSnapshotName } from '../../../libs/utils';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    justifyContent: 'space-between',
  },
});

const CreateFullSnapshotNamingView = ({
  classes,
  description,
  onDismiss,
  name,
  setDescription,
  setIsSharing,
  setName,
}) => {
  const [hasError, setHasError] = useState(false);

  const validateNameAndProgress = (snapshotName) => {
    // eslint-disable-next-line no-unused-expressions
    validateSnapshotName(snapshotName) ? setIsSharing(true) : setHasError(true);
  };

  return (
    <Fragment>
      <DialogTitle>Name and Describe Snapshot</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">Snapshot Name</Typography>
        <TextField
          id="snapshotName"
          variant="outlined"
          size="small"
          fullWidth
          className={classes.textField}
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
        {hasError && (
          <Typography variant="subtitle2" color="error">
            The name you entered is invalid. Please make sure to enter an alphanumeric name that is
            less than 64 characters.
          </Typography>
        )}
        <Typography variant="subtitle2">Description</Typography>
        <TextField
          id="snapshotDescription"
          variant="outlined"
          size="small"
          multiline
          rows={5}
          fullWidth
          className={classes.textField}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </DialogContent>
      <DialogActions className={classes.buttonContainer}>
        <Button onClick={onDismiss}>Cancel</Button>
        <Button variant="contained" disabled={name === ''} onClick={validateNameAndProgress}>
          Save snapshot
        </Button>
      </DialogActions>
    </Fragment>
  );
};

CreateFullSnapshotNamingView.propTypes = {
  classes: PropTypes.object,
  description: PropTypes.string,
  name: PropTypes.string,
  onDismiss: PropTypes.func,
  setDescription: PropTypes.func,
  setIsSharing: PropTypes.func,
  setName: PropTypes.func,
};

export default withStyles(styles)(CreateFullSnapshotNamingView);
