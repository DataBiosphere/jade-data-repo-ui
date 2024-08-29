import React from 'react';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  CustomTheme,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
    dialogInstructions: {
      margin: 0,
      padding: `${theme.spacing(2)} !important`,
      whiteSpace: 'pre-wrap',
      maxHeight: '24rem',
      overflowY: 'scroll',
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

interface InfoModalProps extends WithStyles<typeof styles> {
  modalContent: string;
  modalHeading: string;
  onDismiss: () => void;
}

export function InfoModal(props: InfoModalProps) {
  const { classes, modalContent, modalHeading, onDismiss } = props;

  return (
    <span>
      <Dialog fullWidth maxWidth="md" onClose={onDismiss} open={true}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title">
          {modalHeading}
          <IconButton aria-label="Close" className={classes.closeButton} onClick={onDismiss}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Typography className={classes.dialogInstructions}>{modalContent}</Typography>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={onDismiss} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

export default withStyles(styles)(InfoModal);
