import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { actions } from 'react-redux-form';
import { connect } from 'react-redux';

import { Button, TextField } from '@material-ui/core';
import CreateSnapshotDropdown from '../CreateSnapshotDropdown';

const styles = (theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButtonContainer: {
    backgroundColor: theme.palette.primary.light,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  saveButton: {
    marginTop: theme.spacing(1),
    alignSelf: 'flex-start',
  },
  cancelButton: {
    alignSelf: 'flex-end',
  },
  textField: {
    backgroundColor: theme.palette.common.white,
    borderRadius: '5px',
    marginBottom: theme.spacing(1),
  },
});

export class CreateSnapshotPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    const { name, description } = this.props.snapshot;
    this.state = {
      name,
      description,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    handleCreateSnapshot: PropTypes.func,
    handleSaveSnapshot: PropTypes.func,
    handleSelectAsset: PropTypes.func,
    snapshot: PropTypes.object,
  };

  saveNameAndDescription = () => {
    const { dispatch, handleSaveSnapshot } = this.props;
    const { name, description } = this.state;
    dispatch(actions.change('snapshot.name', name));
    dispatch(actions.change('snapshot.description', description));
    handleSaveSnapshot();
  };

  render() {
    const {
      classes,
      dataset,
      handleCreateSnapshot,
      handleSaveSnapshot,
      handleSelectAsset,
    } = this.props;
    const { name, description } = this.state;
    return (
      <div className={clsx(classes.rowTwo, classes.saveButtonContainer)}>
        <TextField
          id="snapshotName"
          label="Name"
          variant="outlined"
          size="small"
          fullWidth
          className={classes.textField}
          onChange={(event) => this.setState({ name: event.target.value })}
          value={name}
        />
        <TextField
          id="snapshotDescription"
          label="Description"
          variant="outlined"
          size="small"
          multiline
          rows={3}
          fullWidth
          className={classes.textField}
          onChange={(event) => this.setState({ description: event.target.value })}
          value={description}
        />
        {/* TODO: decide what to do when there's only one asset */}
        <CreateSnapshotDropdown
          options={dataset.schema.assets}
          onSelectedItem={handleSelectAsset}
        />
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            className={clsx(classes.saveButton, { [classes.hide]: !open })}
            onClick={() => handleCreateSnapshot(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className={clsx(classes.cancelButton, { [classes.hide]: !open })}
            onClick={this.saveNameAndDescription}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    snapshot: state.snapshot,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(CreateSnapshotPanel));
