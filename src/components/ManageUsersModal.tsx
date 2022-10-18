import React from 'react';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  CustomTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ManageUsersView from './ManageUsersView';
import LoadingSpinner from './common/LoadingSpinner';

const styles = (theme: CustomTheme) =>
  createStyles({
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
      border: 0,
      justifyContent: 'left',
      textTransform: 'none',
      padding: 0,
      '&:hover': {
        border: 0,
      },
      marginTop: -25,
    },
    openButtonIcon: {
      marginRight: 5,
    },
    iconButton: {
      padding: '1px',
      marginLeft: 5,
      boxShadow: 'none',
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.hover,
      },
    },
    overlaySpinner: {
      opacity: 0.9,
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      width: 'initial',
      overflow: 'clip',
      backgroundColor: theme.palette.common.white,
      zIndex: 100,
    },
  });

interface ManageUserModalProps extends WithStyles<typeof styles> {
  addUser: any;
  horizontal?: boolean;
  modalText: string;
  removeUser: any;
  users: Array<string>;
  isLoading: boolean;
}

type ManageUserModalState = {
  open: boolean;
};

const initialState: ManageUserModalState = {
  open: false,
};

export class ManageUsersModal extends React.PureComponent<
  ManageUserModalProps,
  ManageUserModalState
> {
  constructor(props: ManageUserModalProps) {
    super(props);
    this.state = initialState;
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { addUser, classes, horizontal, modalText, users, removeUser, isLoading } = this.props;
    const { open } = this.state;
    const button = horizontal ? (
      <IconButton
        className={classes.iconButton}
        aria-label={modalText}
        onClick={this.handleClickOpen}
        disableFocusRipple={true}
        disableRipple={true}
      >
        <i className="fa-solid fa-pen-circle" />
      </IconButton>
    ) : (
      <Button
        className={classes.openButton}
        color="primary"
        variant="outlined"
        onClick={this.handleClickOpen}
      >
        <i className={`${classes.openButtonIcon} fa-solid fa-pen-circle`} /> {modalText}
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
            {isLoading && <LoadingSpinner className={classes.overlaySpinner} />}
            <ManageUsersView
              addUser={(newEmail: any) => addUser(newEmail)}
              defaultValue="Add email addresses"
              removeUser={(removeableEmail: any) => removeUser(removeableEmail)}
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
