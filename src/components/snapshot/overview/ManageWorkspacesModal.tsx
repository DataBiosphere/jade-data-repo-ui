import React from 'react';
import { SnapshotWorkspaceEntry } from 'models/workspaceentry';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { TdrState } from 'reducers';
import { connect } from 'react-redux';
import ManageWorkspacesView from './ManageWorkspacesView';

const OpenButton = styled(Button)(({ theme }) => ({
  width: '100%',
  border: 0,
  justifyContent: 'left',
  textTransform: 'none',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  '&:hover': {
    border: 0,
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  margin: 0,
  padding: `${theme.spacing(2)} !important`,
  position: 'relative',
  minHeight: '200px',
}));

const OverlaySpinner = styled(Box)(({ theme }) => ({
  opacity: 0.9,
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  width: 'initial',
  overflow: 'clip',
  backgroundColor: theme.palette.common.white,
  zIndex: 100,
}));

interface ManageWorkspaceModalProps {
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
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { modalText, entries, removeWorkspace, isLoading } = this.props;
    const { open } = this.state;

    return (
      <Box component="span">
        <OpenButton
          aria-label={modalText}
          onClick={this.handleClickOpen}
          disableFocusRipple
          disableRipple
        >
          <Box
            component="i"
            className="fa-solid fa-pen-circle"
            sx={{ marginRight: '5px', top: (theme) => theme.spacing(1) }}
          />
          {modalText}
        </OpenButton>
        <Dialog
          fullWidth
          maxWidth="md"
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle
            id="customized-dialog-title"
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              margin: 0,
              padding: (theme) => theme.spacing(2),
            }}
          >
            {modalText}
            <IconButton
              aria-label="Close"
              onClick={this.handleClose}
              sx={{
                position: 'absolute',
                right: (theme) => theme.spacing(1),
                top: (theme) => theme.spacing(1),
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Typography
            sx={{
              margin: 0,
              padding: (theme) => `${theme.spacing(2)} !important`,
            }}
          >
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
          <StyledDialogContent>
            {isLoading && (
              <LoadingSpinner
                delay={true}
                delayMessage="Thank you for your patience."
                className={OverlaySpinner.toString()}
              />
            )}
            <ManageWorkspacesView entries={entries} removeWorkspace={removeWorkspace} />
          </StyledDialogContent>
          <DialogActions
            sx={{
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              margin: 0,
              padding: (theme) => theme.spacing(1),
            }}
          >
            <Button onClick={this.handleClose} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

function mapStateToProps(state: TdrState) {
  return {
    isLoading: state.snapshots.snapshotWorkspaceManagerEditInProgress,
  };
}

export default connect(mapStateToProps)(ManageWorkspacesModal);
