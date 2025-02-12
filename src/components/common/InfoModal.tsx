import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

const StyledInstructions = styled(Typography)(({ theme }) => ({
  margin: 0,
  padding: `${theme.spacing(2)} !important`,
  whiteSpace: 'pre-wrap',
  maxHeight: '24rem',
  overflowY: 'scroll',
}));

interface InfoModalProps {
  readonly modalContent: string;
  readonly modalHeading: string;
  readonly onDismiss: () => void;
}

export function InfoModal({ modalContent, modalHeading, onDismiss }: InfoModalProps) {
  return (
    <Box component="span">
      <Dialog fullWidth maxWidth="md" onClose={onDismiss} open={true}>
        <DialogTitle
          id="customized-dialog-title"
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            margin: 0,
            padding: (theme) => theme.spacing(2),
          }}
        >
          {modalHeading}
          <CloseIconButton aria-label="Close" onClick={onDismiss}>
            <CloseIcon />
          </CloseIconButton>
        </DialogTitle>
        <StyledInstructions>{modalContent}</StyledInstructions>
        <DialogActions
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            margin: 0,
            padding: (theme) => theme.spacing(1),
          }}
        >
          <Button onClick={onDismiss} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InfoModal;
