import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    margin: 0,
    padding: theme.spacing(3),
  },
  dialogContent: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    fontFamily: [
      'Montserrat',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: '20px',
    fontWeight: '500',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    minWidth: '600px',
  },
  actionButtons: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
  },
  actionButtonsError: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText,
    float: 'right',
    textDecoration: 'none',
  },
  closetitle: {
    display: 'inline-block',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1.5),
    top: theme.spacing(2),
  },
});

export class DatasetDirectionalModal extends React.PureComponent {
  state = {
    open: true,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    createdDataset: PropTypes.object,
    success: PropTypes.bool.isRequired,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, createdDataset, success } = this.props;
    const { open } = this.state;
    return (
      <div id="dataset-modal">
        {success && createdDataset ? (
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={false}
          >
            <DialogTitle className={classes.dialogTitle} id="customized-dialog-title">
              <div className={classes.closetitle}>Where to?</div>
              <div>
                <IconButton
                  aria-label="Close"
                  onClick={this.handleClose}
                  className={classes.closeButton}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className={classes.dialogContent}>
                The new dataset {createdDataset.name} has been created. What would you like to do
                next?
              </div>
              <div className={classes.dialogActions}>
                <Link
                  to={`/datasets/details/${createdDataset.id}`}
                  className={classes.actionButtons}
                >
                  <Button color="primary" variant="contained">
                    View new dataset
                  </Button>
                </Link>
                <Link to="/datasets" className={classes.actionButtons}>
                  <Button color="primary" variant="contained">
                    View all datasets
                  </Button>
                </Link>
                <Link to="/datasets/create" className={classes.actionButtons}>
                  <Button color="primary" variant="contained">
                    Create another dataset
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={false}
          >
            <DialogTitle className={classes.dialogTitle} id="customized-dialog-title">
              <div className={classes.closetitle}>There was a problem creating your dataset</div>
              <div>
                <IconButton
                  aria-label="Close"
                  onClick={this.handleClose}
                  className={classes.closeButton}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className={classes.dialogContent}>
                The dataset {createdDataset && createdDataset.name} was not created. What would you
                like to do next?
              </div>
              <div className={classes.dialogActionsError}>
                <Link to="/datasets" className={classes.actionButtons}>
                  <Button color="primary" variant="contained" className={classes.actionButtons}>
                    View all datasets
                  </Button>
                </Link>
                <Link to="/datasets/create">
                  <Button variant="contained" className={classes.actionButtonsError}>
                    Try again
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(DatasetDirectionalModal);
