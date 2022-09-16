import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPen } from '@fortawesome/free-solid-svg-icons';
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
    borderRadius: '3px',
    padding: '1px',
    position: 'relative',
    marginLeft: 5,
  },
  iconButtonBackground: {
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
    position: 'absolute',
    '&:hover': {
      color: theme.palette.primary.hover,
      boxShadow: 'none',
    },
    zIndex: 1,
  },
  horizontalModalButton: {
    fontSize: '0.6rem',
    color: theme.palette.primary.light,
    zIndex: 2,
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
        <FontAwesomeIcon className={classes.iconButtonBackground} icon={faCircle} />
        <FontAwesomeIcon className={classes.horizontalModalButton} icon={faPen} />
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
