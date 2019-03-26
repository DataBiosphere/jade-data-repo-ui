import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  chip: {
    margin: theme.spacing.unit,
  },
});

export class ManageUsersModal extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasetUUID: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    readers: PropTypes.arrayOf(PropTypes.string),
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

  addReader(newEmail) {
    const { datasetUUID } = this.props;
    //TODO where do I want to keep readers? maybe directly gotten out of SAM?
    // so need to call something to put them directly in SAM
    console.log(newEmail);
    console.log(datasetUUID);
    // dispatch();
  }

  removeReader(removeableEmail) {
    const { datasetUUID } = this.props;
    console.log(removeableEmail);
    console.log(datasetUUID);
    // TODO send this reader to SAM
    // _.remove(newReaders, r => r === removeableEmail);
    // dispatch();
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const modalText = 'Manage Viewers';
    const readers = [
      'pamela.poovey@figgisagency.com',
      'algernop.krieger@figgisagency.com',
      'cheryl.tunt@figgisagency.com',
      'sterling.archer@figgisagency.com',
      'lana.kane@figgisagency.com',
    ];
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
              addReader={newEmail => this.addReader(newEmail)}
              defaultValue="Add viewer email addresses"
              removeReader={removeableEmail => this.removeReader(removeableEmail)}
              readers={readers}
            />
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={this.handleClose} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    readers: state.dataset.readers,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ManageUsersModal));
