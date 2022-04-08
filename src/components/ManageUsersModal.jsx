import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Button, Dialog, DialogTitle, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { Edit } from '@mui/icons-material';
import ManageUsersView from './ManageUsersView';

const styles = (theme) => ({
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
    padding: `${theme.spacing(2)} !important`,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(1),
  },
  openButton: {
    width: '100%',
  },
  iconButton: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '3px',
    padding: '1px',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  horizontalModalButton: {
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.primary.light,
  },
});

export class ManageUsersModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  static propTypes = {
    addUser: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    horizontal: PropTypes.bool,
    modalText: PropTypes.string.isRequired,
    removeUser: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.string),
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
    const { addUser, classes, horizontal, modalText, users, removeUser } = this.props;
    const { open } = this.state;
    const button = horizontal ? (
      <IconButton
        className={classes.iconButton}
        aria-label={modalText}
        onClick={this.handleClickOpen}
        disableFocusRipple={true}
        disableRipple={true}
      >
        <Edit fontStyle="small" className={classes.horizontalModalButton} />
      </IconButton>
    ) : (
      <Button
        className={classes.openButton}
        color="primary"
        variant="outlined"
        onClick={this.handleClickOpen}
      >
        {modalText}
      </Button>
    );

    return (
      <span>
        {button}
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
              addUser={(newEmail) => addUser(newEmail)}
              defaultValue="Add email addresses"
              removeUser={(removeableEmail) => removeUser(removeableEmail)}
              users={users}
            />
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={this.handleClose} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default withStyles(styles)(ManageUsersModal);
