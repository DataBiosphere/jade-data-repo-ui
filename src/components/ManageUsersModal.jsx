import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { getDatasetById, getStudies } from 'actions/index';
import JadeTable from './table/JadeTable';
import moment from 'moment';

const styles = theme => ({
  wrapper: {
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
  dialogContent: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
});

export class ManageUsersModal extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    open: false,
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
    const { classes } = this.props;
    return (
      <div>
      <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>
        Manage Viewers
      </Button>
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.state.open}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" >
          Manage Users
          <IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
            Some drop downs or something
            <br/>
            Readers
            <br/>
            Custodian(s)
            <br/>
            Principal Investigators
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
        </div>
    );
  }
}

export default withStyles(styles)(ManageUsersModal);
