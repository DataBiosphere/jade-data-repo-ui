import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ManageUsersView from './ManageUsersView';

const styles = theme => ({
  wrapper: {
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogContent: {
    margin: 0,
    padding: theme.spacing(2),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(1),
  },
});

export class ManageUsersModal extends React.PureComponent {
  state = {
    open: false,
  };

  static propTypes = {
    addUser: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    modalText: PropTypes.string.isRequired,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeUser: PropTypes.func.isRequired,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { addUser, classes, modalText, readers, removeUser } = this.props;
    const { open } = this.state;
    return (
      <div>
        <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>
          {modalText}
        </Button>
        <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle className={classes.dialogTitle} id="customized-dialog-title">
            {modalText}
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <ManageUsersView
              addUser={newEmail => addUser(newEmail)}
              defaultValue="Add email addresses"
              removeUser={removeableEmail => removeUser(removeableEmail)}
              readers={readers}
            />
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={this.handleClose} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ManageUsersModal);
