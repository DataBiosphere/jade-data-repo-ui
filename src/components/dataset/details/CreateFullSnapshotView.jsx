import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import CreateFullSnapshotNamingView from './CreateFullSnapshotNamingView';
import ShareSnapshot from '../query/sidebar/panels/ShareSnapshot';

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

const CreateFullSnapshotView = ({ classes, onDismiss, open }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  return (
    <Dialog open={open} onClose={onDismiss} fullWidth>
      {isSharing ? (
        <ShareSnapshot isModal />
      ) : (
        <CreateFullSnapshotNamingView
          description={description}
          onDismiss={onDismiss}
          name={name}
          setDescription={setDescription}
          setName={setName}
          setIsSharing={setIsSharing}
        />
      )}
    </Dialog>
  );
};

CreateFullSnapshotView.propTypes = {
  classes: PropTypes.object.isRequired,
  onDismiss: PropTypes.func,
  open: PropTypes.bool,
};

export default withStyles(styles)(CreateFullSnapshotView);
