import React from 'react';
import _ from 'lodash';
import { ClassNameMap, withStyles } from '@mui/styles';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const styles = () =>
  ({
    dialogHeader: {
      fontSize: '1.5rem',
      lineHeight: 1.5,
      float: 'left',
    },
    tabButton: {
      'text-transform': 'none',
      marginRight: 15,
    },
  } as any);

type ConfirmationModalProps = {
  classes: ClassNameMap;
  title: string;
  description?: any;
  open: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
};

function DatasetSchemaRelationshipModal({
  classes,
  title,
  description,
  open,
  onSubmit,
  onClose,
}: ConfirmationModalProps) {
  return (
    <div>
      <Paper className={classes.root}>
        <Dialog open={open} scroll="paper" fullWidth={true} onBackdropClick={onClose}>
          <DialogTitle id="see-more-dialog-title">
            <div className={classes.dialogHeader}>{title}</div>
            <IconButton size="small" style={{ float: 'right' }} onClick={onClose}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              className={classes.dialogContentText}
              component="div"
              id="see-more-dialog-content-text"
            >
              {description}
              <div className={classes.actionButtons}>
                <Button
                  id="submitButton"
                  type="button"
                  color="primary"
                  variant="contained"
                  disableElevation
                  className={classes.tabButton}
                  onClick={onSubmit}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  color="primary"
                  variant="outlined"
                  disableElevation
                  className={classes.tabButton}
                  onClick={onClose}
                >
                  No
                </Button>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(DatasetSchemaRelationshipModal);
