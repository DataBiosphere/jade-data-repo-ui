import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    justifyContent: 'space-between',
  },
});

class CreateFullSnapshotView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    open: PropTypes.bool,
    openSnapshotCreation: PropTypes.bool,
  };

  handleCancel = () => {
    const { openSnapshotCreation } = this.props;
    this.setState({ name: '', description: '' });
    openSnapshotCreation(false);
  };

  render() {
    const { classes, open } = this.props;
    const { name, description } = this.state;
    return (
      <Dialog open={open} fullWidth>
        <DialogTitle>Name and Describe Snapshot</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">Snapshot Name</Typography>
          <TextField
            id="snapshotName"
            variant="outlined"
            size="small"
            fullWidth
            className={classes.textField}
            onChange={(event) => this.setState({ name: event.target.value })}
            value={name}
          />
          <Typography variant="subtitle2">Description</Typography>
          <TextField
            id="snapshotDescription"
            variant="outlined"
            size="small"
            multiline
            rows={5}
            fullWidth
            className={classes.textField}
            onChange={(event) => this.setState({ description: event.target.value })}
            value={description}
          />
        </DialogContent>
        <DialogActions className={classes.buttonContainer}>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button variant="contained" disabled={name === ''}>
            Save snapshot
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(CreateFullSnapshotView);
