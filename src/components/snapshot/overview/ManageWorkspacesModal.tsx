import React from 'react';
import { SnapshotWorkspaceEntry } from 'models/workspaceentry';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  CustomTheme,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { TdrState } from 'reducers';
import { connect } from 'react-redux';
import ManageWorkspacesView from './ManageWorkspacesView';

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
    dialogInstructions: {
      margin: 0,
      padding: `${theme.spacing(2)} !important`,
    },
    dialogActions: {
      borderTop: `1px solid ${theme.palette.divider}`,
      margin: 0,
      padding: theme.spacing(1),
    },
    openButton: {
      width: '100%',
      border: 0,
      justifyContent: 'left',
      textTransform: 'none',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      '&:hover': {
        border: 0,
      },
    },
    openButtonIcon: {
      marginRight: 5,
      top: theme.spacing(1),
    },
    horizontalModalButton: {
      fontSize: theme.typography.h6.fontSize,
      color: theme.palette.primary.light,
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

interface ManageWorkspaceModalProps extends WithStyles<typeof styles> {
  entries: SnapshotWorkspaceEntry[];
  modalText: string;
  removeWorkspace: any;
  isLoading: boolean;
}

type ManageWorkspaceModalState = {
  open: boolean;
};

const initialState: ManageWorkspaceModalState = {
  open: false,
};

export class ManageWorkspacesModal extends React.PureComponent<
  ManageWorkspaceModalProps,
  ManageWorkspaceModalState
> {
  constructor(props: ManageWorkspaceModalProps) {
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
    const { classes, modalText, entries, removeWorkspace, isLoading } = this.props;
    const { open } = this.state;
    const button = (
      <Button
        className={classes.openButton}
        aria-label={modalText}
        onClick={this.handleClickOpen}
        disableFocusRipple={true}
        disableRipple={true}
      >
        <i className={`${classes.openButtonIcon} fa-solid fa-pen-circle`} />
        {modalText}
      </Button>
    );

    return (
      <span>
        {button}
        <Dialog
          fullWidth
          maxWidth="md"
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
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
          <Typography className={classes.dialogInstructions}>
            Removing workspace readers will remove access to data for{' '}
            <strong>
              <em>Project-owners, Owners, Writers, Readers</em>
            </strong>
            . To add workspace readers use the{' '}
            <strong>
              <em>Export Snapshot to Terra Workspace</em>
            </strong>{' '}
            button.
          </Typography>
          <DialogContent className={classes.dialogContent}>
            {isLoading && (
              <LoadingSpinner
                delay={true}
                delayMessage="Thank you for your patience."
                className={classes.overlaySpinner}
              />
            )}
            <ManageWorkspacesView entries={entries} removeWorkspace={removeWorkspace} />
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

function mapStateToProps(state: TdrState) {
  return {
    isLoading: state.snapshots.snapshotWorkspaceManagerEditInProgress,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ManageWorkspacesModal));
